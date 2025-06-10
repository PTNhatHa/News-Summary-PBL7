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
import time
import re
from datetime import datetime, timezone

from utils.db_utils import get_last_crawl_date, update_last_crawl_date
from database import SessionLocal
from utils.crawlers.categories import CATEGORIES
from utils.crawlers.categories_mapping import CATEGORY_MAPPING

def get_article_details(article_url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
    }

    try:
        with requests.Session() as session:
            response = session.get(article_url, headers=headers, allow_redirects=True, timeout=(5, 10))
            
            if response.status_code != 200:
                return None
            
            # Nếu bị redirect quá nhiều thì bỏ qua bài viết
            if len(response.history) > 5:                
                return None

            soup = BeautifulSoup(response.text, "html.parser")

            # Tiêu đề bài viết
            title_tag = soup.find("h1", class_="title-detail")
            title = title_tag.get_text(strip=True) if title_tag else ""

            # Ngày đăng
            date_tag = soup.find("span", class_="date")
            date = date_tag.text.strip() if date_tag else ""
            
            # Nội dung
            paragraphs = [p for p in soup.select("article p") if not p.find("strong")]    
            contents = []
            for p in paragraphs:
                if p.find("em"):
                    text_parts = p.find_all(text=True, recursive=False)
                    text_clean = ''.join(t.strip() for t in text_parts if t.strip())
                    if text_clean:
                        contents.append(text_clean)
                else:
                    text = p.get_text(strip=True)
                    if text:
                        contents.append(text)
            content = "\n".join(contents) if contents else ""
            content = content.replace(' Ảnh:', '')
            # Nếu không có content thì return None
            if not title:
                print("Không có title")

            if not title or not content.strip() or not date.strip():
                return None
            return {
                "title": title, 
                "posted_date": date, 
                "content": content
                }
    except:
        return None

def get_articles_by_category(category_name, category_url, last_date):    
    # Dùng selenium để tự động điều khiển Chrome
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--window-size=1920,1080")

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    try:
        driver.get(category_url)
        print("Crawl from: ", category_url)
        time.sleep(2)  # Chờ trang load lần đầu

        articles = []  

        collected_links = set(article["URL"] for article in articles)

        last_article_count = 0
        scroll_count = 0

        while True:
            # Lấy danh sách bài viết hiện tại
            news_items = driver.find_elements(By.CSS_SELECTOR, "article h2 a[href], article h3 a[href]")
            
            if news_items:            
                for item in news_items:
                    link = item.get_attribute("href").split("#box_comment_vne")[0]
                    if link in collected_links:  # Kiểm tra nếu link đã tồn tại
                        continue

                    try:
                        article = item.find_element(By.XPATH, "./ancestor::article")

                        # Lấy thumbnail
                        thumbnail_img = article.find_element(By.CSS_SELECTOR, ".thumb-art img")
                        thumbnail = thumbnail_img.get_attribute("src")
                    except:
                        thumbnail = None

                    content = get_article_details(link)
                    if not content:
                        continue

                    if content["posted_date"]:
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
                        "title": content["title"], 
                        "url": link,
                        "posted_date": post_date, 
                        "content": content["content"],
                        "image_url": thumbnail,
                        "category": CATEGORY_MAPPING.get(category_name, "Khác"),
                        "source": "VNExpress"
                    })
                    time.sleep(1.5)
                    collected_links.add(link)  # Thêm link mới vào tập hợp để tránh trùng lặp

            # Nếu số bài viết không thay đổi sau một vòng lặp => dừng lại
            if len(articles) == last_article_count:
                break
            last_article_count = len(articles)

            # Kiểm tra nút 'Xem thêm'
            try:
                more_button = WebDriverWait(driver, 2).until(
                    EC.element_to_be_clickable((By.CSS_SELECTOR, ".lazy_more"))
                )
                more_button.click()
                time.sleep(2)
                continue 
            except:
                pass 

            # Thử cuộn xuống
            last_height = driver.execute_script("return document.body.scrollHeight")
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(2)
            new_height = driver.execute_script("return document.body.scrollHeight")

            if new_height > last_height:
                scroll_count += 1
                continue

            # Thử bấm 'Trang tiếp theo'
            try:
                next_page_btn = WebDriverWait(driver, 2).until(
                    EC.element_to_be_clickable((By.CSS_SELECTOR, "a.btn-page.next-page:not(.disable)"))
                )
                next_page_btn.click()
                time.sleep(2)
                scroll_count = 0 
            except:
                break 
    except Exception as e:
        print(f"[!] Lỗi khi mở danh mục {category_url}: {e}")
        return []
    finally:
        driver.quit()
    
    return articles

def crawl_vnexpress(last_date):
    categories = CATEGORIES['vnexpress']
    all_articles = []
    
    selected_categories = list(categories.items())[:]
    for name, url in selected_categories:
        all_articles.extend(get_articles_by_category(name, url, last_date))
    
    # Xử lý duplicate url
    unique_articles = {article['url']: article for article in all_articles}
    all_articles = list(unique_articles.values())

    print(f"Crawl {len(all_articles)} bài từ Báo VNExpress")
    return all_articles