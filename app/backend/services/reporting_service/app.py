"""Reporting service application."""

from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity, JWTManager # To protect endpoints and get user identity
import os
import structlog
from datetime import datetime, UTC
import uuid # For generating reportId

from config import config

# from .models import ReportModel # Placeholder for PynamoDB or similar

app = Flask(__name__)
api = Api(app)
logger = structlog.get_logger()

# Example usage of the config module
SECRET_KEY = config.SECRET_KEY
DATABASE_URL = config.DATABASE_URL

# In-memory data store for demonstration (replace with DynamoDB as per PRD)
reports_db = {}
# Example: reports_db = {"report_uuid_1": {"reportId": "report_uuid_1", "eventId": "event_uuid_1", "submittedBy": "cognito_sub_xyz", "bagsCollected": 10, "photoUrls": ["http://example.com/photo1.jpg"], "submittedAt": "2025-07-16T10:00:00Z"}}

class EventReport(Resource):
    @jwt_required()
    def post(self, event_id):
        submitter_id = get_jwt_identity() # User submitting the report
        data = request.get_json()
        if not data:
            logger.warn("report.create.missing_payload", event_id=event_id, submitter_id=submitter_id)
            return {"message": "Payload missing"}, 400

        # Required fields from PRD: bagsCollected, photoUrls (though PRD implies metrics can be more general)
        bags_collected = data.get("bagsCollected")
        photo_urls = data.get("photoUrls")

        if bags_collected is None or photo_urls is None:
            logger.warn("report.create.missing_fields", event_id=event_id, submitter_id=submitter_id, data_keys=list(data.keys()))
            return {"message": "Missing required fields: bagsCollected, photoUrls"}, 400
        
        if not isinstance(bags_collected, int) or bags_collected < 0:
            return {"message": "bagsCollected must be a non-negative integer"}, 400
        if not isinstance(photo_urls, list) or not all(isinstance(url, str) for url in photo_urls):
            return {"message": "photoUrls must be a list of strings"}, 400

        # TODO: Validate event_id exists (e.g., by calling Event Service or checking a local cache/DB if applicable)
        # For now, we assume event_id is valid.

        report_id = str(uuid.uuid4())
        new_report = {
            "reportId": report_id,
            "eventId": event_id,
            "submittedBy": submitter_id,
            "bagsCollected": bags_collected,
            "photoUrls": photo_urls,
            "submittedAt": datetime.now(UTC).isoformat(),
            "otherMetrics": data.get("otherMetrics", {}) # Allow for additional flexible metrics
        }
        # TODO: Replace with DynamoDB save: ReportModel(**new_report).save()
        reports_db[report_id] = new_report
        logger.info("report.create.success", report_id=report_id, event_id=event_id, submitter_id=submitter_id)
        
        # Optionally, publish an event to EventBridge (e.g., "ReportSubmitted")
        # publish_event_to_event_bridge("ReportSubmitted", {"reportId": report_id, "eventId": event_id, "submittedBy": submitter_id})
        
        return jsonify(new_report), 201

class ReportDetail(Resource):
    @jwt_required() # Or public access depending on requirements
    def get(self, report_id):
        # TODO: Replace with DynamoDB lookup: ReportModel.get(report_id)
        report = reports_db.get(report_id)
        if report:
            logger.info("report.detail.get.success", report_id=report_id)
            return jsonify(report)
        else:
            logger.warn("report.detail.get.not_found", report_id=report_id)
            return {"message": "Report not found"}, 404

# API Resources
# PRD: POST /events/:id/report and GET /reports/:id
api.add_resource(EventReport, "/events/<string:event_id>/report") # For submitting a report for a specific event
api.add_resource(ReportDetail, "/reports/<string:report_id>")    # For retrieving a specific report by its ID

# Basic health check endpoint
@app.route("/reports/health", methods=["GET"])
def health_check():
    logger.info("report.health.check")
    return jsonify({"status": "Reporting service is healthy", "version": "0.1.0"}), 200

if __name__ == "__main__":
    app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "super-secret-key-for-dev-only") 
    jwt = JWTManager(app) # Initialize JWTManager if running standalone for testing
    app.run(host="0.0.0.0", port=5005, debug=True)

