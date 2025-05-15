from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity, JWTManager # To protect endpoints and get user identity
import os
import structlog
from datetime import datetime, UTC
# from .models import ProfileModel # Placeholder for PynamoDB or similar

app = Flask(__name__)
api = Api(app)
logger = structlog.get_logger()

# In-memory user profiles store for demonstration (replace with DynamoDB as per PRD)
# This will be replaced with DynamoDB for user profile data persistence.
# Keyed by userId (which would typically be the Cognito sub)
profiles_db = {}
# Example: profiles_db = {"cognito_sub_123": {"userId": "cognito_sub_123", "name": "Jane Doe", "joinedAt": "2024-01-15T10:00:00Z", "preferences": {"notifications": True}, "avatarUrl": "http://example.com/avatar.jpg"}}

class UserProfile(Resource):
    @jwt_required()
    def get(self, userId):
        current_user_identity = get_jwt_identity() # This is the userId (e.g., Cognito sub)
        # Authorization: Ensure the requester is the user themselves or an admin (if admin role exists)
        # For now, we assume only the user can fetch their own profile.
        if current_user_identity != userId:
            logger.warn("user.profile.get.auth_error", requested_userId=userId, requester_identity=current_user_identity)
            return {"message": "You are not authorized to view this profile"}, 403

        # TODO: Replace with DynamoDB lookup using ProfileModel.get(userId)
        profile = profiles_db.get(userId)
        if profile:
            logger.info("user.profile.get.success", userId=userId)
            return jsonify(profile)
        else:
            logger.warn("user.profile.get.not_found", userId=userId)
            return {"message": "User profile not found"}, 404

    @jwt_required()
    def put(self, userId):
        current_user_identity = get_jwt_identity()
        if current_user_identity != userId:
            logger.warn("user.profile.put.auth_error", requested_userId=userId, requester_identity=current_user_identity)
            return {"message": "You are not authorized to update this profile"}, 403

        data = request.get_json()
        if not data:
            logger.warn("user.profile.put.missing_payload", userId=userId)
            return {"message": "Payload missing"}, 400

        # TODO: Replace with DynamoDB lookup and update
        # profile = ProfileModel.get(userId)
        # if not profile: return {"message": "User profile not found"}, 404
        # profile.update(actions=[...])

        if userId not in profiles_db: # Check if profile exists before update
             logger.warn("user.profile.put.not_found", userId=userId)
             return {"message": "User profile not found to update"}, 404

        # Allowed fields for update (as per PRD: name, preferences, avatarUrl)
        updated_profile_data = profiles_db.get(userId, {}).copy() # Get existing or empty dict
        if "name" in data:
            updated_profile_data["name"] = data["name"]
        if "preferences" in data: # Assuming preferences is a dict
            if not isinstance(data["preferences"], dict):
                return {"message": "Preferences must be an object"}, 400
            updated_profile_data["preferences"] = data["preferences"]
        if "avatarUrl" in data:
            updated_profile_data["avatarUrl"] = data["avatarUrl"]
        
        # Ensure userId and joinedAt are not overwritten by PUT request directly
        # They are set at creation (joinedAt would be when profile is first made, likely post-Cognito signup)
        if not updated_profile_data.get("userId"): # If it's a new profile being created via PUT (less common for PUT)
            updated_profile_data["userId"] = userId
            updated_profile_data["joinedAt"] = datetime.now(UTC).isoformat()

        profiles_db[userId] = updated_profile_data
        logger.info("user.profile.put.success", userId=userId, updated_fields=list(data.keys()))
        return jsonify(profiles_db[userId])

# API Resources
api.add_resource(UserProfile, "/users/<string:userId>")

# Basic health check endpoint
@app.route("/users/health", methods=["GET"])
def health_check():
    logger.info("user.health.check")
    return jsonify({"status": "User service is healthy", "version": "0.1.0"}), 200

if __name__ == "__main__":
    # This is for local development/testing only.
    # In a serverless deployment (Lambda), a WSGI handler (e.g., serverless-wsgi) would be used.
    # Requires JWT_SECRET_KEY from Auth service for @jwt_required to work if running standalone.
    # For integrated testing, this service would rely on JWTs issued by the Auth service.
    app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "super-secret-key-for-dev-only") 
    jwt = JWTManager(app) # Initialize JWTManager if running standalone for testing
    app.run(host="0.0.0.0", port=5002, debug=True)

