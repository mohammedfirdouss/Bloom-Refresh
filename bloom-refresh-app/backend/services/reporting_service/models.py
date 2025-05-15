from pynamodb.models import Model
from pynamodb.attributes import UnicodeAttribute, MapAttribute, UTCDateTimeAttribute, NumberAttribute, ListAttribute
import os
from datetime import datetime

# As per PRD Data Models:
# Service: Reporting
# Table: Reports
# PK: reportId
# Attributes: eventId, submittedBy, bagsCollected, photoUrls, submittedAt

class ReportModel(Model):
    """
    Represents a post-event report submitted by a user.
    """
    class Meta:
        table_name = os.environ.get("REPORTS_DYNAMODB_TABLE", "BloomRefresh-Reports")
        region = os.environ.get("AWS_REGION", "us-east-1")
        aws_access_key_id = os.environ.get("AWS_ACCESS_KEY_ID_DUMMY", "dummy")
        aws_secret_access_key = os.environ.get("AWS_SECRET_ACCESS_KEY_DUMMY", "dummy")

    reportId = UnicodeAttribute(hash_key=True)
    eventId = UnicodeAttribute(null=False)
    submittedBy = UnicodeAttribute(null=False) # userId of the submitter
    bagsCollected = NumberAttribute(null=False)
    photoUrls = ListAttribute(of=UnicodeAttribute, null=False) # List of S3 URLs for photos
    otherMetrics = MapAttribute(null=True) # For any additional metrics collected
    submittedAt = UTCDateTimeAttribute(default=datetime.utcnow)

    def __iter__(self):
        for name, attr in self.get_attributes().items():
            yield name, attr.serialize(getattr(self, name))

# Example (conceptual):
# if not ReportModel.exists():
#     ReportModel.create_table(read_capacity_units=1, write_capacity_units=1, wait=True)

