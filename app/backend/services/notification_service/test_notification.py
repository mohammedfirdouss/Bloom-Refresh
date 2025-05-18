"""Test script for notification service endpoints."""

import pytest
from flask import Flask
from unittest.mock import patch
from app import app  # Import the Flask app from the notification service

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

@patch("app.some_external_dependency")  # Mock external dependencies
def test_health(mock_dependency, client):
    mock_dependency.return_value = True  # Mock behavior
    response = client.get("/notifications/health")
    assert response.status_code == 200
    assert response.json["status"] == "Notification service is healthy"

@patch("app.some_external_dependency")
def test_send_notification(mock_dependency, client):
    mock_dependency.return_value = True
    response = client.post("/notifications/send", json={
        "userId": "user123",
        "subject": "Test Notification",
        "message": "This is a test notification.",
        "type": "adhoc",
        "eventId": "event123"
    })
    assert response.status_code == 202
    assert response.json["message"] == "Adhoc notification processed"
