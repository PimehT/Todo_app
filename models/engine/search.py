"""
Module to implement search

search body
{
  "filters": {
	"condition": "OR | AND", # specifies how rules shall be matched
	"rules": [
	    {
		"field": <column>, # column to apply search
		"operator": "eq|neq|like" # condition to match the value
		"value": <value> # value to match
	    },
	    ...
	]
    }
}

returns: (list of results, errs)
"""
from models import storage

CONDITION_OPTIONS = ['OR', 'AND']

RULES_KEYS_OPTIONS = {
    'field': [],
    'operator': ['eq', 'neq', 'like', 'ilike'],
    'value': []
}


def search(filters: dict, cls):
    """
    Implement search on the cls with the filters specified
    """
    condition = filters.get("condition", "OR")
    rules = filters.get("rules", [])
    user = filters.get("user", None)
    results = []
    fields = {}
    clauses = []

    # validate filters
    if condition not in CONDITION_OPTIONS:
        valids = ', '.join(CONDITION_OPTIONS)
        error = {'filters-error': f"valid values for condition '{valids}'"}
        return results, error

    if not cls:
        error = {'filters-error': 'cls is None'}
        return results, error

    if not user:
        error = {'filters-error': 'user is None'}
        return results, error
    else:
        # user_id = user.id
        fields['user_id'] = user.id

    columns = {}
    for col in cls.__table__.columns:
        col_name = str(col).split('.')[1]
        columns[col_name] = col

    for rule in rules:
        for key, value in rule.items():
            if key not in RULES_KEYS_OPTIONS:
                valids = ', '.join(RULES_KEYS_OPTIONS.keys())
                error = {"rule-key-error": f"valid keys '{valids}'"}
                return results, error
            valid_key_values = RULES_KEYS_OPTIONS.get(key)
            if valid_key_values and value not in valid_key_values:
                valids = ', '.join(valid_key_values)
                error = {"rule-field-error": f"valid values for field['{key}']: '{valids}'"}
                return results, error

            if key == 'field' and not hasattr(cls, value):
                error = {"rule-field-error": f"class '{cls.__tablename__}' has no column '{value}'"}
                return results, error

        # create clauses to use in query
        field = rule.get('field', None)
        operator = rule.get('operator', 'eq')
        value = rule.get('value', None)
        column_obj = columns.get(field, None)

        for name, item in {'field': field, 'value': value}.items():
            if item is None:
                error = {"rule-error": f"missing key '{name}' in rule"}
                return results, error
        # print(f"field: {field}, value: {value}")

        if operator == 'eq':
            clauses.append(column_obj == value)
        elif operator == 'neq':
            clauses.append(column_obj != value)
        elif operator == 'ilike':
            clauses.append(column_obj.ilike(f"%{value}%"))
        elif operator == 'like':
            clauses.append(column_obj.like(f"%{value}%"))
        else:
            continue

    objs = storage.advanced_search(cls, clauses, condition)

    results = [obj.to_dict() for obj in objs]

    return results, ""
