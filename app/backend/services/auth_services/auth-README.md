# Auth Service Documentation

## What This Service Does
- Handles user signup and login
- Manages user sessions with tokens
- Stores user data securely
- Will connect to AWS Cognito (later)

## Why We Need It
- Keeps user data safe
- Makes sure only real users can access the app
- Separates login logic from other app features
- Ready for AWS integration when needed

## Main Parts

### 1. Password Handling (`utils.py`)
```python
# Makes passwords secure
- hash_password(): Turns passwords into secure codes
- verify_password(): Checks if passwords match
```

### 2. User Data (`models.py`)
```python
# Stores user information
- userId: Unique user ID
- email: User's email
- role: What the user can do (volunteer/organizer)
- created_at: When they joined
```

### 3. Main Functions (`app.py`)
```python
# What users can do
POST /auth/signup
  - Create new account
  - Check email/password
  - Save user info

POST /auth/login
  - Let users sign in
  - Give them access tokens
  - Start their session

POST /auth/refresh
  - Give new access tokens
  - Keep users signed in

GET /auth/health
  - Check if service is working
```

## How to Set Up

1. **Get Started**
```bash
# Make new environment
python -m venv venv
.\venv\Scripts\activate  # Windows
source venv/bin/activate # Linux/Mac

# Get needed packages
pip install -r requirements.txt
```

2. **Settings**
Make `.env` file:
```env
FLASK_APP=app.py
FLASK_ENV=development
JWT_SECRET_KEY=your-secret-key
AWS_REGION=us-east-1
AUTH_USERS_DYNAMODB_TABLE=BloomRefresh-AuthUsers
```

## How to Use

1. **Sign Up**
```bash
curl -X POST http://localhost:5001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "mypassword",
    "role": "volunteer"
  }'
```

2. **Log In**
```bash
curl -X POST http://localhost:5001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "mypassword"
  }'
```

3. **Get New Token**
```bash
curl -X POST http://localhost:5001/auth/refresh \
  -H "Authorization: Bearer <refresh_token>"
```

## What's Missing
1. Real database (using memory for now)
2. AWS Cognito connection
3. Extra security features

## Next Things to Do(Later)
1. Set up AWS Cognito
2. Add real database
3. Add logging
4. Set up monitoring

This service handles all user login stuff. It's basic now but ready to grow as the app grows.
