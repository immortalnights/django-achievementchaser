def parse_order_by(value: str):
    values = value.split(" ")[:2]
    if len(values) < 2:
        values.append("ASC")
    elif values[1] not in ("ASC", "DESC"):
        values[1] = "ASC"

    order_modifier = "" if values[1] == "ASC" else "-"

    return (values[0], order_modifier)
