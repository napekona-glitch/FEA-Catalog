# BoondManager Candidates Export Script

## Overview
This script exports candidate data from the BoondManager API to a CSV file with comprehensive information including HR managers, organizational structure, and candidate details.

## Features
- Export candidates with customizable state filters
- Include HR manager information (mainManager/hrManager)
- Extract organizational data (agency, pole)
- Fetch candidate availability and status information
- Support for multiple candidate states in one export
- Efficient API calls with pagination and retry logic
- Progress tracking and error handling

## Requirements
- Python 3.7+
- Valid BoondManager API token
- Internet connection

## Installation
No additional packages required - uses only Python standard library.

## Usage

### Basic Usage
```bash
# Export candidates with default state (2)
python candidates_optimized_new.py

# Export specific state
python candidates_optimized_new.py --state 1

# Export multiple states
python candidates_optimized_new.py --state 1,2,3

# Custom output file
python candidates_optimized_new.py --state 1,2 --output my_candidates.csv

# Custom API limit
python candidates_optimized_new.py --state 2 --limit 500
```

### Command Line Arguments
- `--state`: Candidate state filter (default: 2)
  - Single state: `--state 1`
  - Multiple states: `--state 1,2,3`
- `--output`: Output CSV file path (default: candidates_optimized.csv)
- `--limit`: Number of candidates per API call (default: 1000)

### Available States
Based on API testing, the following states are available:
- **State 1**: [Description needed]
- **State 2**: [Description needed]
- **State 3**: [Description needed]
- **State 4**: [Description needed]
- **State 5**: [Description needed]

## Output Columns

The CSV file contains the following columns:

### Organizational Information
- `MainManagerId`: ID of the main manager
- `MainManagerName`: Full name of the main manager
- `AgencyId`: ID of the agency
- `AgencyName`: Name of the agency
- `PoleId`: ID of the pole
- `PoleName`: Name of the pole

### Candidate Information
- `id`: Candidate ID
- `FirstName`: Candidate's first name
- `LastName`: Candidate's last name
- `AvailabilityDate`: When candidate is available (YYYY-MM-DD)
- `Availability`: Availability status code
- `UpdateDate`: Last update date (YYYY-MM-DD)
- `State`: Candidate state number
- `CandidateState`: Additional candidate state information
- `HrResponsibleId`: HR manager ID
- `HrResponsibleName`: HR manager full name

## Configuration

### API Token
Update the `HEADERS` dictionary in the script with your valid JWT token:
```python
HEADERS = {
    "X-Jwt-Client-BoondManager": "YOUR_JWT_TOKEN_HERE",
    "Accept": "application/json",
    "Accept-Encoding": "gzip",
    "Content-Type": "application/json",
}
```

### Default Settings
Modify these constants in the script:
```python
LIMIT = 1000              # Candidates per API call
TIMEOUT = 30              # Connection timeout (seconds)
MAX_RETRIES = 3           # Max retries for failed requests
BASE_DELAY = 1.0          # Base delay for exponential backoff
```

## Performance Considerations

### API Limits
- Default limit: 1000 candidates per API call
- Adjust `--limit` parameter based on your network and API constraints
- Higher limits = fewer API calls but more data per request

### Processing Speed
- Typical performance: ~4000-5000 candidates/minute
- Depends on network speed and API response times

## Error Handling

The script includes robust error handling for:
- Network timeouts and connection errors
- API rate limiting with exponential backoff
- Invalid authentication tokens
- Malformed API responses

## Examples

### Example 1: Export Active Candidates
```bash
python candidates_optimized_new.py --state 2 --output active_candidates.csv
```

### Example 2: Export Multiple States
```bash
python candidates_optimized_new.py --state 1,2,3 --output all_active.csv
```

### Example 3: Export with Custom Settings
```bash
python candidates_optimized_new.py --state 4 --limit 500 --output state_4_candidates.csv
```

## Troubleshooting

### Common Issues

1. **Authentication Error**
   - Check that your JWT token is valid and not expired
   - Ensure the token has proper permissions for candidate data

2. **No Data Returned**
   - Verify the state numbers exist in your system
   - Check if candidates exist for the specified state(s)

3. **Slow Performance**
   - Reduce the `--limit` parameter
   - Check network connectivity
   - Verify API is responding normally

4. **Empty Fields**
   - Some fields may be empty if data is not available
   - HR manager fields require proper relationships in BoondManager

### Debug Mode
For debugging, the script prints:
- API URLs being called
- Progress updates every 5 seconds
- Error messages with details

## API Endpoints Used

- `/api/candidates` - Main candidate listing
- Includes related data: `mainManager`, `hrManager`, `agency`, `pole`
- Columns requested: `id,firstName,lastName,availabilityDate,availability,updateDate,state,candidateState`

## File Structure

```
candidates_optimized_new.py    # Main script
candidates_optimized.csv      # Default output file
README_Candidates_Export.md   # This documentation
```

## Support

For issues related to:
- **API access**: Contact your BoondManager administrator
- **Script errors**: Check the console output for detailed error messages
- **Data questions**: Verify data structure in your BoondManager instance

## Version History

- **v1.0**: Initial version with basic candidate export
- **v1.1**: Added HR manager and organizational data
- **v1.2**: Added candidateState field and command-line arguments
- **v1.3**: Added support for multiple states filtering
