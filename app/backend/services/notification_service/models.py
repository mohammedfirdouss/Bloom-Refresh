"""Notification service models."""

from pynamodb.models import Model
from pynamodb.attributes import UnicodeAttribute, MapAttribute, UTCDateTimeAttribute
import os
from datetime import datetime, UTC

# As per PRD Data Models:
# Service: Notification
# Table: Notifications
# PK: notificationId
# Attributes: userId, eventId, type, payload, status, sentAt

class NotificationModel(Model):
    """
    Represents a notification sent to a user.
    """
    class Meta:
        table_name = os.environ.get("NOTIFICATIONS_DYNAMODB_TABLE", "BloomRefresh-Notifications")
        region = os.environ.get("AWS_REGION", "us-east-1")
        aws_access_key_id = os.environ.get("AWS_ACCESS_KEY_ID_DUMMY", "dummy")
        aws_secret_access_key = os.environ.get("AWS_SECRET_ACCESS_KEY_DUMMY", "dummy")

    notificationId = UnicodeAttribute(hash_key=True)
    userId = UnicodeAttribute(null=False)
    eventId = UnicodeAttribute(null=True) # Optional, if notification is event-related
    type = UnicodeAttribute(null=False) # e.g., "event_reminder", "rsvp_confirmation", "new_event_alert"
    payload = MapAttribute(null=False) # Contains the actual content, e.g., {"subject": "...", "message": "..."}
    status = UnicodeAttribute(null=False, default="pending") # e.g., "pending", "sent", "failed", "read"
    createdAt = UTCDateTimeAttribute(default=datetime.now(UTC)) # When the notification was generated
    sentAt = UTCDateTimeAttribute(null=True) # When the notification was actually sent

    def __iter__(self):
        for name, attr in self.get_attributes().items():
            yield name, attr.serialize(getattr(self, name))

# Example (conceptual):
# if not NotificationModel.exists():
#     NotificationModel.create_table(read_capacity_units=1, write_capacity_units=1, wait=True)

