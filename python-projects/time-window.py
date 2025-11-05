# You're building a simple event tracking system. Given an array of events where
# each event has a timestamp (Unix timestamp in seconds) and an event type
# (string), write a function that counts how many times each event type occurs.

# Part 2
# Now modify your solution to group events by time windows. Add a parameter
# window_size (in seconds) to your function. Return a list of time windows, each
# containing the start time of the window and the count of each event type in that
# window.

# Sample input:
events = [
    {"timestamp": 1609459200, "type": "login"},
    {"timestamp": 1609459260, "type": "page_view"},
    {"timestamp": 1609453360, "type": "login"},
    {"timestamp": 1609459380, "type": "logout"}
]

# Sample output with window_size = 120 (2 minutes):
# [
#     {
#         "window_start": 1609459200,
#         "counts": {"login": 1, "page_view": 1}
#     },
#     {
#         "window_start": 1609459320,
#         "counts": {"login": 1, "logout": 1}
#     }
# ]
# OR 
# {
#    1609459200: {"login", 1, "page_view": 1},
#    1609459320: {"login": 1, "logout": 1}
# }


# def count_this(events):
#     tracking_list = {}
#     for event in events:
#         if event['type'] in tracking_list:
#             tracking_list[event['type']] += 1
#         else:
#             tracking_list[event['type']] = 1 
#     print(tracking_list)
#     return tracking_list

# count_this(events)

"""
1. modify by adding window_size
2. compare current window to the window_size offset

TODO: take into account timestamps out of order

return list
"""
def is_in_window(start_time, cur_time, offset):
    next_time = start_time + offset
    return cur_time <= next_time

def count_this(events, window_size):
    total_list = []
    starting_timestamp = events[0]['timestamp']
    tracking_list = {
        "window_start": starting_timestamp,
        "counts": {}
    }
    total_list.append(tracking_list)

    for event in events:
        cur_timestamp = event['timestamp']
        if is_in_window(starting_timestamp, cur_timestamp, window_size):
            print('yes')
            if event['type'] in tracking_list['counts']:
                tracking_list['counts'][event['type']] += 1
            else:
                tracking_list['counts'][event['type']] = 1 
        else:
            starting_timestamp = event['timestamp']
            # reset the value for appending the next window
            tracking_list = {
                "window_start": starting_timestamp + window_size,
                "counts": {}
            }
            print(event['type'])
            
            tracking_list['counts'][event['type']] = 1 
            total_list.append(tracking_list)

    print(total_list)
    return total_list

window_size = 120
count_this(events, window_size)
