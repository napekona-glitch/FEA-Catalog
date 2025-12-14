import sys
import argparse
import http.client
import json
import time
import csv
import gzip
import random
from datetime import date, timedelta, datetime
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
LIMIT = 1000  # Number of candidates per API call              # Larger pages for fewer API calls
TIMEOUT = 30              # Connection timeout (seconds)
MAX_RETRIES = 3           # Max retries for failed requests
BASE_DELAY = 1.0          # Base delay for exponential backoff

# Application settings
INCLUDE_HR = True         # Include HR responsible info
CANDIDATE_STATES = "2"    # Filter candidates by state
OUTPUT_CSV = "candidates_optimized.csv"
OUTPUT_XLSX = None        # Set to a filename to enable Excel export
PROGRESS_EVERY = 1000     # Log progress every N candidates
FILTER_AVAIL_MONTHS = 3   # Filter candidates available within N months (None to disable)

# No threading in this version

# -------------------- HELPERS --------------------
def build_url(path: str, params: Optional[Dict] = None) -> str:
    """Build URL with query parameters."""
    if not params:
        return path
    return f"{path}?{urlencode(params, doseq=True)}"

def decompress_gzip(data: bytes) -> bytes:
    """Decompress gzipped response if needed."""
    try:
        return gzip.decompress(data)
    except (gzip.BadGzipFile, OSError):
        return data

def fetch_with_retry(
    conn: http.client.HTTPSConnection,
    path: str,
    offset: int,
    limit: int
) -> Tuple[List[Dict], Optional[int], Dict, List[Dict]]:
    """Fetch a page with retry logic and exponential backoff."""
    last_error = None
    for attempt in range(MAX_RETRIES):
        try:
            params = {
                "offset": offset,
                "limit": limit,
                "candidateStates": CANDIDATE_STATES,
                "columns": "id,firstName,lastName,availabilityDate"
            }
            if INCLUDE_HR:
                params["include"] = "hrResponsible"
                
            url = f"{path}?{urlencode(params)}"
            conn.request("GET", url, headers=HEADERS)
            response = conn.getresponse()
            data = response.read()
            
            if response.getheader("Content-Encoding") == "gzip":
                data = gzip.decompress(data)
            
            if response.status != 200:
                error_msg = data.decode('utf-8', 'ignore')[:500]
                raise RuntimeError(f"HTTP {response.status}: {error_msg}")
            
            result = json.loads(data)
            return (
                result.get("data", []),
                (result.get("meta", {}).get("totals") or {}).get("rows"),
                result.get("meta", {}),
                result.get("included", [])
            )
            
        except (http.client.HTTPException, OSError, json.JSONDecodeError, RuntimeError) as e:
            last_error = e
            if attempt == MAX_RETRIES - 1:
                print(f"[ERROR] API request failed after {MAX_RETRIES} attempts: {e}")
                raise
            delay = min(BASE_DELAY * (2 ** attempt) + random.uniform(0, 1), 10)
            print(f"[RETRY] Attempt {attempt + 1}/{MAX_RETRIES}, waiting {delay:.1f}s: {str(e)[:100]}")
            time.sleep(delay)
    
    print("[ERROR] Max retries reached. Please check your connection and API endpoint.")
    return [], None, {}, []

def process_candidate_batch(candidates: List[Dict], included_users: Dict[str, Dict]) -> List[Dict]:
    """Process a batch of candidates and include HR manager information."""
    results = []
    for candidate in candidates:
        attrs = candidate.get("attributes", {})
        relationships = candidate.get("relationships", {})
        
        # Try different relationship names for HR manager
        hr_id = None
        hr_name = ""
        
        # Get mainManager info
        main_manager = relationships.get("mainManager", {}).get("data", {})
        main_manager_id = main_manager.get("id") if main_manager else ""
        main_manager_name = ""
        if main_manager_id and main_manager_id in included_users:
            main_item = included_users[main_manager_id]
            main_attrs = main_item.get("attributes", {})
            main_manager_name = f"{main_attrs.get('firstName', '')} {main_attrs.get('lastName', '')}".strip()
        
        # Get agency info
        agency = relationships.get("agency", {}).get("data", {})
        agency_id = agency.get("id") if agency else ""
        agency_name = ""
        if agency_id and agency_id in included_users:
            agency_item = included_users[agency_id]
            agency_attrs = agency_item.get("attributes", {})
            agency_name = agency_attrs.get("name", "")
        
        # Get pole info
        pole = relationships.get("pole", {}).get("data", {})
        pole_id = pole.get("id") if pole else ""
        pole_name = ""
        if pole_id and pole_id in included_users:
            pole_item = included_users[pole_id]
            pole_attrs = pole_item.get("attributes", {})
            pole_name = pole_attrs.get("name", "")
        
        # Check for hrManager (from your JSON example)
        hr_manager = relationships.get("hrManager", {}).get("data", {})
        if hr_manager:
            hr_id = hr_manager.get("id")
        
        # Check for mainManager (from API response) - reuse if already found
        if not hr_id and main_manager_id:
            hr_id = main_manager_id
        
        # Find HR manager in included users/resources
        if hr_id and hr_id in included_users:
            hr_item = included_users[hr_id]
            hr_attrs = hr_item.get("attributes", {})
            hr_name = f"{hr_attrs.get('firstName', '')} {hr_attrs.get('lastName', '')}".strip()
        
        # Format availability date if it exists
        avail_date = attrs.get("availabilityDate", "")
        if avail_date:
            try:
                # Handle different date formats
                if "T" in avail_date:
                    avail_date = avail_date.split("T")[0]
                avail_date = datetime.strptime(avail_date, "%Y-%m-%d").strftime("%Y-%m-%d")
            except (ValueError, TypeError):
                avail_date = ""
        
        # Get availability status
        availability = attrs.get("availability", "")
        
        # Format update date
        update_date = attrs.get("updateDate", "")
        if update_date:
            try:
                if "T" in update_date:
                    update_date = update_date.split("T")[0]
                update_date = datetime.strptime(update_date, "%Y-%m-%d").strftime("%Y-%m-%d")
            except (ValueError, TypeError):
                update_date = ""
        
        # Get state
        state = attrs.get("state", "")
        
        # Get candidateState
        candidate_state = attrs.get("candidateState", "")
        
        # Apply availability filter if active
        if FILTER_AVAIL_MONTHS is not None and avail_date:
            try:
                y, m, d = map(int, avail_date.split("-"))
                target = date(y, m, d)
                days = int(30.4167 * FILTER_AVAIL_MONTHS)
                if target > (date.today() + timedelta(days=days)):
                    continue
            except (ValueError, IndexError):
                pass  # Skip invalid dates
        
        results.append({
            "MainManagerId": main_manager_id,
            "MainManagerName": main_manager_name,
            "AgencyId": agency_id,
            "AgencyName": agency_name,
            "PoleId": pole_id,
            "PoleName": pole_name,
            "id": candidate.get("id"),
            "FirstName": attrs.get("firstName", ""),
            "LastName": attrs.get("lastName", ""),
            "AvailabilityDate": avail_date,
            "Availability": availability,
            "UpdateDate": update_date,
            "State": state,
            "CandidateState": candidate_state,
            "HrResponsibleId": hr_id or "",
            "HrResponsibleName": hr_name
        })
    
    return results

def write_batch(csv_writer, batch, csv_file):
    """Write a batch of records to CSV and flush the file."""
    csv_writer.writerows(batch)
    csv_file.flush()  # Ensure data is written to disk
# -------------------- MAIN FLOW --------------------
def fetch_all_candidates() -> int:
    """Fetch and process all candidates."""
    # Initialize CSV writer
    csv_path = Path(OUTPUT_CSV)
    csv_path.unlink(missing_ok=True)
    csv_file = open(csv_path, "w", newline="", encoding="utf-8")
    fieldnames = ["MainManagerId", "MainManagerName", "AgencyId", "AgencyName", "PoleId", "PoleName", "id", "FirstName", "LastName", "AvailabilityDate", "Availability", "UpdateDate", "State", "CandidateState", "HrResponsibleId", "HrResponsibleName"]
    csv_writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
    csv_writer.writeheader()
    
    # Single connection for simplicity
    conn = http.client.HTTPSConnection(HOST, timeout=TIMEOUT)

    try:
        # API endpoint
        api_path = "/api/candidates"
        
        # Debug: Print the full URL being called
        def get_full_url(path, offset_val, limit_val):
            params = {
                "offset": offset_val,
                "limit": limit_val,
                "candidateStates": CANDIDATE_STATES,
                "columns": "id,firstName,lastName,availabilityDate,availability,updateDate,state,candidateState",
                "include": "mainManager,hrManager,agency,pole"
            }
            return f"https://{HOST}{path}?{urlencode(params)}"
        offset = 0
        total_processed = 0
        start_time = time.time()
        last_log_time = start_time
        included_users = {}
        
        while True:
            try:
                # Use the working API endpoint
                full_url = get_full_url(api_path, offset, LIMIT)
                print(f"[DEBUG] Fetching: {full_url}")
                
                # Fetch a page of data
                rows, totals, _, included = fetch_with_retry(
                    conn, api_path, offset, LIMIT
                )
                
                # Update included users - include all relevant types
                for item in included:
                    item_type = item.get("type")
                    if item_type in ["user", "resource", "agency", "pole"]:  # Check all types
                        included_users[item.get("id")] = item
                
                if not rows:
                    print("[INFO] No more data available")
                    break
                
                # Process batch
                batch = process_candidate_batch(rows, included_users)
                if batch:
                    write_batch(csv_writer, batch, csv_file)
                    total_processed += len(batch)
                
                # Log progress
                current_time = time.time()
                if current_time - last_log_time >= 5:  # Log every 5 seconds
                    rate = total_processed / (current_time - start_time) * 60
                    print(
                        f"[PROGRESS] Processed {total_processed} candidates "
                        f"({rate:.1f} candidates/min)"
                    )
                    last_log_time = current_time
                
                offset += len(rows)
                if isinstance(totals, int) and offset >= totals:
                    break
                
            except Exception as e:
                print(f"[ERROR] Failed to fetch candidates: {e}")
                print(f"[DEBUG] Error details: {str(e)}")
                if hasattr(e, '__dict__'):
                    print(f"[DEBUG] Error attributes: {e.__dict__}")
                break
                    
        # Final log
        total_time = (time.time() - start_time) / 60  # in minutes
        print(
            f"\n[COMPLETE] Processed {total_processed} candidates in {total_time:.1f} minutes "
            f"({total_processed/max(total_time, 0.1):.1f} candidates/min)"
        )
        
        return total_processed
        
    except Exception as e:
        print(f"[ERROR] API request failed: {e}")
        print("Please verify:")
        print("1. Your internet connection")
        print("2. The API endpoint is correct")
        print("3. Your authentication token is valid")
        print(f"4. The URL being called: {get_full_url(api_path, offset, LIMIT) if 'api_path' in locals() else 'N/A'}")
        return 0
    finally:
        # Cleanup
        try:
            csv_file.close()
            conn.close()
        except:
            pass

def main():
    """Main function with argument parsing."""
    parser = argparse.ArgumentParser(description='Export candidates from BoondManager API')
    parser.add_argument('--state', type=str, default='2', 
                       help='Candidate state filter (default: 2). Use comma for multiple states: --state 1,2,3')
    parser.add_argument('--output', type=str, default='candidates_optimized.csv',
                       help=f'Output CSV file (default: candidates_optimized.csv)')
    parser.add_argument('--limit', type=int, default=1000,
                       help=f'Number of candidates per API call (default: 1000)')
    
    args = parser.parse_args()
    
    # Update global variables with command line arguments
    global CANDIDATE_STATES, OUTPUT_CSV, LIMIT
    CANDIDATE_STATES = args.state
    OUTPUT_CSV = args.output
    LIMIT = args.limit
    
    print(f"Starting candidate data export with state filter: {CANDIDATE_STATES}")
    print(f"Output file: {OUTPUT_CSV}")
    print(f"API limit: {LIMIT}")
    
    total_processed = fetch_all_candidates()
    print(f"\n[DONE] Total candidates processed: {total_processed}")
    print(f"[INFO] CSV written: {OUTPUT_CSV}")
    
    return 0

if __name__ == "__main__":
    exit(main())
