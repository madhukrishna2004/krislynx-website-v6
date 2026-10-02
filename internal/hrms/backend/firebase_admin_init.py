"""Firestore client for the HRMS.

Renamed from firebase_admin.py: that filename shadowed the `firebase_admin`
package, so `import firebase_admin` imported this file and crashed.
Credentials come from GOOGLE_APPLICATION_CREDENTIALS (path to a service-account
JSON kept OUTSIDE the repository), never from a committed file.
"""
import os

import firebase_admin
from firebase_admin import credentials, firestore

_cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if not _cred_path:
    raise RuntimeError("Set GOOGLE_APPLICATION_CREDENTIALS to the service-account JSON path.")

if not firebase_admin._apps:
    firebase_admin.initialize_app(credentials.Certificate(_cred_path))

db = firestore.client()
