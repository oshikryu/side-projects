"""
Validate an IP address (IPv4). An address is valid if and only if it is in the form "X.X.X.X", where each X is a number from 0 to 255.

For example, "12.34.5.6", "0.23.25.0", and "255.255.255.255" are valid IP addresses, while "12.34.56.oops", "1.2.3.4.5", and "123.235.153.425" are invalid IP addresses.
"""

def validateIP(ip: str) -> bool:
    # count only 4 dots
    split_array = ip.split(".")
    if len(split_array) != 4:
        return False
    try:
        val_array = map(int, split_array)
        all_ints = all(isinstance(cast, int) for cast in val_array)
        valid_range = all([(val < 256 and val > -1) for val in val_array])
        print(valid_range)
        if not valid_range:
            return False
        if not all_ints:
            return False
    except ValueError:
        return False
    return True

	
# debug your code below
# print(validateIP('192.168.0.1'))
print(validateIP("1..23.4"))
