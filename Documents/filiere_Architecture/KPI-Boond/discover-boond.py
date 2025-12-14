
import http.client, json, urllib.parse

HOST = "ui.boondmanager.com"
HEADERS = {"X-Jwt-Client-Boondmanager": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVG9rZW4iOiIzMzMwMzYyZTc3NjU2YjY1NzkiLCJjbGllbnRUb2tlbiI6Ijc3NjU2YjY1NzkiLCJ0aW1lIjoxNzY1NTQxNzQzLCJtb2RlIjoibm9ybWFsIn0=.EkckzY3EUIsd/o8v46kWkxYv609Coa6N5nCCw6wC7K8=", "Content-Type": "application/json"}

def count(path):
    conn = http.client.HTTPSConnection(HOST)
    conn.request("GET", path, headers=HEADERS)
    res = conn.getresponse()
    data = res.read()
    conn.close()
    if res.status != 200:
        print("HTTP", res.status, res.reason, data[:200])
        return None
    obj = json.loads(data.decode("utf-8"))
    return (obj.get("meta", {}).get("totals", {}) or {}).get("rows")

def try_flags(flag_id):
    base = "/api/candidates/search"
    # Try a few shapes
    variants = [
        f"{base}?flags={flag_id}",
        f"{base}?flags[]={flag_id}",
        f"{base}?{urllib.parse.urlencode({'filters[flags]': flag_id})}",
        f"{base}?{urllib.parse.urlencode({'filters[flags][]': flag_id})}",
        f"/api/candidates?flags={flag_id}",
        f"/api/candidates?flags[]={flag_id}",
        f"/api/candidates?{urllib.parse.urlencode({'filters[flags]': flag_id})}",
        f"/api/candidates?{urllib.parse.urlencode({'filters[flags][]': flag_id})}",
    ]
    for v in variants:
        c = count(v)
        print(f"{v} -> totals={c}")

# Try with an ID you believe corresponds to a flag
try_flags(1)
