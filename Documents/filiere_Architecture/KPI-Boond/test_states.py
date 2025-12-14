import http.client
import json
import gzip
from urllib.parse import urlencode

# Test with different state values
HOST = 'ui.boondmanager.com'
HEADERS = {
    'X-Jwt-Client-BoondManager': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVG9rZW4iOiIzMzMwMzYyZTc3NjU2YjY1NzkiLCJjbGllbnRUb2tlbiI6Ijc3NjU2YjY1NzkiLCJ0aW1lIjoxNzY1NTQxNzQzLCJtb2RlIjoibm9ybWFsIn0=.EkckzY3EUIsd/o8v46kWkxYv609Coa6N5nCCw6wC7K8=',
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip',
    'Content-Type': 'application/json',
}

def test_state_filter(state_value):
    conn = http.client.HTTPSConnection(HOST, timeout=30)
    try:
        params = {
            'offset': 0,
            'limit': 5,
            'candidateStates': state_value,
            'columns': 'id,firstName,lastName,state'
        }
        url = f'/api/candidates?{urlencode(params)}'
        
        conn.request('GET', url, headers=HEADERS)
        response = conn.getresponse()
        data = response.read()
        
        if response.getheader('Content-Encoding') == 'gzip':
            data = gzip.decompress(data)
        
        if response.status == 200:
            result = json.loads(data)
            candidates = result.get('data', [])
            print(f'State {state_value}: Found {len(candidates)} candidates')
            if candidates:
                first_candidate = candidates[0]
                candidate_state = first_candidate.get('attributes', {}).get('state')
                print(f'  First candidate ID: {first_candidate.get("id")}, State: {candidate_state}')
        else:
            print(f'State {state_value}: HTTP {response.status}')
    finally:
        conn.close()

# Test different state values
for state in ['1', '2', '3', '4', '5']:
    test_state_filter(state)
