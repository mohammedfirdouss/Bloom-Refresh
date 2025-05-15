# Notification Service

## Overview
The Notification Service handles event-driven notifications for the Spring Refresh application. It processes events from EventBridge and sends notifications via AWS SNS to users.

## Architecture
- Event-driven architecture using AWS EventBridge and SQS
- AWS SNS for notification delivery
- DynamoDB for notification logging
- Flask for internal API endpoints
- Structured logging with structlog

## Data Model
### NotificationModel
- **Primary Key**: notificationId (String)
- **Attributes**:
  - userId (String, required) - Recipient's user ID
  - eventId (String, optional) - Related event ID
  - type (String, required) - Notification type (e.g., "event_reminder", "rsvp_confirmation")
  - payload (Map, required) - Notification content
  - status (String, required) - "pending", "sent", "failed", "read"
  - createdAt (DateTime, auto-generated)
  - sentAt (DateTime, optional)

## Event Types Handled
1. **NewEventCreated**
   - Notifies event organizer of successful event creation
   - Payload includes event title and details

2. **UserRSVPd**
   - Notifies event organizer of new RSVP
   - Notifies user of successful RSVP confirmation
   - Payload includes user ID and event details

## API Endpoints

### 1. Send Adhoc Notification
```
POST /notifications/send
```
**Request Body**:
```json
{
    "userId": "user123",
    "subject": "Notification Subject",
    "message": "Notification message content",
    "type": "adhoc",
    "eventId": "event123" // completely optional
}
```
**Response**: 202 Accepted

### 2. Health Check
```
GET /notifications/health
```
**Response**: 200 OK with service status

## Environment Variables
- `NOTIFICATIONS_DYNAMODB_TABLE`: DynamoDB table name
- `AWS_REGION`: AWS region
- `AWS_ACCESS_KEY_ID_DUMMY`: AWS access key (development)
- `AWS_SECRET_ACCESS_KEY_DUMMY`: AWS secret key (development)
- `SNS_TOPIC_ARN_GENERAL`: SNS topic ARN for notifications
- `SQS_QUEUE_URL_NOTIFICATIONS`: SQS queue URL for event processing

## AWS Integration
### EventBridge Events
- Service subscribes to EventBridge events via SQS
- Events trigger Lambda function for processing
- Supports multiple event types for different notification scenarios

### SNS Integration
- Notifications sent via AWS SNS
- Supports multiple delivery protocols (email, SMS)
- Structured message format for different delivery methods

## Development Setup
1. Install dependencies:
```bash
pip install flask boto3 pynamodb structlog
```

2. Set environment variables
3. Run the service:
```bash
python app.py
```

## Future Enhancements
- [ ] Implement notification preferences
- [ ] Add support for push notifications
- [ ] Implement notification templates
- [ ] Add notification analytics
- [ ] Implement retry logic for failed notifications
- [ ] Add support for scheduled notifications
- [ ] Implement notification batching# Notification Service
