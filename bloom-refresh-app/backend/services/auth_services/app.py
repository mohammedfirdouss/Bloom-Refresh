"""Authentication service providing user registration, login, and token refresh endpoints."""

from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, JWTManager
import boto3 # For Cognito integration
import os
import structlog
from .utils import hash_password, verify_password
from datetime import datetime, UTC
app = Flask(__name__)

# Configuration
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "super-secret-key-for-dev-only") # Change this in production!
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = False # Or set a specific timedelta, e.g., timedelta(hours=1)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = False # Or set a specific timedelta, e.g., timedelta(days=30)

# AWS Cognito Configuration (placeholders - to be set via environment variables in Lambda)
COGNITO_USER_POOL_ID = os.environ.get("COGNITO_USER_POOL_ID")
COGNITO_APP_CLIENT_ID = os.environ.get("COGNITO_APP_CLIENT_ID")
COGNITO_REGION = os.environ.get("AWS_REGION", "us-east-1")

# Initialize Cognito client (boto3)
# cognito_client = boto3.client("cognito-idp", region_name=COGNITO_REGION) # Uncomment when Cognito is provisioned

api = Api(app)
jwt = JWTManager(app)
logger = structlog.get_logger()

# In-memory user store for demonstration (replace with Cognito/DynamoDB as per PRD)
# This will be replaced with AWS Cognito integration and DynamoDB for user data persistence.
users_db = {}
# Example: users_db = {"testuser@example.com": {"password_hash": "hashed_password_string", "role": "volunteer", "email": "testuser@example.com", "user_id": "cognito_sub_or_uuid"}}

class Signup(Resource):
    def post(self):
        data = request.get_json()
        if not data:
            logger.warn("auth.signup.missing_payload")
            return {"message": "Payload missing"}, 400

        email = data.get("email")
        password = data.get("password")
        role = data.get("role", "volunteer") # Default role as per requirements

        if not email or not password:
            logger.warn("auth.signup.missing_fields", email=email)
            return {"message": "Email and password are required"}, 400

        if "@" not in email or "." not in email: # Basic email validation
            logger.warn("auth.signup.invalid_email_format", email=email)
            return {"message": "Invalid email format"}, 400

        # TODO: Replace in-memory check with Cognito user existence check if possible or rely on Cognito's own error for existing user.
        if email in users_db:
            logger.warn("auth.signup.user_exists", email=email)
            return {"message": "User already exists"}, 409 # Conflict

        # --- AWS Cognito Integration Point for Sign Up ---
        # try:
        #     response = cognito_client.sign_up(
        #         ClientId=COGNITO_APP_CLIENT_ID,
        #         Username=email,
        #         Password=password,
        #         UserAttributes=[
        #             {"Name": "email", "Value": email},
        #             {"Name": "custom:role", "Value": role} # Ensure 'role' is a custom attribute in Cognito
        #         ]
        #     )
        #     user_sub = response["UserSub"]
        #     logger.info("auth.signup.cognito_success", email=email, user_sub=user_sub)
        #     # Optionally, store additional user info in DynamoDB linked by user_sub (Cognito username)
        #     # users_db[email] = {"user_id": user_sub, "role": role, "email": email} # Update local cache if needed for dev
        #     return {"message": "User created successfully. Please check your email to confirm."}, 201 # Cognito usually requires confirmation
        # except cognito_client.exceptions.UsernameExistsException:
        #     logger.warn("auth.signup.cognito_user_exists", email=email)
        #     return {"message": "User already exists"}, 409
        # except Exception as e:
        #     logger.error("auth.signup.cognito_error", error=str(e), email=email)
        #     return {"message": "Error creating user with Cognito"}, 500
        # --- End Cognito Integration Point ---

        # Fallback to in-memory for now if Cognito is not active
        hashed_pw = hash_password(password)
        users_db[email] = {"password_hash": hashed_pw, "role": role, "email": email, "user_id": f"mem_{email}"}
        logger.info("auth.signup.success_in_memory", email=email, role=role)
        return {"message": "User created successfully (in-memory)"}, 201

class Login(Resource):
    def post(self):
        data = request.get_json()
        if not data:
            logger.warn("auth.login.missing_payload")
            return {"message": "Payload missing"}, 400

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            logger.warn("auth.login.missing_fields", email=email)
            return {"message": "Email and password are required"}, 400

        # --- AWS Cognito Integration Point for Login ---
        # try:
        #     response = cognito_client.initiate_auth(
        #         ClientId=COGNITO_APP_CLIENT_ID,
        #         AuthFlow="USER_PASSWORD_AUTH",
        #         AuthParameters={
        #             "USERNAME": email,
        #             "PASSWORD": password
        #         }
        #     )
        #     access_token = response["AuthenticationResult"]["AccessToken"]
        #     refresh_token = response["AuthenticationResult"]["RefreshToken"]
        #     # id_token = response["AuthenticationResult"]["IdToken"] # Contains user attributes
        #     logger.info("auth.login.cognito_success", email=email)
        #     return {
        #         "message": "Login successful with Cognito",
        #         "access_token": access_token,
        #         "refresh_token": refresh_token
        #     }, 200
        # except cognito_client.exceptions.NotAuthorizedException:
        #     logger.warn("auth.login.cognito_invalid_credentials", email=email)
        #     return {"message": "Invalid email or password"}, 401
        # except cognito_client.exceptions.UserNotFoundException:
        #     logger.warn("auth.login.cognito_user_not_found", email=email)
        #     return {"message": "Invalid email or password"}, 401 # Or 404
        # except Exception as e:
        #     logger.error("auth.login.cognito_error", error=str(e), email=email)
        #     return {"message": "Error during Cognito authentication"}, 500
        # --- End Cognito Integration Point ---

        # Fallback to in-memory for now if Cognito is not active
        user = users_db.get(email)
        if user and verify_password(user["password_hash"], password):
            # For local JWT generation if not using Cognito tokens directly
            # The identity should be something unique, like user_id from Cognito (sub) or our DB
            user_identity = user.get("user_id", email) # Use user_id if available
            access_token = create_access_token(identity=user_identity)
            refresh_token = create_refresh_token(identity=user_identity)
            logger.info("auth.login.success_in_memory", email=email)
            return {
                "message": "Login successful (in-memory)",
                "access_token": access_token,
                "refresh_token": refresh_token
            }, 200
        else:
            logger.warn("auth.login.invalid_credentials_in_memory", email=email)
            return {"message": "Invalid email or password (in-memory)"}, 401

class TokenRefresh(Resource):
    @jwt_required(refresh=True)
    def post(self):
        current_user_identity = get_jwt_identity() # This will be user_id or email based on login

        # --- AWS Cognito Integration Point for Refresh ---
        # If using Cognito tokens, refresh might be handled differently or directly with Cognito
        # For example, using cognito_client.initiate_auth with REFRESH_TOKEN_AUTH
        # This current implementation assumes JWTs are generated by this service.
        # If Cognito provides the JWTs, this endpoint might not be needed or would proxy to Cognito.
        # --- End Cognito Integration Point ---

        # Check if user still exists (important if using local JWTs and local user store)
        # This check needs to be adapted based on how identity (email vs user_id) is stored and retrieved.
        user_exists = False
        if "@" in current_user_identity: # Assuming identity is email
            if current_user_identity in users_db:
                user_exists = True
        else: # Assuming identity is a user_id
            for u_email, u_data in users_db.items():
                if u_data.get("user_id") == current_user_identity:
                    user_exists = True
                    break
        
        if not user_exists:
             logger.warn("auth.refresh.user_not_found", identity=current_user_identity)
             return {"message": "User not found for token refresh"}, 404

        access_token = create_access_token(identity=current_user_identity)
        logger.info("auth.refresh.success", identity=current_user_identity)
        return {"access_token": access_token}, 200

# API Resources
api.add_resource(Signup, "/auth/signup")
api.add_resource(Login, "/auth/login")
api.add_resource(TokenRefresh, "/auth/refresh")

# Basic health check endpoint
@app.route("/auth/health", methods=["GET"])
def health_check():
    logger.info("auth.health.check")
    return jsonify({"status": "Auth service is healthy", "version": "0.1.1"}), 200 # Incremented version

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)

