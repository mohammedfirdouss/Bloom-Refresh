"""Utility functions for password hashing and verification."""

from werkzeug.security import generate_password_hash, check_password_hash

# Password Hashing
def hash_password(password):
    """Hashes a password using a strong hashing algorithm."""
    return generate_password_hash(password, method="pbkdf2:sha256")

def verify_password(hashed_password, plain_password):
    """Verifies a plain password against a hashed password."""
    return check_password_hash(hashed_password, plain_password)