"""Notification service application."""

from flask import Flask, request, jsonify
# from flask_restful import Api, Resource # Might not be needed if service is purely event-driven
import os
import structlog
import boto3 # For SNS, SQS
import json
from datetime import datetime, UTC
from config import config

# from .models import NotificationModel # Placeholder for PynamoDB or similar

app = Flask(__name__)
# api = Api(app) # Only if exposing REST endpoints directly
logger = structlog.get_logger()

# AWS Configuration (placeholders - to be set via environment variables in Lambda)
SNS_TOPIC_ARN_GENERAL = os.environ.get("SNS_TOPIC_ARN_GENERAL")
SQS_QUEUE_URL_NOTIFICATIONS = os.environ.get("SQS_QUEUE_URL_NOTIFICATIONS")
AWS_REGION = os.environ.get("AWS_REGION", "us-east-1")

# Example usage of the config module
SECRET_KEY = config.SECRET_KEY
DATABASE_URL = config.DATABASE_URL

# Initialize AWS clients (boto3)
# sns_client = boto3.client("sns", region_name=AWS_REGION) # Uncomment when SNS is provisioned
# sqs_client = boto3.client("sqs", region_name=AWS_REGION) # Uncomment when SQS is provisioned

# In-memory notifications store for demonstration (replace with DynamoDB as per PRD)
notifications_log_db = {}
# Example: notifications_log_db["notif_uuid_1"] = {"notificationId": "notif_uuid_1", "userId": "cognito_sub_abc", "eventId": "event_uuid_1", "type": "event_reminder", "payload": {"message": "..."}, "status": "sent", "sentAt": "..."}

# --- Event Handler Logic (Conceptual for Lambda) ---
# This function would be the entry point for a Lambda triggered by SQS (which gets messages from EventBridge)
def handle_eventbridge_event(event, context):
    """
    Processes events received from EventBridge (via SQS trigger typically).
    `event` would be the SQS message containing the EventBridge detail.
    """
    logger.info("notification.handler.received_event", sqs_event=event)
    
    for record in event.get("Records", []):
        try:
            message_body_str = record.get("body")
            if not message_body_str:
                logger.warn("notification.handler.empty_message_body", record=record)
                continue

            # The SQS message body is the EventBridge event detail
            event_detail_str = message_body_str # If EventBridge directly puts to SQS with full event
            # If SQS message is a wrapper, extract EventBridge detail, e.g. json.loads(message_body_str).get("detail")
            
            event_detail = json.loads(event_detail_str) # Assuming body is the JSON string of the EventBridge event
            event_type = event_detail.get("detail-type") # Or however EventBridge structures it
            actual_detail = event_detail.get("detail")

            logger.info("notification.handler.processing", event_type=event_type, detail=actual_detail)

            # Based on event_type, craft and send notification
            if event_type == "NewEventCreated":
                # Example: Notify users interested in new events (complex logic not in scope for this stub)
                # Or notify the organizer their event was listed.
                user_id_to_notify = actual_detail.get("organizerId")
                message = f"Your event '{actual_detail.get('title')}' has been successfully created!"
                subject = "Event Created: " + actual_detail.get('title')
                send_notification_via_sns(user_id_to_notify, subject, message, event_type, actual_detail.get("eventId"))
            
            elif event_type == "UserRSVPd":
                # Notify organizer about new RSVP
                # organizer_id = events_db.get(actual_detail.get("eventId"), {}).get("organizerId") # Needs access to event data
                # if organizer_id:
                #     message_to_organizer = f"User {actual_detail.get('userId')} has RSVPd to your event '{events_db.get(actual_detail.get('eventId'), {}).get('title')}'!"
                #     subject_organizer = "New RSVP for your event"
                #     send_notification_via_sns(organizer_id, subject_organizer, message_to_organizer, event_type, actual_detail.get("eventId"))
                # Notify user about successful RSVP
                user_id_to_notify = actual_detail.get("userId")
                # message_to_user = f"You have successfully RSVPd to the event '{events_db.get(actual_detail.get('eventId'), {}).get('title')}'!"
                # subject_user = "RSVP Confirmed"
                # send_notification_via_sns(user_id_to_notify, subject_user, message_to_user, event_type, actual_detail.get("eventId"))

            # TODO: Add handlers for other event types (reminders, cancellations, etc.)
            # Reminders would likely be scheduled (e.g. EventBridge scheduled events triggering a Lambda)

            # TODO: Log notification to DynamoDB using NotificationModel

        except Exception as e:
            logger.error("notification.handler.error", error=str(e), record_body=record.get("body"))
            # Optionally, re-queue or send to DLQ based on SQS configuration
            # For now, just log and continue
    return {"status": "Processed SQS messages"}

# --- SNS Sending Logic (Conceptual) ---
def send_notification_via_sns(user_id, subject, message_body, notification_type, event_id=None):
    """Placeholder for sending a notification via AWS SNS."""
    # In a real scenario, this would:
    # 1. Get user's contact preferences/details (e.g., email from User Service or Cognito)
    # 2. Publish to an SNS topic or directly to an endpoint (if user has specific SNS endpoint ARN)
    
    logger.info("notification.send_sns.attempt", user_id=user_id, subject=subject, type=notification_type)
    # try:
    #     # This is a simplified example; actual targeting is more complex
    #     # You might publish to a general topic, or a user-specific topic, or directly to an email endpoint if using SNS for email.
    #     if not SNS_TOPIC_ARN_GENERAL:
    #         logger.error("notification.send_sns.sns_topic_not_configured")
    #         return
    #     response = sns_client.publish(
    #         TopicArn=SNS_TOPIC_ARN_GENERAL, # Or a more specific topic/endpoint
    #         Message=json.dumps({
    #             "default": message_body, # Default message
    #             "email": message_body, # For email subscribers
    #             "sms": message_body[:140] # For SMS subscribers (truncated)
    #         }),
    #         Subject=subject,
    #         MessageStructure="json" # If sending structured messages for different protocols
    #     )
    #     logger.info("notification.send_sns.success", user_id=user_id, message_id=response.get("MessageId"))
    #     # Log this notification to DynamoDB
    #     log_notification_to_db(user_id, notification_type, {"subject": subject, "body": message_body}, "sent", event_id)
    # except Exception as e:
    #     logger.error("notification.send_sns.error", user_id=user_id, error=str(e))
    #     log_notification_to_db(user_id, notification_type, {"subject": subject, "body": message_body, "error": str(e)}, "failed", event_id)
    pass # Placeholder for actual SNS call

def log_notification_to_db(user_id, notif_type, payload, status, event_id=None):
    """Placeholder for logging notification to DynamoDB."""
    # notification_id = str(uuid.uuid4())
    # new_log = NotificationModel(
    #     notificationId=notification_id,
    #     userId=user_id,
    #     eventId=event_id,
    #     type=notif_type,
    #     payload=payload,
    #     status=status,
    #     sentAt=datetime.utcnow() # Or receivedAt if status is pending
    # )
    # new_log.save()
    # logger.info("notification.log_db.success", notification_id=notification_id)
    pass

# --- Internal API Endpoint (as per PRD, but likely less used if event-driven) ---
# The PRD mentions POST /notifications/send. This might be for ad-hoc or specific system-initiated notifications
# not flowing through the main EventBridge event stream.
@app.route("/notifications/send", methods=["POST"])
def send_adhoc_notification():
    # This endpoint would require strict authentication/authorization (e.g., internal service calls only)
    data = request.get_json()
    user_id = data.get("userId")
    subject = data.get("subject")
    message = data.get("message")
    notif_type = data.get("type", "adhoc")
    event_id = data.get("eventId")

    if not all([user_id, subject, message]):
        return jsonify({"message": "Missing userId, subject, or message"}), 400
    
    send_notification_via_sns(user_id, subject, message, notif_type, event_id)
    return jsonify({"message": "Adhoc notification processed"}), 202

# Basic health check endpoint
@app.route("/notifications/health", methods=["GET"])
def health_check():
    logger.info("notification.health.check")
    return jsonify({"status": "Notification service is healthy", "version": "0.1.0"}), 200

# This __main__ is for conceptual local testing of the Flask app part.
# The primary functionality (handle_eventbridge_event) is designed for a Lambda environment.
if __name__ == "__main__":
    # For local testing of the /send endpoint if needed.
    app.run(host="0.0.0.0", port=5004, debug=True)

