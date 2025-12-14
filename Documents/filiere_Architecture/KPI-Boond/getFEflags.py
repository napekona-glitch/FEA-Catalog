
import http.client
import json
import urllib.parse

HOST = "ui.boondmanager.com"
HEADERS = {
    "X-Jwt-Client-Boondmanager": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVG9rZW4iOiIzMzMwMzYyZTc3NjU2YjY1NzkiLCJjbGllbnRUb2tlbiI6Ijc3NjU2YjY1NzkiLCJ0aW1lIjoxNzY1NTQxNzQzLCJtb2RlIjoibm9ybWFsIn0=.EkckzY3EUIsd/o8v46kWkxYv609Coa6N5nCCw6wC7K8=",
    "Accept": "application/json",
    "Content-Type": "application/json"
}

def get_json(path):
    """Perform a GET request and return parsed JSON or None on non-200."""
    conn = http.client.HTTPSConnection(HOST)
    conn.request("GET", path, headers=HEADERS)
    res = conn.getresponse()
    data = res.read()
    conn.close()
    if res.status != 200:
        print("HTTP", res.status, res.reason, data[:200])
        return None
    try:
        return json.loads(data.decode("utf-8"))
    except Exception as e:
        print("JSON decode error:", e)
        return None

def extract_items(payload):
    """
    Normalize payload into a list of flag objects.
    Supports:
      - JSON:API: { "data": [ ... ] }
      - List: [ ... ]
      - Wrapped: { "items": [ ... ] }
    """
    if payload is None:
        return []
    if isinstance(payload, list):
        return payload
    if isinstance(payload, dict):
        if isinstance(payload.get("data"), list):
            return payload["data"]
        if isinstance(payload.get("items"), list):
            return payload["items"]
    return []

def get_name(flag):
    """
    Get the display name:
    - JSON:API: flag["attributes"]["name"]
    Fallbacks: "name" at root (if any).
    """
    attrs = flag.get("attributes") or {}
    name = attrs.get("name") or flag.get("name") or ""
    return str(name)

def get_id(flag):
    """Return the flag id (string)."""
    return flag.get("id") or flag.get("flagId") or flag.get("_id")

def list_flags_fe():
    """
    Fetch flags, filter those whose name starts with 'FE',
    and print 'id<TAB>name'.
    """
    # First try plain call
    payload = get_json("/api/flags")
    items = extract_items(payload)

    # If empty, try pagination style just in case
    if not items:
        page = 1
        per_page = 200
        while True:
            query = urllib.parse.urlencode({"page": page, "perPage": per_page})
            p_payload = get_json(f"/api/flags?{query}")
            p_items = extract_items(p_payload)
            if not p_items:
                break
            items.extend(p_items)
            if len(p_items) < per_page:
                break
            page += 1

    # Filter names starting with "FE" (case-sensitive as requested)
    filtered = []
    for flag in items:
        name = get_name(flag).strip()
        if name.startswith("FE"):
            filtered.append(flag)

    # Print id and name
    if filtered:
        for f in filtered:
            fid = get_id(f)
            fname = get_name(f)
            if fid is not None and fname:
                print(f"{fid}\t{fname}")
    else:
        # Helpful diagnostics
        sample = items[:3]
        print("No flags starting with 'FE' found.")
        print("Sample of parsed items (first 3) to verify structure:")
        print(json.dumps(sample, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    list_flags_fe()

