"""Test script for reporting service endpoints."""

import pytest
from flask import Flask
from unittest.mock import patch
from app import app  # Import the Flask app from the reporting service

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

@patch("app.some_external_dependency")  # Mock external dependencies
def test_health(mock_dependency, client):
    mock_dependency.return_value = True  # Mock behavior
    response = client.get("/reports/health")
    assert response.status_code == 200
    assert response.json["status"] == "Reporting service is healthy"

@patch("app.some_external_dependency")
def test_submit_report(mock_dependency, client):
    mock_dependency.return_value = True
    response = client.post("/events/event123/report", json={
        "bagsCollected": 10,
        "photoUrls": [
            "https://s3-url-1",
            "https://s3-url-2"
        ],
        "otherMetrics": {
            "additionalField": "value"
        }
    }, headers={"Authorization": "Bearer some_access_token"})
    assert response.status_code == 201
    assert "reportId" in response.json

@patch("app.some_external_dependency")
def test_get_report(mock_dependency, client):
    mock_dependency.return_value = True
    response = client.get("/reports/some_report_id", headers={"Authorization": "Bearer some_access_token"})
    assert response.status_code == 200
    assert "bagsCollected" in response.json
    assert response.json["bagsCollected"] == 10
