"""Test script for reporting service endpoints."""

import requests

BASE_URL = "http://localhost:5004"  # Change port if reporting service runs on a different port
AUTH_URL = "http://localhost:5001"  # Auth service URL

def get_access_token():
    """Get JWT access token from auth service."""
    url = f"{AUTH_URL}/auth/login"
    data = {
        "email": "test@example.com",
        "password": "testpass123"
    }
    response = requests.post(url, json=data)
    if response.status_code == 200:
        return response.json().get("access_token")
    print("Failed to get access token:", response.status_code, response.text)
    return None

def test_health():
    """Test health endpoint."""
    url = f"{BASE_URL}/reports/health"
    response = requests.get(url)
    print("\nHealth Check Response:", response.status_code)
    print(response.json())

def test_submit_report(token, event_id="event123"):
    """Test submitting an event report."""
    url = f"{BASE_URL}/events/{event_id}/report"
    data = {
        "bagsCollected": 10,
        "photoUrls": [
            "https://s3-url-1",
            "https://s3-url-2"
        ],
        "otherMetrics": {
            "additionalField": "value"
        }
    }
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(url, json=data, headers=headers)
    print("\nSubmit Report Response:", response.status_code)
    try:
        print(response.json())
    except Exception:
        print("Raw response:", response.text)
    return response.json().get("reportId")

def test_get_report(report_id, token):
    """Test get report by ID."""
    url = f"{BASE_URL}/reports/{report_id}"
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers)
    print("\nGet Report Response:", response.status_code)
    print(response.json())

if __name__ == "__main__":
    print("Testing Reporting Service Endpoints...")
    test_health()
    access_token = get_access_token()
    if access_token:
        report_id = test_submit_report(access_token)
        if report_id:
            test_get_report(report_id, access_token)
