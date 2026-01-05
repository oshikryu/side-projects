import sys
import os
import json
import re

OUTPUT_FILE_NAME = 'output.json'

def main():
    # get command line arguments
    opts = [opt for opt in sys.argv[1:]]
    sensitive_fields_file = opts[0]
    input_file = opts[1]

    sensitive_fields = []
    json_input = dict()

    with open(sensitive_fields_file, "r") as fields_file:
        for line in fields_file.readlines():
            stripped = line.strip()
            sensitive_fields.append(stripped)

    with open(input_file, "r") as _input:
        json_input = json.load(_input)

    # transform
    transformed = scrub(json_input, sensitive_fields)

    # output to console
    print(transformed)

    # write to output.json
    write_to_output(transformed)

def transform_value(key, value, list_key):
    if key == "id" and not list_key:
        return value

    val_type = type(value)
    if val_type == str:
        return re.sub("\wd*", "*", value)
    elif val_type == int or val_type == float:
        _value = str(value)
        return re.sub("\wd*", "*", _value)
    elif isinstance(value, bool):
        return "-"
    else:
        return value

"""
     loop through json keys
     for each key's value, check type
     if type is list or dict, recursive call
"""
def scrub(json_input, sensitive_fields, list_key=None):
    if type(json_input) == dict:
        total_json = {}
        for key in json_input.keys():
            _value = json_input[key]

            if type(_value) == dict:
                # Recursively scrub nested dict
                scrubbed_value = scrub(_value, sensitive_fields, key)
            elif type(_value) == list:
                # Recursively scrub list
                scrubbed_value = scrub(_value, sensitive_fields, key)
            elif key in sensitive_fields or list_key in sensitive_fields:
                # Transform sensitive fields
                scrubbed_value = transform_value(key, _value, list_key)
            else:
                # Keep non-sensitive values as-is
                scrubbed_value = _value

            total_json[key] = scrubbed_value

        return total_json

    elif type(json_input) == list:
        new_list = []
        for _value in json_input:
            if type(_value) == dict:
                # Recursively scrub dict within list
                scrubbed_value = scrub(_value, sensitive_fields, list_key)
                new_list.append(scrubbed_value)
            elif type(_value) == list:
                # Recursively scrub nested list
                scrubbed_value = scrub(_value, sensitive_fields, list_key)
                new_list.append(scrubbed_value)
            elif list_key in sensitive_fields:
                # Transform values in sensitive list
                new_val = transform_value(list_key, _value, list_key)
                new_list.append(new_val)
            else:
                # Keep non-sensitive values as-is
                new_list.append(_value)

        return new_list

    else:
        # Handle primitive types
        return json_input


def write_to_output(scrubbed: dict):
    with open(OUTPUT_FILE_NAME, "w") as outfile:
        stringified = json.dumps(scrubbed)
        outfile.write(stringified)

if __name__ == "__main__":
    # execute only if run as a script
    main()
