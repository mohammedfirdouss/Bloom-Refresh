
from pynamodb.models import Model
from pynamodb.attributes import UnicodeAttribute, MapAttribute, UTCDateTimeAttribute, NumberAttribute
import os
from datetime import datetime

# Service: Event
# Table: Events
# PK: eventId
# Attributes: organizerId, title, location, dateTime, capacity, supplies

# Table: RSVPs
# PK: eventId#userId
# Attributes: status, registeredAt

class EventModel(Model):
    """
    Represents a cleanup event.
    """
    class Meta:
        table_name = os.environ.get("EVENTS_DYNAMODB_TABLE", "BloomRefresh-Events")
        region = os.environ.get("AWS_REGION", "us-east-1")
        aws_access_key_id = os.environ.get("AWS_ACCESS_KEY_ID_DUMMY", "dummy")
        aws_secret_access_key = os.environ.get("AWS_SECRET_ACCESS_KEY_DUMMY", "dummy")

    eventId = UnicodeAttribute(hash_key=True)
    organizerId = UnicodeAttribute(null=False) # userId of the organizer
    title = UnicodeAttribute(null=False)
    location = MapAttribute(null=False) # e.g., {"latitude": 34.0522, "longitude": -118.2437, "address": "123 Main St"}
    dateTime = UnicodeAttribute(null=False) # ISO 8601 format string
    capacity = NumberAttribute(null=True)
    supplies = UnicodeAttribute(null=True)
    createdAt = UTCDateTimeAttribute(default=datetime.utcnow)
    updatedAt = UTCDateTimeAttribute(null=True)

    def __iter__(self):
        for name, attr in self.get_attributes().items():
            yield name, attr.serialize(getattr(self, name))

class RsvpModel(Model):
    """
    Represents a user's RSVP to an event.
    """
    class Meta:
        table_name = os.environ.get("RSVPS_DYNAMODB_TABLE", "BloomRefresh-Rsvps")
        region = os.environ.get("AWS_REGION", "us-east-1")
        aws_access_key_id = os.environ.get("AWS_ACCESS_KEY_ID_DUMMY", "dummy")
        aws_secret_access_key = os.environ.get("AWS_SECRET_ACCESS_KEY_DUMMY", "dummy")

    # Composite key: eventId#userId
    # PynamoDB typically uses a single hash_key and an optional range_key.
    # For a composite key like "eventId#userId", we can store it as a single attribute for the hash_key.
    # Alternatively, use eventId as hash_key and userId as range_key if queries often involve filtering by eventId first.
    # The Plan specifies PK: eventId#userId, implying a single string PK.
    rsvpId = UnicodeAttribute(hash_key=True) # Stores "eventId#userId"
    eventId = UnicodeAttribute(null=False) # Stored separately for easier GSI if needed
    userId = UnicodeAttribute(null=False)  # Stored separately for easier GSI if needed
    status = UnicodeAttribute(null=False, default="confirmed") # e.g., "confirmed", "withdrawn"
    registeredAt = UTCDateTimeAttribute(default=datetime.utcnow)

    def __iter__(self):
        for name, attr in self.get_attributes().items():
            yield name, attr.serialize(getattr(self, name))

# Example (conceptual):
# if not EventModel.exists():
#     EventModel.create_table(read_capacity_units=1, write_capacity_units=1, wait=True)
# if not RsvpModel.exists():
#     RsvpModel.create_table(read_capacity_units=1, write_capacity_units=1, wait=True)

