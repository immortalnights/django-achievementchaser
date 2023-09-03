from typing import List, Dict
from graphql import FieldNode


def parse_order_by(value: str):
    values = value.split(" ")[:2]
    if len(values) < 2:
        values.append("ASC")
    elif values[1] not in ("ASC", "DESC"):
        values[1] = "ASC"

    order_modifier = "" if values[1] == "ASC" else "-"

    return (values[0], order_modifier)


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


def get_edge_node_fields(fields: Dict) -> Dict:
    """If the field hierarchy contains an edge and node field, return the selected edge node fields."""
    return fields["edges"]["node"] if fields and "edges" in fields and "node" in fields["edges"] else {}
