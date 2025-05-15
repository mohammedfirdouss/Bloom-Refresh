"""Test script for notification service endpoints."""

import requests

BASE_URL = "http://localhost:5005"  # Change port if notification_service runs on a different port

def test_health():
    """Test health endpoint."""
    url = f"{BASE_URL}/notifications/health"
    response = requests.get(url)
    print("\nHealth Check Response:", response.status_code)
    try:
        print(response.json())
    except Exception:
        print("Raw response:", response.text)

def test_send_notification():
    """Test sending an adhoc notification."""
    url = f"{BASE_URL}/notifications/send"
    data = {
        "userId": "user123",
        "subject": "Test Notification",
        "message": "This is a test notification.",
        "type": "adhoc",
        "eventId": "event123"  # Optional
    }
    response = requests.post(url, json=data)
    print("\nSend Notification Response:", response.status_code)
    try:
        print(response.json())
    except Exception:
        print("Raw response:", response.text)

if __name__ == "__main__":
    print("Testing Notification Service Endpoints...")
    test_health()
    test_send_notification()
