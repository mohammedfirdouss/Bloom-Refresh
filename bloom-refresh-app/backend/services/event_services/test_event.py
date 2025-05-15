"""Test script for event service endpoints."""

import requests

BASE_URL = "http://localhost:5003"  # Change port if event service runs on a different port
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
    url = f"{BASE_URL}/events/health"
    response = requests.get(url)
    print("\nHealth Check Response:", response.status_code)
    print(response.json())

def test_create_event(token):
    """Test event creation."""
    url = f"{BASE_URL}/events"
    data = {
        "title": "Beach Cleanup",
        "location": {
            "latitude": 34.0522,
            "longitude": -118.2437,
            "address": "Santa Monica Beach"
        },
        "dateTime": "2025-07-15T09:00:00Z",
        "capacity": 50,
        "supplies": "Gloves and bags provided"
    }
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(url, json=data, headers=headers)
    print("\nCreate Event Response:", response.status_code)
    try:
        print(response.json())
    except Exception:
        print("Raw response:", response.text)
    return response.json().get("eventId")

def test_get_event(event_id, token):
    """Test get event by ID."""
    url = f"{BASE_URL}/events/{event_id}"
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers)
    print("\nGet Event Response:", response.status_code)
    print(response.json())

if __name__ == "__main__":
    print("Testing Event Service Endpoints...")
    test_health()
    access_token = get_access_token()
    if access_token:
        event_id = test_create_event(access_token)
        if event_id:
            test_get_event(event_id, access_token)
