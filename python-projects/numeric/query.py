import requests
import time
import json

"""
parse the initial response

"""
url = 'https://t1.numeric.codes/data/lines'
initial_resp = requests.get(url, {
    "token": "ca784daa-467e-4dfb-b937-1262895bd9af"
})

# TODO: create a type for the user + amount
users = dict()

# max is 20
page_size = 20

# pages are zero-indexed
cur_page = 0

if initial_resp.status_code >= 400:
    print("Some error")


data = initial_resp.text
res = json.loads(data)

total_line_count = 0


while (res['page']['has_more']):
    offset = cur_page * page_size
    params = {
        "token": "ca784daa-467e-4dfb-b937-1262895bd9af",
        "offset": offset,
        "page_size": page_size,
    }

    try:
        resp = requests.get(url, params=params)
        data = resp.text
        res = json.loads(data)
        # parse response
        for i in res['data']:
            total_line_count += 1
            key = i['account_id']
            # printing the correct id
            #  print(i['id'])

            if key in users:
                users[key]['total_amount'] = users[key]['total_amount'] + i['amount']
                users[key]['line_count'] = users[key]['line_count'] + 1
            else:
                key = i['account_id']
                print('creating account')
                print(key)
                users[key] = {
                    'total_amount': i['amount'],
                    'line_count': 1
                }
        # be nice? rate limit?
        time.sleep(1)
        print(res['data'])

        cur_page += 1

    except Exception as e:
        print(f"Unexpected Error: {e}")


# return result?
print(users)
print(total_line_count)


"""
post answer here
https://t1.numeric.codes/schedule/puzzle?token=ca784daa-467e-4dfb-b937-1262895bd9af
"""
