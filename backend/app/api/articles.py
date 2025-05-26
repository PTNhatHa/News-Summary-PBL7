# app/api/articles.py

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Article, Summary
from app.schemas.article import ArticleOut
from typing import List
from datetime import datetime

router = APIRouter()

@router.get("/articles", response_model=List[ArticleOut])
def get_articles(
    skip: int = Query(0, ge=0, description="Số lượng bản ghi cần bỏ qua"),
    limit: int = Query(10, ge=1, le=100, description="Số lượng bản ghi muốn lấy (tối đa 100)"),
    db: Session = Depends(get_db)
):
    articles = db.query(Article).order_by(Article.posted_date.desc()).offset(skip).limit(limit).all()
    
    results = []
    article_ids = [a.id for a in articles]
    
    # Lấy toàn bộ summaries liên quan trong 1 query duy nhất
    summaries = db.query(Summary).filter(Summary.article_id.in_(article_ids)).all()
    summary_map = {s.article_id: s.text for s in summaries}
    
    for article in articles:
        results.append(ArticleOut(
            id=article.id,
            title=article.title,
            image_url=article.image_url,
            url=article.url,
            posted_date=article.posted_date,
            category=article.category,
            source=article.source,
            summary=summary_map.get(article.id)
        ))

    return results
