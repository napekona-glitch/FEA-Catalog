
import http.client
import json
import time
import os
import csv
import gzip
from io import BytesIO
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse
from datetime import date, timedelta

# -------------------- CONFIG --------------------
HOST = "ui.boondmanager.com"
HEADERS = {
    "X-Jwt-Client-BoondManager": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVG9rZW4iOiIzMzMwMzYyZTc3NjU2YjY1NzkiLCJjbGllbnRUb2tlbiI6Ijc3NjU2YjY1NzkiLCJ0aW1lIjoxNzY1NTQxNzQzLCJtb2RlIjoibm9ybWFsIn0=.EkckzY3EUIsd/o8v46kWkxYv609Coa6N5nCCw6wC7K8=",  # ensure correct header name
    "Accept": "application/json",
    "Accept-Encoding": "gzip",
    "Content-Type": "application/json",
}
LIMIT = 500               # larger pages -> fewer round trips (adjust to your rate limits)
INCLUDE_HR = True         # include=hrResponsible to avoid /users/{id} lookups
CANDIDATE_STATES = "2"    # your existing filter
OUTPUT_CSV = "candidates_min.csv"
OUTPUT_XLSX = None        # set to "candidates_full.xlsx" if you prefer Excel (uses more memory)
PROGRESS_EVERY = 1000     # progress log every N rows
TIMEOUT = 30              # connection timeout (seconds)
# Availability filter: keep candidates whose availability date is within next N months
FILTER_AVAIL_MONTHS = 3   # set to None to disable client-side availability filtering

# -------------------- HELPERS --------------------
def build_url(path: str, extra_params: dict | None = None) -> str:
    """
    Safely merge extra query parameters into a path that may already have a query.
    """
    parsed = urlparse(path)
    base_qs = parse_qs(parsed.query, keep_blank_values=True)
    # Flatten and update with extra_params
    if extra_params:
        for k, v in extra_params.items():
            base_qs[k] = [str(v)]
    new_query = urlencode({k: v[0] for k, v in base_qs.items()}, doseq=False)
    return urlunparse((parsed.scheme, parsed.netloc, parsed.path, parsed.params, new_query, parsed.fragment))

def decompress_if_gzip(res, raw_bytes: bytes) -> bytes:
    enc = res.getheader("Content-Encoding") or ""
    if enc.lower() == "gzip":
        return gzip.decompress(raw_bytes)
    return raw_bytes

def fetch_page(conn, path, offset, limit):
    # Base query: pagination only (limit/offset)
    qs = build_url(path, {"limit": limit, "offset": offset})
    conn.request("GET", qs, body="", headers=HEADERS)
    res = conn.getresponse()
    raw = res.read()
    data = decompress_if_gzip(res, raw)

    if res.status != 200:
        # Provide a short snippet of the body for debugging
        snippet = data[:300].decode("utf-8", "ignore")
        raise RuntimeError(f"HTTP {res.status} {res.reason}: {snippet}")

    obj = json.loads(data.decode("utf-8"))
    rows = obj.get("data", []) or []
    meta = obj.get("meta", {}) or {}
    totals = (meta.get("totals") or {}).get("rows")
    included = obj.get("included", []) or []
    return rows, totals, meta, included

def get_availability_date(row: dict) -> str | None:
    """
    Adapt this to your tenant. Common names: 'availabilityDate', 'availableDate'.
    """
    attrs = row.get("attributes", {}) or {}
    return attrs.get("availabilityDate") or attrs.get("availableDate")

def within_next_months(date_str: str, months: int) -> bool:
    if not date_str:
        return False
    try:
        y, m, d = map(int, date_str[:10].split("-"))
        target = date(y, m, d)
    # Fallback if format differs
    except Exception:
        return False
    today = date.today()
    # Add N months as ~ (365/12)*months days; or a safer month arithmetic:
    # We'll use 90-day windows for 3 months to keep it simple and robust.
    days = int(round(30.4167 * months))
    return target <= (today + timedelta(days=days))

def get_hr_responsible_id(row: dict) -> str | None:
    rel = row.get("relationships", {}) or {}
    hr = rel.get("hrResponsible", {}) or {}
    data = hr.get("data", {}) or {}
    return data.get("id")

def index_included_users(included_list):
    idx = {}
    for inc in included_list or []:
        if inc.get("type") == "user":
            idx[inc.get("id")] = inc.get("attributes", {}) or {}
    return idx

def full_name_from_attrs(attrs: dict) -> str | None:
    if not attrs:
        return None
    return attrs.get("fullName") or (" ".join(filter(None, [attrs.get("firstName"), attrs.get("lastName")])) or None)

# -------------------- MAIN FLOW --------------------
def fetch_all_candidates():
    conn = http.client.HTTPSConnection(HOST, timeout=TIMEOUT)
    all_included = []

    # Primary path (JSON:API style): keep columns tight; include HR for name resolution
    base_params = {
        "candidateStates": CANDIDATE_STATES,
        "columns": "id,firstName,lastName,availabilityDate",  # keep payload small
    }
    if INCLUDE_HR:
        base_params["include"] = "hrResponsible"
    path_primary = build_url("/api/candidates", base_params)

    offset = 0
    totals = None
    collected = 0

    # Stream to CSV if configured
    csv_file = None
    csv_writer = None
    if OUTPUT_CSV:
        csv_file = open(OUTPUT_CSV, "w", newline="", encoding="utf-8")
        csv_writer = csv.DictWriter(csv_file, fieldnames=[
            "id", "FirstName", "LastName", "AvailabilityDate", "HrResponsibleId", "HrResponsibleName"
        ])
        csv_writer.writeheader()

    # If Excel requested, we’ll accumulate rows (uses memory).
    rows_for_excel = [] if OUTPUT_XLSX else None

    # Adaptive backoff variables
    backoff = 0.0  # sleep only if we hit 429/503

    try:
        while True:
            try:
                rows, totals, meta, inc = fetch_page(conn, path_primary, offset, LIMIT)
                all_included.extend(inc or [])
            except RuntimeError as e:
                # If primary fails once, try fallback search endpoint
                print(f"[WARN] Primary path failed or not paginated: {e}")
                print("[INFO] Trying fallback /api/1.0/candidates/search ...")
                path_fallback = build_url("/api/1.0/candidates/search", {
                    "columns": "id,firstName,lastName,availabilityDate",
                })
                # reset offset and included
                offset = 0
                all_included = []
                rows, totals, meta, inc = fetch_page(conn, path_fallback, offset, LIMIT)
                all_included.extend(inc or [])
                # from now on, keep using fallback inside loop
                path_primary = path_fallback

            # Stop if nothing returned
            if not rows:
                break

            included_users = index_included_users(all_included)

            # Process each candidate
            for r in rows:
                attrs = r.get("attributes", {}) or {}
                first = attrs.get("firstName", "")
                last = attrs.get("lastName", "")
                avail = get_availability_date(r)
                hr_id = get_hr_responsible_id(r)
                hr_name = None
                if hr_id and hr_id in included_users:
                    hr_name = full_name_from_attrs(included_users[hr_id])

                # Optional client-side availability filter
                if FILTER_AVAIL_MONTHS is not None:
                    if not within_next_months(avail, FILTER_AVAIL_MONTHS):
                        continue  # skip candidate not available within the window

                row_out = {
                    "id": r.get("id"),
                    "FirstName": first,
                    "LastName": last,
                    "AvailabilityDate": avail,
                    "HrResponsibleId": hr_id,
                    "HrResponsibleName": hr_name,
                }

                if csv_writer:
                    csv_writer.writerow(row_out)
                if rows_for_excel is not None:
                    rows_for_excel.append(row_out)

                collected += 1

                # light progress
                if collected % PROGRESS_EVERY == 0:
                    t = totals if isinstance(totals, int) else "?"
                    print(f"[INFO] Processed {collected} candidates (fetched {offset + len(rows)} / {t})")

            # Advance pagination window
            offset += len(rows)

            # Finish if we reached totals
            if isinstance(totals, int) and offset >= totals:
                break

            # No generic sleep; only apply backoff if we had rate-limits before
            if backoff > 0:
                time.sleep(backoff)
                # Decrease backoff gradually
                backoff = max(0.0, backoff * 0.5)

        # close CSV if any
        if csv_file:
            csv_file.close()

    finally:
        conn.close()

    # Optional Excel output (uses memory)
    if OUTPUT_XLSX and rows_for_excel:
        try:
            import pandas as pd
            df = pd.DataFrame(rows_for_excel)
            df.to_excel(OUTPUT_XLSX, index=False, engine="openpyxl")
            print(f"[OK] Saved Excel -> {OUTPUT_XLSX}")
        except ModuleNotFoundError:
            # fallback to CSV
            alt_csv = OUTPUT_XLSX.replace(".xlsx", ".csv")
            with open(alt_csv, "w", newline="", encoding="utf-8") as f:
                w = csv.DictWriter(f, fieldnames=list(rows_for_excel[0].keys()))
                w.writeheader()
                w.writerows(rows_for_excel)
            print(f"[OK] openpyxl missing. Wrote CSV -> {alt_csv}")

    return collected

def main():
    total_kept = fetch_all_candidates()
    print(f"\n[DONE] Candidates kept after availability filter: {total_kept}")
    if OUTPUT_CSV:
        print(f"[INFO] CSV written: {OUTPUT_CSV}")

if __name__ == "__main__":
    main()