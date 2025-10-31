Let's analyze some financial data.

You can fetch transaction line data using the `/data/lines` endpoint.

NOTE: This endpoint supports pagination with `offset` and `page_size` query parameters.

Your task is to calculate statistics for each account:
- line_count: Number of transaction lines belonging to the account
- total_amount: Sum of all amounts from lines belonging to the account

POST your answer back to this URL. Upon success, you'll receive a link to schedule the rest of the interview.

Answer format (JSON):
{
  "result": {
    <account_id>: { "line_count": <number>, "total_amount": <number> },
    <account_id>: { "line_count": <number>, "total_amount": <number> },
    ...
  }
}


# Quickstart
Install

```
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Run
```
python3 query.py
```

