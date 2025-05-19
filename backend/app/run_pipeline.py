import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from database import SessionLocal
from utils.crawlers import vnexpress, tuoitre, baodanang
from models import models
from models.summarizer import Summarizer
from datetime import datetime

summarizer = Summarizer()

def pipeline():
    db = SessionLocal()
    inserted = 0
    # Crawl
    articles = []
    articles.extend(vnexpress.crawl_vnexpress())
    articles.extend(tuoitre.crawl_tuoitre())
    articles.extend(baodanang.crawl_baodanang())

    for article in articles[:]:
        # Check bài viết đã tồn tại
        if db.query(models.Article).filter_by(url=article['url']).first():
            continue
        
        # Sinh tóm tắt
        try:
            summary_text = summarizer.summarize(article['content'], article['category_name'])
            print("\nTóm tắt: ", summary_text)
        except Exception as e:
            print(f"Lỗi khi tóm tắt bài: {article['url']}: {e}")
            continue
        
        # Thêm vào Article
        new_article = models.Article(
            title = article['title'],
            image_url = article['image_url'],
            url = article['url'],
            posted_date = article['posted_date'],
            created_at=datetime.now()
        )
        db.add(new_article)
        db.flush()

        # Thêm vào Summary
        new_summary = models.Summary(
            article_id = new_article.id,
            text = summary_text,
            created_at = datetime.now()
        )
        db.add(new_summary)
        inserted += 1
    
    db.commit()
    db.close()
    print(f"Đã lưu {inserted} bài và tóm tắt.")

if __name__ == "__main__":
    pipeline()