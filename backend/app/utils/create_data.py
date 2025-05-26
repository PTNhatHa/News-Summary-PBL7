from sqlalchemy.orm import Session
from app.models.models import Article, Summary
from datetime import datetime
import random

def create_fake_data(db: Session):
    # if db.query(Article).first():
    #     print("Data already exists, skipping fake data creation.")
    #     return

    # for i in range(1, 6):
    #     article = Article(
    #         title=f"Bài báo số {i}",
    #         content=f"Nội dung chi tiết của bài báo số {i}.",
    #         image_url=f"https://example.com/image{i}.jpg",
    #         url=f"https://example.com/article{i}",
    #         created_at=datetime.now()
    #     )
    #     db.add(article)
    #     db.flush()  # Đảm bảo article.id có giá trị trước khi thêm summary

    #     summary = Summary(
    #         article_id=article.id,
    #         text=f"Đây là tóm tắt ngắn cho bài báo số {i}.",
    #         created_at=datetime.now()
    #     )
    #     db.add(summary)

    # db.commit()
    print("Fake data inserted.")
