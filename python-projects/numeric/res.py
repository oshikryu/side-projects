import requests
import json

"""
parse the initial response

"""
url = 'https://t1.numeric.codes/schedule/puzzle?token=ca784daa-467e-4dfb-b937-1262895bd9af'

data = {
    "result": {
        1: {"line_count": 20, "total_amount": -9475},
        2: {"line_count": 20, "total_amount": -12300},
        4: {"line_count": 11, "total_amount": 12450},
        5: {"line_count": 10, "total_amount": 9075},
        7: {"line_count": 10, "total_amount": 4700},
        8: {"line_count": 10, "total_amount": 3275},
        9: {"line_count": 9, "total_amount": -10750},
        10: {"line_count": 8, "total_amount": 4825},
        6: {"line_count": 8, "total_amount": -4825},
        12: {"line_count": 3, "total_amount": 1800},
        13: {"line_count": 3, "total_amount": 1225}
    }
}
       

payload = json.dumps(data)

try:
    response = requests.post(url, data=payload)

    if response.status_code == 200:
        # TODO: fix this json error
        # An error occurred during the request: Expecting value: line 1 column 1 (char 0)
        # should return response in json()
        print(response.text)
    else:
        print(response.status_code)
        print(response.text)

except Exception as e:
    print(f"An error occurred during the request: {e}")
