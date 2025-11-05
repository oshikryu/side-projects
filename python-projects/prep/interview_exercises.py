"""
Senior Software Engineer - Practice Interview Problems
Complete these exercises to test your understanding
"""

import csv
import json
import requests
from typing import List, Dict, Any
from datetime import datetime
from collections import defaultdict, Counter

# =============================================================================
# PROBLEM 1: CSV DATA PROCESSING
# =============================================================================

"""
Problem: Process a CSV file of sales transactions
Given CSV with columns: date, product_id, product_name, quantity, price, customer_id
Tasks:
1. Calculate total revenue per product
2. Find top 5 customers by total spending
3. Identify products with declining sales (compare first half vs second half)
"""

def process_sales_data(csv_filename: str) -> Dict[str, Any]:
    """
    Solution to Problem 1
    """
    # Read CSV
    transactions = []
    with open(csv_filename, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            transactions.append({
                'date': datetime.strptime(row['date'], '%Y-%m-%d'),
                'product_id': row['product_id'],
                'product_name': row['product_name'],
                'quantity': int(row['quantity']),
                'price': float(row['price']),
                'customer_id': row['customer_id']
            })
    
    # Sort by date for time analysis
    transactions.sort(key=lambda x: x['date'])
    mid_point = len(transactions) // 2
    
    # 1. Revenue per product
    revenue_by_product = defaultdict(float)
    for t in transactions:
        revenue_by_product[t['product_name']] += t['quantity'] * t['price']
    
    # 2. Top customers
    spending_by_customer = defaultdict(float)
    for t in transactions:
        spending_by_customer[t['customer_id']] += t['quantity'] * t['price']
    
    top_customers = sorted(spending_by_customer.items(), 
                          key=lambda x: x[1], reverse=True)[:5]
    
    # 3. Declining products
    first_half_sales = defaultdict(int)
    second_half_sales = defaultdict(int)
    
    for i, t in enumerate(transactions):
        if i < mid_point:
            first_half_sales[t['product_name']] += t['quantity']
        else:
            second_half_sales[t['product_name']] += t['quantity']
    
    declining_products = []
    for product in first_half_sales:
        if second_half_sales[product] < first_half_sales[product]:
            declining_products.append({
                'product': product,
                'first_half': first_half_sales[product],
                'second_half': second_half_sales[product],
                'decline_pct': (first_half_sales[product] - second_half_sales[product]) 
                               / first_half_sales[product] * 100
            })
    
    return {
        'revenue_by_product': dict(revenue_by_product),
        'top_customers': top_customers,
        'declining_products': declining_products
    }


# =============================================================================
# PROBLEM 2: API DATA FETCHING AND JSON PROCESSING
# =============================================================================

"""
Problem: GitHub Repository Analyzer
Using the GitHub API (https://api.github.com):
1. Fetch repositories for a given user
2. Extract: name, stars, forks, language, last_updated
3. Calculate: total stars, most used language, average forks
4. Find repositories updated in the last 30 days
"""

def analyze_github_repos(username: str) -> Dict[str, Any]:
    """
    Solution to Problem 2
    """
    url = f"https://api.github.com/users/{username}/repos"
    
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        repos = response.json()
    except requests.RequestException as e:
        return {'error': str(e)}
    
    # Extract relevant data
    repo_data = []
    for repo in repos:
        repo_data.append({
            'name': repo.get('name'),
            'stars': repo.get('stargazers_count', 0),
            'forks': repo.get('forks_count', 0),
            'language': repo.get('language', 'Unknown'),
            'updated_at': datetime.strptime(
                repo.get('updated_at', ''), 
                '%Y-%m-%dT%H:%M:%SZ'
            ) if repo.get('updated_at') else None
        })
    
    # Calculate statistics
    total_stars = sum(r['stars'] for r in repo_data)
    
    # Most used language
    language_count = Counter(r['language'] for r in repo_data 
                            if r['language'] != 'Unknown')
    most_used_language = language_count.most_common(1)[0] if language_count else ('None', 0)
    
    # Average forks
    avg_forks = sum(r['forks'] for r in repo_data) / len(repo_data) if repo_data else 0
    
    # Recent repos (last 30 days)
    thirty_days_ago = datetime.now() - timedelta(days=30)
    recent_repos = [r['name'] for r in repo_data 
                   if r['updated_at'] and r['updated_at'] > thirty_days_ago]
    
    return {
        'total_repos': len(repo_data),
        'total_stars': total_stars,
        'most_used_language': most_used_language[0],
        'average_forks': round(avg_forks, 2),
        'recent_repos': recent_repos,
        'top_starred': sorted(repo_data, key=lambda x: x['stars'], reverse=True)[:5]
    }


# =============================================================================
# PROBLEM 3: NESTED JSON NAVIGATION
# =============================================================================

"""
Problem: Extract data from complex API response
Given a nested JSON structure for an e-commerce order:
{
  "order_id": "12345",
  "customer": {
    "id": "C001",
    "name": "John Doe",
    "contact": {
      "email": "john@example.com",
      "phone": "555-0100"
    }
  },
  "items": [
    {
      "product": {"id": "P001", "name": "Laptop", "category": "Electronics"},
      "quantity": 1,
      "price": 999.99
    },
    ...
  ],
  "shipping": {
    "address": {...},
    "method": "express",
    "cost": 15.00
  }
}

Tasks:
1. Extract all product categories
2. Calculate order subtotal and total (including shipping)
3. Create a flat summary dictionary
"""

def process_order(order_json: Dict) -> Dict[str, Any]:
    """
    Solution to Problem 3
    """
    # Extract categories
    categories = set()
    for item in order_json.get('items', []):
        category = item.get('product', {}).get('category')
        if category:
            categories.add(category)
    
    # Calculate totals
    subtotal = sum(
        item.get('quantity', 0) * item.get('price', 0)
        for item in order_json.get('items', [])
    )
    
    shipping_cost = order_json.get('shipping', {}).get('cost', 0)
    total = subtotal + shipping_cost
    
    # Flat summary
    summary = {
        'order_id': order_json.get('order_id'),
        'customer_name': order_json.get('customer', {}).get('name'),
        'customer_email': order_json.get('customer', {}).get('contact', {}).get('email'),
        'items_count': len(order_json.get('items', [])),
        'categories': list(categories),
        'subtotal': round(subtotal, 2),
        'shipping_cost': shipping_cost,
        'total': round(total, 2),
        'shipping_method': order_json.get('shipping', {}).get('method')
    }
    
    return summary


# =============================================================================
# PROBLEM 4: DATA TRANSFORMATION AND CLEANUP
# =============================================================================

"""
Problem: Clean and normalize user data
Given messy user data with inconsistent formats:
- Emails with mixed case and whitespace
- Phone numbers in various formats
- Missing or invalid dates
- Duplicate records

Tasks:
1. Normalize all emails and phone numbers
2. Parse and validate dates
3. Remove duplicates (by email)
4. Fill missing values with defaults
"""

import re
from typing import Optional
from datetime import datetime

def clean_user_data(users: List[Dict]) -> List[Dict]:
    """
    Solution to Problem 4
    """
    def normalize_email(email: str) -> str:
        if not email:
            return ""
        return email.strip().lower()
    
    def normalize_phone(phone: str) -> str:
        if not phone:
            return ""
        # Extract only digits
        digits = re.sub(r'\D', '', phone)
        # Format as XXX-XXX-XXXX if 10 digits
        if len(digits) == 10:
            return f"{digits[:3]}-{digits[3:6]}-{digits[6:]}"
        return digits
    
    def parse_date(date_str: str) -> Optional[str]:
        if not date_str:
            return None
        
        # Try multiple date formats
        formats = ['%Y-%m-%d', '%m/%d/%Y', '%d-%m-%Y']
        for fmt in formats:
            try:
                dt = datetime.strptime(date_str, fmt)
                return dt.strftime('%Y-%m-%d')  # Standardize format
            except ValueError:
                continue
        return None
    
    cleaned = []
    seen_emails = set()
    
    for user in users:
        # Normalize
        email = normalize_email(user.get('email', ''))
        
        # Skip duplicates
        if email in seen_emails:
            continue
        
        if email:  # Only add if valid email
            seen_emails.add(email)
            
            cleaned_user = {
                'email': email,
                'phone': normalize_phone(user.get('phone', '')),
                'name': user.get('name', '').strip() or 'Unknown',
                'signup_date': parse_date(user.get('signup_date', '')),
                'status': user.get('status', 'active').lower(),
                'age': int(user.get('age', 0)) if user.get('age') else None
            }
            
            cleaned.append(cleaned_user)
    
    return cleaned


# =============================================================================
# PROBLEM 5: SEQUENCE ANALYSIS
# =============================================================================

"""
Problem: Analyze time-series sensor data
Given a list of temperature readings over time:
[72.1, 72.3, 72.5, 75.2, 75.8, 76.1, 73.2, 72.9, ...]

Tasks:
1. Detect anomalies (readings > 2 std deviations from mean)
2. Find the longest stable period (change < 0.5 degrees between readings)
3. Calculate 5-reading moving average
4. Identify rapid changes (> 2 degrees between consecutive readings)
"""

def analyze_temperature_data(readings: List[float]) -> Dict[str, Any]:
    """
    Solution to Problem 5
    """
    if not readings:
        return {}
    
    # 1. Detect anomalies
    mean = sum(readings) / len(readings)
    variance = sum((x - mean) ** 2 for x in readings) / len(readings)
    std_dev = variance ** 0.5
    
    anomalies = []
    for i, reading in enumerate(readings):
        if abs(reading - mean) > 2 * std_dev:
            anomalies.append({'index': i, 'value': reading})
    
    # 2. Longest stable period
    max_stable_length = 0
    current_stable_length = 1
    max_stable_start = 0
    current_stable_start = 0
    
    for i in range(1, len(readings)):
        if abs(readings[i] - readings[i-1]) < 0.5:
            current_stable_length += 1
        else:
            if current_stable_length > max_stable_length:
                max_stable_length = current_stable_length
                max_stable_start = current_stable_start
            current_stable_length = 1
            current_stable_start = i
    
    # Check last sequence
    if current_stable_length > max_stable_length:
        max_stable_length = current_stable_length
        max_stable_start = current_stable_start
    
    # 3. Moving average
    window = 5
    moving_avg = []
    for i in range(len(readings) - window + 1):
        avg = sum(readings[i:i+window]) / window
        moving_avg.append(round(avg, 2))
    
    # 4. Rapid changes
    rapid_changes = []
    for i in range(1, len(readings)):
        change = abs(readings[i] - readings[i-1])
        if change > 2.0:
            rapid_changes.append({
                'index': i,
                'from': readings[i-1],
                'to': readings[i],
                'change': round(change, 2)
            })
    
    return {
        'mean': round(mean, 2),
        'std_dev': round(std_dev, 2),
        'anomalies': anomalies,
        'longest_stable_period': {
            'start_index': max_stable_start,
            'length': max_stable_length
        },
        'moving_average': moving_avg,
        'rapid_changes': rapid_changes
    }


# =============================================================================
# PROBLEM 6: DATA AGGREGATION AND REPORTING
# =============================================================================

"""
Problem: Generate sales report from transaction data
Given transactions with: date, region, product, quantity, revenue

Tasks:
1. Total revenue by region
2. Top 3 products by revenue in each region
3. Month-over-month growth by region
4. Product mix (percentage of revenue per product)
"""

def generate_sales_report(transactions: List[Dict]) -> Dict[str, Any]:
    """
    Solution to Problem 6
    """
    # 1. Revenue by region
    revenue_by_region = defaultdict(float)
    for t in transactions:
        revenue_by_region[t['region']] += t['revenue']
    
    # 2. Top products per region
    revenue_by_region_product = defaultdict(lambda: defaultdict(float))
    for t in transactions:
        revenue_by_region_product[t['region']][t['product']] += t['revenue']
    
    top_products_by_region = {}
    for region, products in revenue_by_region_product.items():
        top_3 = sorted(products.items(), key=lambda x: x[1], reverse=True)[:3]
        top_products_by_region[region] = top_3
    
    # 3. Month-over-month growth
    # Group by region and month
    monthly_revenue = defaultdict(lambda: defaultdict(float))
    for t in transactions:
        month = t['date'].strftime('%Y-%m')
        monthly_revenue[t['region']][month] += t['revenue']
    
    mom_growth = {}
    for region, months in monthly_revenue.items():
        sorted_months = sorted(months.items())
        if len(sorted_months) >= 2:
            prev_month_rev = sorted_months[-2][1]
            curr_month_rev = sorted_months[-1][1]
            growth = ((curr_month_rev - prev_month_rev) / prev_month_rev * 100 
                     if prev_month_rev > 0 else 0)
            mom_growth[region] = round(growth, 2)
    
    # 4. Product mix
    total_revenue = sum(t['revenue'] for t in transactions)
    revenue_by_product = defaultdict(float)
    for t in transactions:
        revenue_by_product[t['product']] += t['revenue']
    
    product_mix = {
        product: round(revenue / total_revenue * 100, 2)
        for product, revenue in revenue_by_product.items()
    }
    
    return {
        'revenue_by_region': dict(revenue_by_region),
        'top_products_by_region': top_products_by_region,
        'mom_growth': mom_growth,
        'product_mix': product_mix,
        'total_revenue': round(total_revenue, 2)
    }


# =============================================================================
# TEST YOUR SOLUTIONS
# =============================================================================

def test_solutions():
    """
    Create sample data and test each solution
    """
    print("Testing Problem Solutions...\n")
    
    # Test Problem 3: Nested JSON
    sample_order = {
        "order_id": "12345",
        "customer": {
            "id": "C001",
            "name": "John Doe",
            "contact": {
                "email": "john@example.com",
                "phone": "555-0100"
            }
        },
        "items": [
            {
                "product": {"id": "P001", "name": "Laptop", "category": "Electronics"},
                "quantity": 1,
                "price": 999.99
            },
            {
                "product": {"id": "P002", "name": "Mouse", "category": "Electronics"},
                "quantity": 2,
                "price": 25.00
            }
        ],
        "shipping": {
            "method": "express",
            "cost": 15.00
        }
    }
    
    print("Problem 3 - Order Processing:")
    result = process_order(sample_order)
    print(json.dumps(result, indent=2))
    print()
    
    # Test Problem 4: Data Cleaning
    sample_users = [
        {"email": " JOHN@EXAMPLE.COM ", "phone": "(555) 123-4567", "name": "John", "age": "30"},
        {"email": "jane@example.com", "phone": "555.987.6543", "name": "Jane"},
        {"email": " JOHN@EXAMPLE.COM ", "phone": "5551234567", "name": "John Duplicate"},  # Duplicate
    ]
    
    print("Problem 4 - Data Cleaning:")
    cleaned = clean_user_data(sample_users)
    print(json.dumps(cleaned, indent=2))
    print()
    
    # Test Problem 5: Sequence Analysis
    sample_temps = [72.1, 72.3, 72.5, 75.2, 75.8, 76.1, 73.2, 72.9, 72.8, 72.7, 72.6, 80.5]
    
    print("Problem 5 - Temperature Analysis:")
    temp_analysis = analyze_temperature_data(sample_temps)
    print(json.dumps(temp_analysis, indent=2))


if __name__ == "__main__":
    test_solutions()

"""
ADDITIONAL INTERVIEW QUESTIONS TO PRACTICE:

1. Implement rate limiting for API calls (token bucket algorithm)
2. Parse and validate credit card numbers (Luhn algorithm)
3. Detect cycles in time-series data
4. Implement LRU cache for API responses
5. Merge and deduplicate data from multiple CSV sources
6. Calculate percentiles and quartiles for large datasets
7. Implement exponential backoff for retry logic
8. Parse and normalize international phone numbers
9. Detect trending topics from text data
10. Implement sliding window max/min for streaming data
"""
