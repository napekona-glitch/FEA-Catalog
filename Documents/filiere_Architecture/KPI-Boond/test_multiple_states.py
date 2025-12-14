import http.client
import json
import gzip
from urllib.parse import urlencode

# Test multiple states
HOST = 'ui.boondmanager.com'
HEADERS = {
    'X-Jwt-Client-BoondManager': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVG9rZW4iOiIzMzMwMzYyZTc3NjU2YjY1NzkiLCJjbGllbnRUb2tlbiI6Ijc3NjU2YjY1NzkiLCJ0aW1lIjoxNzY1NTQxNzQzLCJtb2RlIjoibm9ybWFsIn0=.EkckzY3EUIsd/o8v46kWkxYv609Coa6N5nCCw6wC7K8=',
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip',
    'Content-Type': 'application/json',
}

def test_multiple_states():
    conn = http.client.HTTPSConnection(HOST, timeout=30)
    try:
        # Test with multiple states
        params = {
            'offset': 0,
            'limit': 10,
            'candidateStates': '1&2&6',  # Try multiple states
            'columns': 'id,firstName,lastName,state'
        }
        url = f'/api/candidates?{urlencode(params)}'
        print(f'Testing URL: {url}')
        
        conn.request('GET', url, headers=HEADERS)
        response = conn.getresponse()
        data = response.read()
        
        if response.getheader('Content-Encoding') == 'gzip':
            data = gzip.decompress(data)
        
        print(f'HTTP Status: {response.status}')
        
        if response.status == 200:
            result = json.loads(data)
            candidates = result.get('data', [])
            print(f'Found {len(candidates)} candidates')
            
            # Check states in results
            states_found = set()
            for candidate in candidates:
                state = candidate.get('attributes', {}).get('state')
                states_found.add(str(state))
            
            print(f'States in results: {sorted(states_found)}')
            
            # Show first few candidates
            for i, candidate in enumerate(candidates[:3]):
                attrs = candidate.get('attributes', {})
                print(f'  Candidate {i+1}: ID={candidate.get("id")}, State={attrs.get("state")}, Name={attrs.get("firstName")} {attrs.get("lastName")}')
        else:
            print(f'Error: {response.status}')
            print(f'Response: {data[:500]}')
    finally:
        conn.close()

# Test multiple states
test_multiple_states()
