import re


EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
PROJECT_ALLOWED_STATUSES = {"open", "in_progress", "completed", "closed"}


def parse_json_payload(request):
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        raise ValueError("Request body must be a valid JSON object")
    return payload


def normalize_email(email):
    return (email or "").strip().lower()


def validate_email(email):
    if not email:
        raise ValueError("Email is required")
    if not EMAIL_PATTERN.match(email):
        raise ValueError("Email format is invalid")


def validate_password(password):
    if not password:
        raise ValueError("Password is required")
    if len(password) < 8:
        raise ValueError("Password must be at least 8 characters")


def validate_required_text(value, field_name, min_length=1, max_length=None):
    cleaned = (value or "").strip()
    if len(cleaned) < min_length:
        raise ValueError("{0} is required".format(field_name))
    if max_length is not None and len(cleaned) > max_length:
        raise ValueError("{0} cannot exceed {1} characters".format(field_name, max_length))
    return cleaned


def validate_project_status(status):
    if status not in PROJECT_ALLOWED_STATUSES:
        raise ValueError(
            "status must be one of: open, in_progress, completed, closed"
        )


def parse_positive_int(value, field_name):
    try:
        number = int(value)
    except (TypeError, ValueError):
        raise ValueError("{0} must be an integer".format(field_name))

    if number <= 0:
        raise ValueError("{0} must be greater than 0".format(field_name))

    return number
