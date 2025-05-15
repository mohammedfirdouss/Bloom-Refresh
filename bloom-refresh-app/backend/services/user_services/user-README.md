# User Service Documentation

## Purpose
The User Service manages user profiles and preferences. It's separate from the Auth Service to handle user-specific data like names, preferences, and avatars.

## Main Features
1. Get user profile
2. Update user profile
3. Store user preferences
4. Manage avatar URLs

## API Endpoints

### 1. Get User Profile
```
GET /users/<userId>
```
- Needs JWT token
- Returns user's profile data
- Only users can view their own profile

### 2. Update User Profile
```
PUT /users/<userId>
```
- Needs JWT token
- Can update:
  - name
  - preferences
  - avatarUrl
- Only users can update their own profile

### 3. Health Check
```
GET /users/health
```
- Returns service status

## Data Model
```python
ProfileModel:
- userId (Primary Key)
- name
- joinedAt
- preferences
- avatarUrl
```

## How to Test

1. **Get Profile**
```bash
curl -X GET https://your-domain/users/your-user-id \
  -H "Authorization: Bearer your-jwt-token"
```

2. **Update Profile**
```bash
curl -X PUT https://your-domain/users/your-user-id \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Name",
    "preferences": {
      "notifications": true
    },
    "avatarUrl": "https://example.com/avatar.jpg"
  }'
```

## Current Implementation
- Uses in-memory storage (will be replaced with DynamoDB)
- JWT authentication required
- Basic error handling
- Logging with structlog

## Next Steps(Later)
1. Connect to DynamoDB
2. Add more profile fields
3. Add profile search
4. Add admin features
5. Add profile validation

The service runs on port 5002 and works with the Auth Service for user authentication.
