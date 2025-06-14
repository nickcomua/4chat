#!/bin/sh
set -e
COUCHDB_URL="http://$COUCHDB_HOST:5984"

echo "--- Debugging connection to CouchDB ---"
echo "Host: $COUCHDB_HOST"
echo "User: $COUCHDB_USER"
echo "Pass: $COUCHDB_PASSWORD"
echo "URL: $COUCHDB_URL"

echo "--- Testing basic connectivity ---"
# First, test if we can reach the host at all
if ! nc -z $COUCHDB_HOST 5984; then
    echo "ERROR: Cannot reach $COUCHDB_HOST:5984 at all!"
    exit 1
fi
echo "✓ Port 5984 is reachable"

echo "--- Testing CouchDB root endpoint ---"
# Test the root endpoint without authentication
curl_output=$(curl -s -w "HTTP_CODE:%{http_code}" "$COUCHDB_URL/" || echo "CURL_FAILED")
echo "Root endpoint response: $curl_output"

echo "--- Testing _up endpoint without auth ---"
curl_output=$(curl -s -w "HTTP_CODE:%{http_code}" "$COUCHDB_URL/_up" || echo "CURL_FAILED")
echo "_up endpoint response: $curl_output"

echo "--- Testing _up endpoint with auth ---"
curl_output=$(curl -s -w "HTTP_CODE:%{http_code}" -u "$COUCHDB_USER:$COUCHDB_PASSWORD" "$COUCHDB_URL/_up" || echo "CURL_FAILED")
echo "_up with auth response: $curl_output"

echo "--- Waiting for CouchDB to be fully ready ---"
until curl -s -f -u "$COUCHDB_USER:$COUCHDB_PASSWORD" "$COUCHDB_URL/_up" > /dev/null 2>&1; do
    echo "CouchDB is not ready - sleeping"
    sleep 3
done

echo "--- CouchDB is ready! Getting server info ---"
curl -s -u "$COUCHDB_USER:$COUCHDB_PASSWORD" "$COUCHDB_URL/" | head -10

echo "--- Configuring _users database security ---"
curl -X PUT "$COUCHDB_URL/_users" \
     -u "$COUCHDB_USER:$COUCHDB_PASSWORD" \

couch="http://$COUCHDB_USER:$COUCHDB_PASSWORD@$COUCHDB_HOST:5984"; \
head="-H Content-Type:application/json"; \
curl $head -X PUT $couch/photon; curl https://raw.githubusercontent.com/ermouth/couch-photon/master/photon.json | \
curl $head -X PUT $couch/photon/_design/photon -d @- ; curl $head -X PUT $couch/photon/_security -d '{}' ; \
curl $head -X PUT $couch/_node/_local/_config/csp/attachments_enable -d '"false"' ; \
curl $head -X PUT $couch/_node/_local/_config/chttpd_auth/same_site -d '"lax"' ; \
couch=''; head='';

# curl -X PUT "$COUCHDB_URL/_users/_security" \
#      -u "$COUCHDB_USER:$COUCHDB_PASSWORD" \
#      -H "Content-Type: application/json" \
#      -d '{
#        "admins": {
#          "names": [],
#          "roles": ["_admin"]
#        },
#        "members": {
#          "names": [],
#          "roles": ["_admin"]
#        }
#      }'

echo ""
echo "--- CouchDB initialization complete ---"