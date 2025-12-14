import http.client
import json
import gzip
from urllib.parse import urlencode

HOST = 'ui.boondmanager.com'
HEADERS = {
    'X-Jwt-Client-BoondManager': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVG9rZW4iOiIzMzMwMzYyZTc3NjU2YjY1NzkiLCJjbGllbnRUb2tlbiI6Ijc3NjU2YjY1NzkiLCJ0aW1lIjoxNzY1NTQxNzQzLCJtb2RlIjoibm9ybWFsIn0=.EkckzY3EUIsd/o8v46kWkxYv609Coa6N5nCCw6wC7K8=',
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip',
    'Content-Type': 'application/json',
}

def debug_agency():
    conn = http.client.HTTPSConnection(HOST, timeout=30)
    
    params = {
        'candidateStates': '2',
        'maxResults': 2,
        'offset': 0,
        'columns': 'id,firstName,lastName',
        'include': 'mainManager,hrManager,agency,pole',
        'returnMoreData': 'hrManager'
    }
    url = f'/api/candidates?{urlencode(params)}'
    
    conn.request('GET', url, headers=HEADERS)
    response = conn.getresponse()
    data = response.read()
    
    if response.getheader('Content-Encoding') == 'gzip':
        data = gzip.decompress(data)
    
    if response.status == 200:
        result = json.loads(data.decode('utf-8-sig'))
        
        print('\n=== Agency Data in Included Section ===')
        included = result.get('included', [])
        for item in included:
            if item.get('type') == 'agency':
                print(f'Agency ID: {item.get("id")}')
                print(f'Agency Attributes: {item.get("attributes", {})}')
                print(f'Agency Name: {item.get("attributes", {}).get("name")}')
        
        print('\n=== First Candidate Agency Relationship ===')
        candidate = result['data'][0]
        relationships = candidate.get('relationships', {})
        agency_rel = relationships.get('agency', {}).get('data', {})
        print(f'Agency Relationship: {agency_rel}')
        
    else:
        print(f'HTTP {response.status}: {data[:200]}')
    
    conn.close()

if __name__ == '__main__':
    debug_agency()
