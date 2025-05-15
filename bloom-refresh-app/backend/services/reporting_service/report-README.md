# Reporting Service

## Overview
The Reporting Service handles post-event reports, including metrics and photo submissions. It provides endpoints for submitting and retrieving event reports.

## Architecture
- Built with Flask and Flask-RESTful
- Uses PynamoDB for DynamoDB interactions
- JWT authentication for secure endpoints
- Structured logging with structlog

## Data Model
### ReportModel
- **Primary Key**: reportId (String)
- **Attributes**:
  - eventId (String, required)
  - submittedBy (String, required) - User ID of submitter
  - bagsCollected (Number, required)
  - photoUrls (List of Strings, required) - S3 URLs for photos
  - otherMetrics (Map, optional) - Additional metrics
  - submittedAt (DateTime, auto-generated)

## API Endpoints

### 1. Submit Event Report
```
POST /events/:id/report
```
**Authentication**: Required (JWT)
**Request Body**:
```json
{
    "bagsCollected": 10,
    "photoUrls": ["https://s3-url-1", "https://s3-url-2"],
    "otherMetrics": {
        "additionalField": "value"
    }
}
```
**Response**: 201 Created with report details

### 2. Get Report Details
```
GET /reports/:id
```
**Authentication**: Required (JWT)
**Response**: 200 OK with report details or 404 Not Found

### 3. Health Check
```
GET /reports/health
```
**Response**: 200 OK with service status

## Environment Variables
- `REPORTS_DYNAMODB_TABLE`: DynamoDB table name
- `AWS_REGION`: AWS region
- `AWS_ACCESS_KEY_ID_DUMMY`: AWS access key (development)
- `AWS_SECRET_ACCESS_KEY_DUMMY`: AWS secret key (development)
- `JWT_SECRET_KEY`: JWT signing key

## Development Setup
1. Install dependencies:
```bash
pip install flask flask-restful flask-jwt-extended pynamodb structlog
```

2. Set environment variables
3. Run the service:
```bash
python app.py
```

## Future Enhancements
- [ ] Full AWS integration (later)
- [ ] Event validation against Event Service
- [ ] EventBridge integration for report notifications
- [ ] Photo upload handling
- [ ] Report analytics endpoints 