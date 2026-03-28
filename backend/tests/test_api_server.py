import json
import os
import sys

# Ensure backend package imports work
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from api_server import app
from test_helpers import metadata_decorator


@metadata_decorator(function='api_server.health_check', input_desc='GET /api/health (no input)', expected='200 OK and {"status":"healthy"}')
def test_health_check():
    client = app.test_client()
    res = client.get('/api/health')
    assert res.status_code == 200
    data = res.get_json()
    assert data.get('status') == 'healthy'
