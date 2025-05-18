# app/api/articles.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Article, Summary
from app.schemas.article import ArticleOut
from typing import List
from datetime import datetime

router = APIRouter()

@router.get("/articles", response_model=List[ArticleOut])
def get_articles(db: Session = Depends(get_db)):
    articles = db.query(Article).all()
    results = []

    for article in articles:
        summary = db.query(Summary).filter(Summary.article_id == article.id).first()
        results.append(ArticleOut(
            id=article.id,
            title=article.title,
            content=article.content,
            image_url=article.image_url,
            url=article.url,
            posted_date=article.posted_date or article.created_at,
            summary=summary.text if summary else None
        ))

    return results
