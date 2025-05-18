# Event Service Documentation

## Purpose
The Event Service manages cleanup events and RSVPs. It handles:
- Creating and managing events
- RSVP management
- Event details and updates
- Event capacity tracking

## Main Components

### 1. Event Management
```python
# Endpoints
GET /events              
POST /events            
GET /events/<event_id>  
PUT /events/<event_id>  
DELETE /events/<event_id> 
```

### 2. RSVP Management
```python
# Endpoints
POST /events/<event_id>/rsvp   
DELETE /events/<event_id>/rsvp 
```

### 3. Data Models

#### Event Model
```python
{
    "eventId": "uuid",
    "organizerId": "user_id",
    "title": "string",
    "location": {
        "latitude": number,
        "longitude": number,
        "address": "string"
    },
    "dateTime": "ISO8601",
    "capacity": number,
    "supplies": "string"
}
```

#### RSVP Model
```python
{
    "rsvpId": "eventId#userId",
    "eventId": "uuid",
    "userId": "user_id",
    "status": "confirmed/withdrawn",
    "registeredAt": "ISO8601"
}
```

## How to Use

### 1. Create Event
```bash
POST /events
{
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
```

### 2. RSVP to Event
```bash
POST /events/<event_id>/rsvp
```

### 3. Get Event Details
```bash
GET /events/<event_id>
```

### 4. Update Event
```bash
PUT /events/<event_id>
{
    "title": "Updated Title",
    "capacity": 75
}
```

### 5. Cancel RSVP
```bash
DELETE /events/<event_id>/rsvp
```

## Features
1. Event creation with location and capacity
2. RSVP management
3. Event updates by organizers
4. Capacity tracking
5. Event deletion with RSVP cleanup
6. AWS EventBridge integration (planned)

## Current Implementation
- Uses in-memory storage (will be replaced with DynamoDB)
- JWT authentication required
- Basic validation for dates and locations
- Event capacity checking
- RSVP status tracking

## Next Steps(Later)
1. Implement DynamoDB integration
2. Add event filtering (date, location)
3. Add event search
4. Implement AWS EventBridge for notifications
5. Add event reminders
6. Add event cancellation notifications

This service is essential for managing cleanup events and participant registrations in the application.
