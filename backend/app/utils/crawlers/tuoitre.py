import feedparser
from bs4 import BeautifulSoup
from datetime import timezone
from email.utils import parsedate_to_datetime
import requests

from utils.db_utils import get_last_crawl_date, update_last_crawl_date
from database import SessionLocal
from utils.crawlers.categories import CATEGORIES

def get_articles_by_category(category_name, category_url, last_date):    
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

        response = requests.get(entry.link, timeout=10)
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

            data.append({
                "title": entry.title if entry.title else category_name,
                "url": entry.link,
                "posted_date": post_date,
                "content": article_content,
                "image_url": thumbnail,
                "category_name": category_name,
            })  

    return data

def crawl_tuoitre():
    categories = CATEGORIES['tuoitre']
    all_articles = []
    db = SessionLocal()
    last_date = get_last_crawl_date(db, "tuoitre").replace(microsecond=0, tzinfo=timezone.utc)

    selected_categories = list(categories.items())[:]
    for name, url in selected_categories:
        all_articles.extend(get_articles_by_category(name, url, last_date))
    
    # Xử lý duplicate url
    unique_articles = {article['url']: article for article in all_articles}
    all_articles = list(unique_articles.values())

    update_last_crawl_date(db, "tuoitre")
    db.close()
    return all_articles