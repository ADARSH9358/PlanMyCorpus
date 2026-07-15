from curl_cffi import requests
import time

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive"
}

# Use the impersonate parameter to mimic Chrome perfectly
session = requests.Session()

try:
    print("Establishing session with NSE...")
    # 1. Hit homepage to collect real cookies
    session.get("https://www.nseindia.com", headers=headers, impersonate="chrome", timeout=10)
    
    # Small organic human delay
    time.sleep(1) 
    
    print("Fetching stock data...")
    # 2. Hit the internal JSON endpoint
    url = "https://www.nseindia.com/api/quote-equity?symbol=TIPSMUSIC"
    response = session.get(url, headers=headers, impersonate="chrome", timeout=10)
    
    if response.status_code == 200:
        data = response.json()
        print("\n🎉 Success! Data fetched cleanly:")
        print(f"Company: {data['info']['companyName']}")
        print(f"Last Price: ₹{data['priceInfo']['lastPrice']}")
    else:
        print(f"Failed with Status Code: {response.status_code}")
        
except Exception as e:
    print(f"An error occurred: {e}")