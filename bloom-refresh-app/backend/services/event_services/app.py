"""Event service application."""

from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity, JWTManager
import os
import structlog
from datetime import datetime, UTC
import uuid # For generating eventId and rsvpId if not using database auto-increment

# from .models import EventModel, RsvpModel # Placeholder for PynamoDB or similar

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "super-secret-key-for-dev-only")
jwt = JWTManager(app)
api = Api(app)
logger = structlog.get_logger()

# In-memory data stores for demonstration (replace with DynamoDB as per PRD)
events_db = {}
# Example: events_db = {"event_uuid_1": {"eventId": "event_uuid_1", "organizerId": "cognito_sub_xyz", "title": "Beach Cleanup", "location": {"latitude": 34.0522, "longitude": -118.2437, "address": "Santa Monica Beach"}, "dateTime": "2025-07-15T09:00:00Z", "capacity": 50, "supplies": "Gloves and bags provided"}}
rsvps_db = {}
# Example: rsvps_db = {"event_uuid_1#cognito_sub_abc": {"eventId": "event_uuid_1", "userId": "cognito_sub_abc", "status": "confirmed", "registeredAt": "2025-07-01T10:00:00Z"}}

# --- Helper Functions (Conceptual) ---
def publish_event_to_event_bridge(event_type, detail):
    """Placeholder for publishing an event to AWS EventBridge."""
    # In a real scenario, this would use boto3 to put_events to EventBridge
    logger.info(f"event_bridge.publish", event_type=event_type, detail=detail)
    # Example:
    # event_bridge_client = boto3.client("events")
    # response = event_bridge_client.put_events(
    #     Entries=[
    #         {
    #             "Source": "com.bloomrefresh.eventservice",
    #             "DetailType": event_type,
    #             "Detail": json.dumps(detail),
    #             "EventBusName": os.environ.get("EVENT_BUS_NAME", "BloomRefreshEventBus")
    #         }
    #     ]
    # )
    pass

# --- Event Resources ---
class EventList(Resource):
    @jwt_required() # Optional: listing events might be public, creating requires auth
    def get(self):
        # TODO: Implement filtering (date, distance - distance requires location data and geo-queries)
        logger.info("event.list.get.success", count=len(events_db))
        return jsonify(list(events_db.values()))

    @jwt_required()
    def post(self):
        organizer_id = get_jwt_identity() # User creating the event
        data = request.get_json()
        if not data:
            logger.warn("event.create.missing_payload", organizer_id=organizer_id)
            return {"message": "Payload missing"}, 400

        # Required fields from PRD: title, location, dateTime
        # Optional: capacity, supplies
        title = data.get("title")
        location = data.get("location") # Expecting an object like {"latitude": ..., "longitude": ..., "address": ...}
        date_time_str = data.get("dateTime")

        if not all([title, location, date_time_str]):
            logger.warn("event.create.missing_fields", organizer_id=organizer_id, data_keys=list(data.keys()))
            return {"message": "Missing required fields: title, location, dateTime"}, 400
        
        # Basic validation (more can be added)
        if not isinstance(location, dict) or not all(k in location for k in ["latitude", "longitude"]):
            return {"message": "Invalid location format. Must include latitude and longitude."},400
        try:
            # Validate dateTime format (e.g., ISO 8601)
            datetime.fromisoformat(date_time_str.replace("Z", "+00:00"))
        except ValueError:
            return {"message": "Invalid dateTime format. Use ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)."}, 400

        event_id = str(uuid.uuid4())
        new_event = {
            "eventId": event_id,
            "organizerId": organizer_id,
            "title": title,
            "location": location,
            "dateTime": date_time_str,
            "capacity": data.get("capacity"),
            "supplies": data.get("supplies", "Bring your own if possible."),
            "createdAt": datetime.now(UTC).isoformat()
        }
        # TODO: Replace with DynamoDB save: EventModel(**new_event).save()
        events_db[event_id] = new_event
        logger.info("event.create.success", event_id=event_id, organizer_id=organizer_id)
        
        # Publish event to EventBridge (e.g., for Notification Service)
        publish_event_to_event_bridge("NewEventCreated", {"eventId": event_id, "title": title, "organizerId": organizer_id})
        
        return jsonify(new_event), 201

class EventDetail(Resource):
    @jwt_required() # Optional: viewing details might be public
    def get(self, event_id):
        # TODO: Replace with DynamoDB lookup: EventModel.get(event_id)
        event = events_db.get(event_id)
        if event:
            logger.info("event.detail.get.success", event_id=event_id)
            return jsonify(event)
        else:
            logger.warn("event.detail.get.not_found", event_id=event_id)
            return {"message": "Event not found"}, 404

    @jwt_required()
    def put(self, event_id):
        organizer_id = get_jwt_identity()
        # TODO: Replace with DynamoDB lookup
        event = events_db.get(event_id)
        if not event:
            logger.warn("event.update.not_found", event_id=event_id, organizer_id=organizer_id)
            return {"message": "Event not found"}, 404

        if event["organizerId"] != organizer_id:
            logger.warn("event.update.auth_error", event_id=event_id, organizer_id=organizer_id, actual_organizer=event["organizerId"])
            return {"message": "You are not authorized to update this event"}, 403

        data = request.get_json()
        if not data:
            logger.warn("event.update.missing_payload", event_id=event_id)
            return {"message": "Payload missing"}, 400

        # Update allowed fields
        if "title" in data: event["title"] = data["title"]
        if "location" in data: event["location"] = data["location"]
        if "dateTime" in data: event["dateTime"] = data["dateTime"]
        if "capacity" in data: event["capacity"] = data["capacity"]
        if "supplies" in data: event["supplies"] = data["supplies"]
        event["updatedAt"] = datetime.utcnow().isoformat() + "Z"

        # TODO: Replace with DynamoDB update: event.update(actions=[...])
        events_db[event_id] = event
        logger.info("event.update.success", event_id=event_id)
        return jsonify(event)

    @jwt_required()
    def delete(self, event_id):
        organizer_id = get_jwt_identity()
        # TODO: Replace with DynamoDB lookup
        event = events_db.get(event_id)
        if not event:
            logger.warn("event.delete.not_found", event_id=event_id, organizer_id=organizer_id)
            return {"message": "Event not found"}, 404

        if event["organizerId"] != organizer_id:
            logger.warn("event.delete.auth_error", event_id=event_id, organizer_id=organizer_id)
            return {"message": "You are not authorized to delete this event"}, 403

        # TODO: Replace with DynamoDB delete: event.delete()
        # Also consider what to do with RSVPs - cascade delete or mark event as cancelled.
        del events_db[event_id]
        # Potentially delete related RSVPs from rsvps_db
        related_rsvps = [k for k in rsvps_db if k.startswith(f"{event_id}#")]
        for rsvp_key in related_rsvps:
            del rsvps_db[rsvp_key]
            
        logger.info("event.delete.success", event_id=event_id)
        publish_event_to_event_bridge("EventDeleted", {"eventId": event_id, "organizerId": organizer_id})
        return {"message": "Event deleted successfully"}, 200

# --- RSVP Resources ---
class Rsvp(Resource):
    @jwt_required()
    def post(self, event_id):
        user_id = get_jwt_identity()
        # TODO: Check if event exists
        if event_id not in events_db:
            logger.warn("rsvp.create.event_not_found", event_id=event_id, user_id=user_id)
            return {"message": "Event not found"}, 404

        rsvp_id = f"{event_id}#{user_id}"
        if rsvp_id in rsvps_db and rsvps_db[rsvp_id]["status"] == "confirmed":
            logger.warn("rsvp.create.already_rsvpd", event_id=event_id, user_id=user_id)
            return {"message": "Already RSVPd to this event"}, 409

        # TODO: Check event capacity if implemented
        # event = events_db[event_id]
        # current_rsvps = len([r for r in rsvps_db.values() if r["eventId"] == event_id and r["status"] == "confirmed"])
        # if event.get("capacity") is not None and current_rsvps >= event["capacity"]:
        #     return {"message": "Event is at full capacity"}, 409

        new_rsvp = {
            "rsvpId": rsvp_id, # Or generate a separate UUID for rsvpId
            "eventId": event_id,
            "userId": user_id,
            "status": "confirmed",
            "registeredAt": datetime.utcnow().isoformat() + "Z"
        }
        # TODO: Replace with DynamoDB save: RsvpModel(**new_rsvp).save()
        rsvps_db[rsvp_id] = new_rsvp
        logger.info("rsvp.create.success", event_id=event_id, user_id=user_id)
        publish_event_to_event_bridge("UserRSVPd", {"eventId": event_id, "userId": user_id, "status": "confirmed"})
        return jsonify(new_rsvp), 201

    @jwt_required()
    def delete(self, event_id):
        user_id = get_jwt_identity()
        rsvp_id = f"{event_id}#{user_id}"

        # TODO: Replace with DynamoDB lookup and delete
        if rsvp_id in rsvps_db:
            del rsvps_db[rsvp_id]
            logger.info("rsvp.delete.success", event_id=event_id, user_id=user_id)
            publish_event_to_event_bridge("UserRSVPWithdrawn", {"eventId": event_id, "userId": user_id, "status": "withdrawn"})
            return {"message": "RSVP withdrawn successfully"}, 200
        else:
            logger.warn("rsvp.delete.not_found", event_id=event_id, user_id=user_id)
            return {"message": "RSVP not found"}, 404

# API Resources
api.add_resource(EventList, "/events")
api.add_resource(EventDetail, "/events/<string:event_id>")
api.add_resource(Rsvp, "/events/<string:event_id>/rsvp")

# Basic health check endpoint
@app.route("/events/health", methods=["GET"])
def health_check():
    logger.info("event.health.check")
    return jsonify({"status": "Event service is healthy", "version": "0.1.0"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5003, debug=True)

