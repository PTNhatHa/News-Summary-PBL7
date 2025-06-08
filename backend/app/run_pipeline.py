import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from database import SessionLocal
from utils.crawlers import vnexpress, tuoitre, baodanang
from models import models
from app.model_summarizer.summarizer import Summarizer
from datetime import datetime, timezone
from time import time
from utils.db_utils import get_last_crawl_date, update_last_crawl_date
from utils.chunking import chunk_text
from utils.embed_utils import get_embedding, upload_to_qdrant

summarizer = Summarizer()

def pipeline():
    start_time = time()
    db = SessionLocal()
    inserted = 0
    
    try:
        # Crawl
        articles = []

        # Báo VNExpress
        last_date_vnexpress = get_last_crawl_date(db, "VNExpress").replace(microsecond=0, tzinfo=timezone.utc)
        print(f"\n\n--------------------LAST DATE CRAWL VNEXPRESS: {last_date_vnexpress}--------------------\n\n")
        articles.extend(vnexpress.crawl_vnexpress(last_date_vnexpress))
        update_last_crawl_date(db, "VNExpress")

        # Báo Tuổi Trẻ
        last_date_tuoitre = get_last_crawl_date(db, "Tuổi Trẻ").replace(microsecond=0, tzinfo=timezone.utc)
        print(f"\n\n--------------------LAST DATE CRAWL BAO TUOI TRE: {last_date_tuoitre}--------------------\n\n")
        articles.extend(tuoitre.crawl_tuoitre(last_date_tuoitre))
        update_last_crawl_date(db, "Tuổi Trẻ")

        # Báo Đà Nẵng
        last_date_baodanang = get_last_crawl_date(db, "Đà Nẵng").replace(microsecond=0, tzinfo=timezone.utc)
        print(f"\n\n--------------------LAST DATE CRAWL BAODANANG: {last_date_baodanang}--------------------\n\n")
        articles.extend(baodanang.crawl_baodanang(last_date_baodanang))
        update_last_crawl_date(db, "Đà Nẵng")

        for article in articles[:]:
            summary_text = ""
            # Check bài viết đã tồn tại
            if db.query(models.Article).filter_by(url=article['url']).first():
                continue
            
            # Sinh tóm tắt
            try:
                summary_text = summarizer.summarize(article['content'])
            except Exception as e:
                print(f"Lỗi khi tóm tắt bài: {article['url']}: {e}")
                continue
            
            # Thêm vào Article
            new_article = models.Article(
                title = article['title'],
                image_url = article['image_url'],
                url = article['url'],
                posted_date = article['posted_date'],
                created_at=datetime.now(),
                category = article['category'],
                source = article['source'],
            )
            db.add(new_article)
            db.flush()
            
            chunks = chunk_text(article['content'])
            for i, chunk in enumerate(chunks, start=1):
                try:
                    embedding = get_embedding(chunk)
                    payload = {
                        "doc_id": new_article.id,   # link to Article.id
                        "chunk_id": i,
                    }
                    upload_to_qdrant(embedding, payload)
                except Exception as e:
                    print(f"Lỗi khi xử lý chunk {i} của bài {article['url']}: {e}")
            try:
                embedding = get_embedding(summary_text)
                payload = {
                    "doc_id": new_article.id,   # link to Article.id
                    "chunk_id": 0,
                }
                upload_to_qdrant(embedding, payload)
            except Exception as e:
                print(f"Lỗi khi xử lý chunk 0 của bài {article['url']}: {e}")

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

        end_time = time()  # Kết thúc đo thời gian
        elapsed = end_time - start_time
        print(f"Tổng thời gian chạy: {elapsed:.2f} giây.")

    except Exception as e:
        db.rollback()
        print(f"Lỗi: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    pipeline()