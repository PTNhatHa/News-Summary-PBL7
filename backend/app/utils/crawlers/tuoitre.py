import feedparser
from bs4 import BeautifulSoup
from datetime import timezone
from email.utils import parsedate_to_datetime
import requests
import socket
import time

from utils.db_utils import get_last_crawl_date, update_last_crawl_date
from database import SessionLocal
from utils.crawlers.categories import CATEGORIES
from utils.crawlers.categories_mapping import CATEGORY_MAPPING

def get_articles_by_category(category_name, category_url, last_date):  
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }  
    feed = feedparser.parse(category_url)
    data = []
    
    for entry in feed.entries:
        if entry.published:
            post_date = parsedate_to_datetime(entry.published).astimezone(timezone.utc)
            if post_date < last_date:
                return data
        else:
            continue
        
        # Lấy ảnh từ description (nếu có)
        thumbnail = None
        if 'description' in entry:
            soup_desc = BeautifulSoup(entry.description, "html.parser")

            # Lấy phần mô tả (loại bỏ thẻ <img>)
            for img in soup_desc.find_all("img"):
                img.decompose()

            # Lấy ảnh
            img_tag = soup_desc.find("img")
            if img_tag and img_tag.has_attr("src"):
                thumbnail = img_tag["src"]

        # Nếu không có thì thử lấy từ enclosure
        if not thumbnail and 'enclosures' in entry and len(entry.enclosures) > 0:
            enclosure = entry.enclosures[0]
            if enclosure.get("type", "").startswith("image") and enclosure.get("url"):
                thumbnail = enclosure["url"]

        try:
            response = requests.get(entry.link, headers=headers, timeout=(5, 10))
            response.raise_for_status()
        except (requests.RequestException, requests.Timeout, socket.error, ConnectionResetError) as e:
            print(f"Lỗi khi tải {entry.link}: {e}")
            continue

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            content_div = soup.find("div", class_="detail-content")
            if content_div:
                paragraphs = content_div.find_all("p", recursive=False)
                filtered_paragraphs = []
                for p in paragraphs:
                    # Bỏ qua nếu <p> thõa mãn
                    if p.find_parent(["figure", "figcaption"]): continue
                    if p.has_attr("data-placeholder"): continue
                    text = p.get_text(strip=True)
                    if "Ảnh:" in text or "- Ảnh" in text: continue

                    if text:
                        filtered_paragraphs.append(text)
                article_content = "\n".join(filtered_paragraphs)
            else:
                continue
            if not article_content.strip():
                continue

            if not entry.title:
                continue
            
            data.append({
                "title": entry.title,
                "url": entry.link,
                "posted_date": post_date,
                "content": article_content,
                "image_url": thumbnail,
                "category": CATEGORY_MAPPING.get(category_name, "Khác"),
                "source": "Tuổi Trẻ"
            })  
            time.sleep(1.5)

    return data

def crawl_tuoitre(last_date):
    categories = CATEGORIES['tuoitre']
    all_articles = []
    
    selected_categories = list(categories.items())[:]
    for name, url in selected_categories:
        all_articles.extend(get_articles_by_category(name, url, last_date))
    
    # Xử lý duplicate url
    unique_articles = {article['url']: article for article in all_articles}
    all_articles = list(unique_articles.values())
    
    print(f"Crawl {len(all_articles)} bài từ Báo Tuổi Trẻ")
    return all_articles