from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from services.auth_services.app import api as auth_api
from services.event_services.app import api as event_api
from services.user_services.app import api as user_api
from services.reporting_service.app import api as reporting_api

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Create main API
api = Api(app, prefix='/api')

# Add all resources from each service
for resource in auth_api.resources:
    api.add_resource(resource.resource, *resource.urls)

for resource in event_api.resources:
    api.add_resource(resource.resource, *resource.urls)

for resource in user_api.resources:
    api.add_resource(resource.resource, *resource.urls)

for resource in reporting_api.resources:
    api.add_resource(resource.resource, *resource.urls)

@app.route('/health')
def health_check():
    return {'status': 'ok'}, 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) 