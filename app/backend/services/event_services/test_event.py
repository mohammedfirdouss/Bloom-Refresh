"""Test script for event service endpoints."""

import pytest
from flask import Flask
from unittest.mock import patch
from app import app  # Import the Flask app from the event service

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

@patch("app.some_external_dependency")  # Mock external dependencies
def test_health(mock_dependency, client):
    mock_dependency.return_value = True  # Mock behavior
    response = client.get("/events/health")
    assert response.status_code == 200
    assert response.json["status"] == "Event service is healthy"

@patch("app.some_external_dependency")
def test_create_event(mock_dependency, client):
    mock_dependency.return_value = True
    response = client.post("/events", json={
        "title": "Beach Cleanup",
        "location": {
            "latitude": 34.0522,
            "longitude": -118.2437,
            "address": "Santa Monica Beach"
        },
        "dateTime": "2025-07-15T09:00:00Z",
        "capacity": 50,
        "supplies": "Gloves and bags provided"
    }, headers={"Authorization": "Bearer some_access_token"})
    assert response.status_code == 201
    assert "eventId" in response.json

@patch("app.some_external_dependency")
def test_get_event(mock_dependency, client):
    mock_dependency.return_value = True
    response = client.get("/events/some_event_id", headers={"Authorization": "Bearer some_access_token"})
    assert response.status_code == 200
    assert "title" in response.json
    assert response.json["title"] == "Beach Cleanup"
