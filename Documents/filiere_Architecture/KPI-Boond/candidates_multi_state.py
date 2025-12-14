import sys
import argparse
import http.client
import json
import time
import csv
import gzip
from datetime import datetime
from urllib.parse import urlencode
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Any

# -------------------- CONFIG --------------------
HOST = "ui.boondmanager.com"
HEADERS = {
    "X-Jwt-Client-BoondManager": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVG9rZW4iOiIzMzMwMzYyZTc3NjU2YjY1NzkiLCJjbGllbnRUb2tlbiI6Ijc3NjU2YjY1NzkiLCJ0aW1lIjoxNzY1NTQxNzQzLCJtb2RlIjoibm9ybWFsIn0=.EkckzY3EUIsd/o8v46kWkxYv609Coa6N5nCCw6wC7K8=",
    "Accept": "application/json",
    "Accept-Encoding": "gzip",
    "Content-Type": "application/json",
}

# Performance tuning
MAX_RESULTS = 500  # API documentation: maxResults between 1-500, default: 30
TIMEOUT = 30

def fetch_candidates_for_state(state: str) -> List[Dict]:
    """Fetch all candidates for a single state."""
    print(f"[INFO] Fetching candidates for state {state}")
    
    conn = http.client.HTTPSConnection(HOST, timeout=TIMEOUT)
    all_candidates = []
    offset = 0
    
    try:
        while True:
            params = {
                'offset': offset,
                'maxResults': MAX_RESULTS,
                'candidateStates': state,
                'columns': 'id,firstName,lastName,availability,updateDate,state',
                'include': 'mainManager,hrManager,agency,pole',
                'returnMoreData': 'hrManager'  # Include HR manager data
            }
            url = f'/api/candidates?{urlencode(params)}'
            
            conn.request('GET', url, headers=HEADERS)
            response = conn.getresponse()
            data = response.read()
            
            if response.getheader('Content-Encoding') == 'gzip':
                data = gzip.decompress(data)
            
            if response.status != 200:
                print(f"[ERROR] API error: HTTP {response.status}")
                break
            
            result = json.loads(data.decode('utf-8-sig'))
            candidates = result.get('data', [])
            included = result.get('included', [])
            totals = (result.get('meta', {}).get('totals') or {}).get('rows')
            
            if not candidates:
                break
            
            # Process included data
            included_users = {}
            for item in included:
                item_type = item.get("type")
                item_id = item.get("id")
                # Create unique key based on type and ID to avoid conflicts
                unique_key = f"{item_type}_{item_id}"
                if item_type in ["user", "resource", "agency", "pole"]:
                    included_users[unique_key] = item
            
            # Process candidates
            for candidate in candidates:
                attrs = candidate.get("attributes", {})
                relationships = candidate.get("relationships", {})
                
                # Get mainManager info
                main_manager = relationships.get("mainManager", {}).get("data", {})
                main_manager_id = main_manager.get("id") if main_manager else ""
                main_manager_name = ""
                if main_manager_id:
                    manager_key = f"resource_{main_manager_id}"  # Main managers are resources
                    if manager_key in included_users:
                        main_item = included_users[manager_key]
                        main_attrs = main_item.get("attributes", {})
                        main_manager_name = f"{main_attrs.get('firstName', '')} {main_attrs.get('lastName', '')}".strip()
                
                # Get other relationships
                agency = relationships.get("agency", {}).get("data", {})
                agency_id = agency.get("id") if agency else ""
                agency_name = ""
                if agency_id:
                    agency_key = f"agency_{agency_id}"
                    if agency_key in included_users:
                        agency_item = included_users[agency_key]
                        agency_attrs = agency_item.get("attributes", {})
                        agency_name = agency_attrs.get("name", "")
                
                pole = relationships.get("pole", {}).get("data", {})
                pole_id = pole.get("id") if pole else ""
                pole_name = ""
                if pole_id:
                    pole_key = f"pole_{pole_id}"
                    if pole_key in included_users:
                        pole_item = included_users[pole_key]
                        pole_attrs = pole_item.get("attributes", {})
                        pole_name = pole_attrs.get("name", "")
                
                # Get HR Manager info (now available with returnMoreData parameter)
                hr_manager = relationships.get("hrManager", {}).get("data", {})
                hr_id = hr_manager.get("id") if hr_manager else ""
                hr_name = ""
                if hr_id:
                    hr_key = f"resource_{hr_id}"  # HR managers are resources
                    if hr_key in included_users:
                        hr_item = included_users[hr_key]
                        hr_attrs = hr_item.get("attributes", {})
                        hr_name = f"{hr_attrs.get('firstName', '')} {hr_attrs.get('lastName', '')}".strip()
                
                # Format dates
                update_date = attrs.get("updateDate", "")
                if update_date:
                    try:
                        if "T" in update_date:
                            update_date = update_date.split("T")[0]
                        update_date = datetime.strptime(update_date, "%Y-%m-%d").strftime("%Y-%m-%d")
                    except (ValueError, TypeError):
                        update_date = ""
                
                all_candidates.append({
                    "MainManagerId": main_manager_id,
                    "MainManagerName": main_manager_name,
                    "AgencyId": agency_id,
                    "AgencyName": agency_name,
                    "PoleId": pole_id,
                    "PoleName": pole_name,
                    "id": candidate.get("id"),
                    "FirstName": attrs.get("firstName", ""),
                    "LastName": attrs.get("lastName", ""),
                    "Availability": attrs.get("availability", ""),
                    "UpdateDate": update_date,
                    "State": attrs.get("state", ""),
                    "HrResponsibleId": hr_id or "",
                    "HrResponsibleName": hr_name
                })
            
            offset += len(candidates)
            print(f"[PROGRESS] State {state}: Fetched {len(all_candidates)} candidates, offset {offset}")
            
            if isinstance(totals, int) and offset >= totals:
                break
    
    finally:
        conn.close()
    
    return all_candidates

def main():
    parser = argparse.ArgumentParser(description='Export candidates from BoondManager API')
    parser.add_argument('--state', type=str, default='2', 
                       help='Candidate state filter (default: 2). Use comma for multiple states: --state 1,2,3')
    parser.add_argument('--output', type=str, default='candidates_optimized.csv',
                       help='Output CSV file (default: candidates_optimized.csv)')
    
    args = parser.parse_args()
    
    states = [s.strip() for s in args.state.split(',')]
    output_file = args.output
    
    print(f"Starting candidate export for states: {', '.join(states)}")
    print(f"Output file: {output_file}")
    
    # Process each state separately
    all_candidates = []
    seen_ids = set()
    
    for state in states:
        candidates = fetch_candidates_for_state(state)
        print(f"[DONE] State {state}: {len(candidates)} candidates")
        
        # Add unique candidates
        for candidate in candidates:
            candidate_id = candidate.get("id")
            if candidate_id and candidate_id not in seen_ids:
                seen_ids.add(candidate_id)
                all_candidates.append(candidate)
    
    # Write to CSV
    csv_path = Path(output_file)
    csv_file = open(csv_path, "w", newline="", encoding="utf-8-sig")
    fieldnames = ["MainManagerId", "MainManagerName", "HrResponsibleId", "HrResponsibleName", "AgencyId", "AgencyName", "PoleId", "PoleName", "id", "FirstName", "LastName", "Availability", "UpdateDate", "State"]
    csv_writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
    csv_writer.writeheader()
    csv_writer.writerows(all_candidates)
    csv_file.close()
    
    print(f"\n[DONE] Total unique candidates: {len(all_candidates)}")
    print(f"[INFO] CSV written: {output_file}")
    return 0

if __name__ == "__main__":
    exit(main())
