
from pynamodb.models import Model
from pynamodb.attributes import UnicodeAttribute, MapAttribute, UTCDateTimeAttribute
import os
from datetime import datetime

# As per PRD Data Models:
# Service: User
# Table: Profiles
# PK: userId
# Attributes: name, joinedAt, preferences, avatarUrl

class ProfileModel(Model):
    """
    Represents a user profile in the system.
    """
    class Meta:
        table_name = os.environ.get("USER_PROFILES_DYNAMODB_TABLE", "BloomRefresh-UserProfiles")
        region = os.environ.get("AWS_REGION", "us-east-1")
        # For local testing with DynamoDB Local, uncomment and configure:
        # host = "http://localhost:8000"
        aws_access_key_id = os.environ.get("AWS_ACCESS_KEY_ID_DUMMY", "dummy")
        aws_secret_access_key = os.environ.get("AWS_SECRET_ACCESS_KEY_DUMMY", "dummy")

    userId = UnicodeAttribute(hash_key=True) # Typically the Cognito User SUB, links to AuthUserModel.userId
    name = UnicodeAttribute(null=True) # User can set their display name
    joinedAt = UTCDateTimeAttribute(default=datetime.utcnow) # Timestamp when the profile was created
    preferences = MapAttribute(null=True) # e.g., {"notifications_enabled": True, "email_frequency": "daily"}
    avatarUrl = UnicodeAttribute(null=True)
    # email = UnicodeAttribute(null=False) # Email is primarily in AuthUser, but might be duplicated here for query convenience if needed.
                                         # For now, assuming email is fetched via Auth service or Cognito directly.

    def __iter__(self):
        for name, attr in self.get_attributes().items():
            yield name, attr.serialize(getattr(self, name))

# Example usage (conceptual):
# if not ProfileModel.exists():
# ProfileModel.create_table(read_capacity_units=1, write_capacity_units=1, wait=True)

# def create_user_profile(user_id, name=None, preferences=None, avatar_url=None):
#     profile = ProfileModel(
#         userId=user_id,
#         name=name,
#         preferences=preferences or {},
#         avatarUrl=avatar_url,
#         joinedAt=datetime.utcnow()
#     )
#     profile.save()
#     return profile

# def get_user_profile(user_id):
#     try:
#         return ProfileModel.get(user_id)
#     except ProfileModel.DoesNotExist:
#         return None

# def update_user_profile(user_id, data_to_update):
#     try:
#         profile = ProfileModel.get(user_id)
#         actions = []
#         for key, value in data_to_update.items():
#             if hasattr(ProfileModel, key):
#                 actions.append(getattr(ProfileModel, key).set(value))
#         if actions:
#             profile.update(actions=actions)
#         return profile
#     except ProfileModel.DoesNotExist:
#         return None

