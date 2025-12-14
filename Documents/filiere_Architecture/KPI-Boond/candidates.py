import http.client
import json
import time
import pandas as pd
import os

HOST = "ui.boondmanager.com"
HEADERS = {
    "X-Jwt-Client-Boondmanager": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVG9rZW4iOiIzMzMwMzYyZTc3NjU2YjY1NzkiLCJjbGllbnRUb2tlbiI6Ijc3NjU2YjY1NzkiLCJ0aW1lIjoxNzY1NTQxNzQzLCJtb2RlIjoibm9ybWFsIn0=.EkckzY3EUIsd/o8v46kWkxYv609Coa6N5nCCw6wC7K8=",
    "Content-Type": "application/json",
}
LIMIT = 200
SLEEP = 0.2

def fetch_page(conn, path, offset, limit):
    # TIP: if your instance supports includes, try adding "&include=hrResponsible"
    qs = f"{path}?limit={limit}&offset={offset}"
    conn.request("GET", qs, body="", headers=HEADERS)
    res = conn.getresponse()
    data = res.read()
    if res.status != 200:
        raise RuntimeError(f"HTTP {res.status} {res.reason}: {data[:300].decode('utf-8','ignore')}")
    obj = json.loads(data.decode("utf-8"))
    rows = obj.get("data", [])
    meta = obj.get("meta", {})
    totals = (meta.get("totals") or {}).get("rows")
    # return included if present (for potential join)
    included = obj.get("included", [])
    return rows, totals, meta, included

def fetch_all_candidates():
    conn = http.client.HTTPSConnection(HOST)
    all_rows = []
    all_included = []  # <--- collect included for possible joins

    # --- Try /api/candidates first ---
    path_primary = "/api/candidates?candidateStates=2"
    offset = 0
    totals = None

    try:
        while True:
            rows, totals, meta, inc = fetch_page(conn, path_primary, offset, LIMIT)
            if not rows:
                break
            all_rows.extend(rows)
            all_included.extend(inc or [])
            offset += len(rows)

            t = totals if isinstance(totals, int) else "?"
            print(f"Fetched {len(all_rows)} / {t} from {path_primary} (offset={offset})")

            if isinstance(totals, int) and offset >= totals:
                break
            time.sleep(SLEEP)
    except RuntimeError as e:
        print(f"Primary path failed or not paginated: {e}")
        print("Trying fallback /api/1.0/candidates/search ...")
        path_fallback = "/api/1.0/candidates/search"
        offset = 0
        all_rows = []
        all_included = []
        while True:
            rows, totals, meta, inc = fetch_page(conn, path_fallback, offset, LIMIT)
            if not rows:
                break
            all_rows.extend(rows)
            all_included.extend(inc or [])
            offset += len(rows)
            t = totals if isinstance(totals, int) else "?"
            print(f"Fetched {len(all_rows)} / {t} from {path_fallback} (offset={offset})")
            if isinstance(totals, int) and offset >= totals:
                break
            time.sleep(SLEEP)

    conn.close()
    return all_rows, all_included

# ---------------- NEW: relationship extractors ----------------
def get_hr_responsible_id(row: dict) -> str | None:
    rel = row.get("relationships", {})
    hr = rel.get("hrResponsible", {}) if isinstance(rel, dict) else {}
    data = hr.get("data", {}) if isinstance(hr, dict) else {}
    return data.get("id")

def index_included_users(included_list):
    """Build a dict user_id -> user_attributes from 'included' block."""
    idx = {}
    for inc in included_list or []:
        if inc.get("type") == "user":
            idx[inc.get("id")] = inc.get("attributes", {})
    return idx

def fetch_user_name(conn, user_id: str) -> str | None:
    """
    Resolve a user name from /api/users/{id}.
    Cache between calls to avoid repeated requests.
    """
    if not user_id:
        return None
    # simple on-disk or in-memory cache; here we do in-memory
    if not hasattr(fetch_user_name, "_cache"):
        fetch_user_name._cache = {}
    cache = fetch_user_name._cache
    if user_id in cache:
        return cache[user_id]

    path = f"/api/users/{user_id}"
    conn.request("GET", path, body="", headers=HEADERS)
    res = conn.getresponse()
    data = res.read()
    if res.status != 200:
        # Cache a None to avoid retry loops if user not accessible
        cache[user_id] = None
        return None
    obj = json.loads(data.decode("utf-8"))
    # Expect a single resource: { "data": { "attributes": { ... } } }
    attrs = (obj.get("data") or {}).get("attributes") or {}
    # Try common name fields; adapt if your instance uses different naming
    full = attrs.get("fullName")
    if not full:
        full = " ".join(filter(None, [attrs.get("firstName"), attrs.get("lastName")])).strip() or None
    cache[user_id] = full
    return full
# ----------------------------------------------------------------

def safe_get_name(row):
    attrs = row.get("attributes", {})
    first = attrs.get("firstName", "")
    last = attrs.get("lastName", "")
    return first, last

def main():
    candidates, included = fetch_all_candidates()
    print(f"\nTotal candidates collected: {len(candidates)}\n")

    # Build quick index for included users if present
    included_users = index_included_users(included)

    # A single connection reused for resolving user names
    conn_users = http.client.HTTPSConnection(HOST)

    rows_for_excel = []
    for r in candidates:
        first, last = safe_get_name(r)
        hr_id = get_hr_responsible_id(r)

        # Try to resolve HR name from included users first, then via API call
        hr_name = None
        if hr_id and hr_id in included_users:
            u = included_users[hr_id]
            hr_name = u.get("fullName") or " ".join(
                filter(None, [u.get("firstName"), u.get("lastName")])
            ).strip() or None
        if not hr_name:
            hr_name = fetch_user_name(conn_users, hr_id)

        print(f"{first} {last}".strip(), f"— HR: {hr_name or hr_id or 'N/A'}")

        rows_for_excel.append({
            "id": r.get("id"),
            "FirstName": first,
            "LastName": last,
            "HrResponsibleId": hr_id,
            "HrResponsibleName": hr_name
        })

    conn_users.close()

    # Save to Excel (with engine fallback)
    if rows_for_excel:
        df = pd.DataFrame(rows_for_excel)
        excel_path = "candidates_full.xlsx"
        try:
            df.to_excel(excel_path, index=False, engine="openpyxl")
            print(f"\nSaved with openpyxl -> {excel_path}")
        except ModuleNotFoundError:
            try:
                df.to_excel(excel_path, index=False, engine="xlsxwriter")
                print(f"\nSaved with XlsxWriter -> {excel_path}")
            except ModuleNotFoundError:
                csv_path = excel_path.replace(".xlsx", ".csv")
                df.to_csv(csv_path, index=False)
                print(f"\nNeither openpyxl nor XlsxWriter installed. Wrote CSV -> {csv_path}")

if __name__ == "__main__":
    main()
