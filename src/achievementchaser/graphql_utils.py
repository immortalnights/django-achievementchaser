from typing import List, Dict
from graphql import FieldNode


def get_field_hierarchy(fields: List[FieldNode]) -> Dict:
    """Iterate the fields building an object of field name to subfields."""
    obj = {}
    for field in fields:
        if field.selection_set:
            obj[field.name.value] = get_field_hierarchy(field.selection_set.selections)
        else:
            obj[field.name.value] = []

    return obj


def get_field_selection_hierarchy(fields) -> Dict:
    """Iterate into the first fields' selection set to build field selection hierarchy."""
    return get_field_hierarchy(fields[0].selection_set.selections)


def get_edge_fields(fields: Dict) -> List:
    """If the field hierarchy contains an edge and node field, return the selected edge node fields."""
    res = None
    if fields and "edges" in fields:
        if "node" in fields["edges"]:
            res = list(fields["edges"]["node"].keys())

    return res
