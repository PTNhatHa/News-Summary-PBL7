import requests
from bs4 import BeautifulSoup
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException
from selenium.webdriver.common.keys import Keys
import time
import re
from datetime import datetime, timezone

from utils.db_utils import get_last_crawl_date, update_last_crawl_date
from database import SessionLocal
from utils.crawlers.categories import CATEGORIES

def get_article_details(article_url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        response = requests.get(article_url, headers=headers, timeout=10)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"[!] Lỗi khi truy cập URL {article_url}: {e}")
        return None

    try:
        soup = BeautifulSoup(response.text, "html.parser")

        # Lấy các thẻ <p> KHÔNG chứa <strong>
        content_paragraphs = []
        for p in soup.select(".col-content p"):
            if not p.find("strong"):
                text = p.get_text(strip=True)
                if text:
                    content_paragraphs.append(text)

        full_content = "\n".join(content_paragraphs)

        # Lấy ngày đăng
        date_tag = soup.select_one("div.date")
        if date_tag:
            date = date_tag.get_text(strip=True)
        else:
            meta_date = soup.find("meta", property="article:published_time")
            date = meta_date["content"] if meta_date else ""

        if not full_content.strip() or not date.strip():
            return None
        return {
            "content": full_content,
            "posted_date": date
        }

    except:
        return None

def get_articles_by_category(category_name, category_url, last_date):    
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--window-size=1920,1080")

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    driver.get(category_url)
    time.sleep(2)
    
    articles = []
    current_page = 1
    
    while True:
        url = f"{category_url}?paged={current_page}"
        driver.get(url)
        time.sleep(3)
        
        try:
            # Chờ tối đa 10 giây để thẻ 'a.active' xuất hiện
            active_page_element = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "a.active"))
            )
            active_page = active_page_element.text.strip()
        except (NoSuchElementException, TimeoutException):
            break  # Thoát vòng lặp nếu không có phân trang
        
        if active_page != str(current_page):  # Nếu số trang không trùng, dừng lại
            break
        
        # Cuộn xuống để load nội dung
        for _ in range(3):
            driver.find_element(By.TAG_NAME, "body").send_keys(Keys.END)
            time.sleep(1)
        
        # Thu thập các bài viết
        articles_elements = driver.find_elements(By.CSS_SELECTOR, "li.item")

        for item in articles_elements:
            try:
                title_elem = item.find_elements(By.CSS_SELECTOR, ".title-lead a.title-1")
                if not title_elem:
                    continue
                title_elem = title_elem[0]
                title = title_elem.text.strip()
                link = title_elem.get_attribute("href")

                description_elem = item.find_elements(By.CSS_SELECTOR, ".lead")
                description = description_elem[0].text.strip() if description_elem else ""

                img_elem = item.find_elements(By.CSS_SELECTOR, ".m-avatar img")
                thumbnail = img_elem[0].get_attribute("src") if img_elem else ""

                if not link or any(article["title"] == title for article in articles):
                    continue

                # Crawl nội dung chi tiết bài viết
                content = get_article_details(link)
                if content:
                    match = re.search(r'(\d{1,2})/(\d{1,2})/(\d{4}), (\d{1,2}):(\d{2})', content["posted_date"])
                    if match:
                        day, month, year, hour, minute = map(int, match.groups())
                        post_date = datetime(year, month, day, hour, minute).astimezone(timezone.utc)
                        # So sánh thời gian của bài đăng với last_date
                        if post_date < last_date:
                            driver.quit()
                            return articles
                    else:
                        continue
                else:
                    continue

                articles.append({
                    "title": title, 
                    "url": link,
                    "posted_date": post_date, 
                    "content": content["content"],
                    "image_url": thumbnail,
                    "category_name": category_name,
                })
            except Exception as e:
                print(f"Lỗi khi xử lý bài viết: {e}")
                continue

        current_page += 1 
    
    driver.quit()
    return articles

def crawl_baodanang():
    categories = CATEGORIES['baodanang']
    all_articles = []
    db = SessionLocal()
    last_date = get_last_crawl_date(db, "baodanang").replace(microsecond=0, tzinfo=timezone.utc)

    selected_categories = list(categories.items())[:]
    for name, url in selected_categories:
        all_articles.extend(get_articles_by_category(name, url, last_date))
    
    # Xử lý duplicate url
    unique_articles = {article['url']: article for article in all_articles}
    all_articles = list(unique_articles.values())

    update_last_crawl_date(db, "baodanang")
    db.close()
    return all_articles