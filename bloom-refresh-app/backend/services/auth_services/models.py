from pynamodb.models import Model
from pynamodb.attributes import UnicodeAttribute, MapAttribute, UTCDateTimeAttribute
import os
from datetime import datetime

# This file defines data models for the Auth service using PynamoDB .
# The actual table will be provisioned via AWS CDK.

# As per PRD Data Models:
# Service: Auth
# Table: Users
# PK: userId
# Attributes: email, passwordHash, role, createdAt

# Note: passwordHash will be managed by Cognito. If storing user details separately
# in DynamoDB (e.g., for linking to other service data or if Cognito is not the sole
# source of truth for all user attributes managed by Auth service), then passwordHash
# might not be stored here directly if Cognito handles auth.
# For the purpose of this model, we'll assume `userId` is the Cognito `sub`.

class AuthUserModel(Model):
    """
    Represents a user in the authentication system, typically mirroring
    key information from Cognito or storing Auth-service specific user data.
    """
    class Meta:
        table_name = os.environ.get("AUTH_USERS_DYNAMODB_TABLE", "BloomRefresh-AuthUsers")
        region = os.environ.get("AWS_REGION", "us-east-2")
        # For local testing with DynamoDB Local, uncomment and configure:
        # host = "http://localhost:8000"
        aws_access_key_id = os.environ.get("AWS_ACCESS_KEY_ID_DUMMY", "dummy") # Required by PynamoDB, even for local
        aws_secret_access_key = os.environ.get("AWS_SECRET_ACCESS_KEY_DUMMY", "dummy") # Required by PynamoDB, even for local

    userId = UnicodeAttribute(hash_key=True)  # This would typically be the Cognito User SUB
    email = UnicodeAttribute(null=False)
    # password_hash: Not stored here if Cognito handles password verification.
    # Cognito manages the password hash securely.
    role = UnicodeAttribute(null=False, default="volunteer") # e.g., "volunteer", "organizer"
    created_at = UTCDateTimeAttribute(null=False, default=datetime.utcnow)
    # last_login_at = UTCDateTimeAttribute(null=True)
    # status = UnicodeAttribute(default="CONFIRMED") # e.g., UNCONFIRMED, CONFIRMED, ARCHIVED

    def __iter__(self):
        for name, attr in self.get_attributes().items():
            yield name, attr.serialize(getattr(self, name))

# Example usage (conceptual - actual interaction via service logic):
# if not AuthUserModel.exists():
#     AuthUserModel.create_table(read_capacity_units=1, write_capacity_units=1, wait=True)

# def create_auth_user(user_id, email, role):
#     new_user = AuthUserModel(
#         userId=user_id,
#         email=email,
#         role=role,
#         created_at=datetime.utcnow()
#     )
#     new_user.save()
#     return new_user

# def get_auth_user(user_id):
#     try:
#         return AuthUserModel.get(user_id)
#     except AuthUserModel.DoesNotExist:
#         return None

# Note: The actual interaction with this model (CRUD operations) will be within the
# Auth service logic (e.g., in app.py or dedicated data access layer functions),
# particularly after Cognito operations (e.g., storing user metadata post-confirmation).
# For the current in-memory `users_db` in `app.py`, this model serves as the target structure
# for when DynamoDB is integrated.

