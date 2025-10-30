import time
# Implement a rate limiter that allows N requests per time window per user. The interface should be something like isAllowed(userId: string): boolean. 
"""
requests - int 60 
time window - "min, seconds, hours" - > unix epoch ms
11am - 12pm ->> 11:30 - 12pm

no rollover requests

user
- userId
- islimited

"""

allowed_requests = 5
time_window = 5 # string ideally -> unix epoch

user_request_map = {
    'user1': {
        "requests": 0,
        "last_request_time": time.time(), # unix epoch value
    },
    # 'user2': 2,
    # 'user3': 5,
}

def isAllowed(userId: str):
    # is it rolling window
    # is fixed window
    diff = (time.time())- user_request_map[userId]['last_request_time']
    print(diff)
    if diff > time_window:
        user_request_map[userId]['requests'] = 0
        if user_request_map[userId]['requests'] == allowed_requests:
            print("reach here?")
            user_request_map[userId]['requests'] = 0

    # date calculation or integer math
    return user_request_map[userId]['requests'] < allowed_requests

print(isAllowed('user1'))

for i in range(10):
    user_request_map['user1']['requests'] += 1
    print(isAllowed('user1'))
    time.sleep(1)

