#!/usr/bin/env python3
import os
import sys
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By

def take_screenshot(url, output_path):
    # Set up headless Chrome
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--window-size=1920,1080')
    
    # Use chromium browser
    chrome_options.binary_location = '/snap/bin/chromium'
    
    # Set up driver
    driver = webdriver.Chrome(options=chrome_options)
    
    try:
        print(f"Navigating to {url}...")
        driver.get(url)
        time.sleep(3)  # Wait for page to load
        
        print(f"Taking screenshot...")
        driver.save_screenshot(output_path)
        print(f"Screenshot saved to: {output_path}")
        
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False
    finally:
        driver.quit()

if __name__ == "__main__":
    url = "http://localhost:3000"
    timestamp = int(time.time() * 1000)
    output_dir = "screenshots"
    os.makedirs(output_dir, exist_ok=True)
    output_path = f"{output_dir}/dashboard-{timestamp}.png"
    
    take_screenshot(url, output_path)