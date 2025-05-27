# app/api/articles.py

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import cast, Date, distinct
from app.database import get_db
from app.models.models import Article, Summary
from app.schemas.article import ArticleOut, ArticleListResponse
from typing import List, Optional
from datetime import datetime

router = APIRouter()

@router.get("/articles", response_model=ArticleListResponse)
def get_articles(
    skip: int = Query(0, ge=0, description="Số lượng bản ghi cần bỏ qua"),
    limit: int = Query(10, ge=1, le=100, description="Số lượng bản ghi muốn lấy (tối đa 100)"),
    date: datetime = Query(..., description="Ngày đăng bài (bắt buộc, định dạng YYYY-MM-DD)"),
    source: Optional[str] = Query(None, description="Nguồn bài báo"),
    category: Optional[str] = Query(None, description="Chuyên mục"),
    db: Session = Depends(get_db)
):
    query = db.query(Article).filter(cast(Article.posted_date, Date) == date.date())

    if source:
        query = query.filter(Article.source == source)
    if category:
        query = query.filter(Article.category == category)

    total_article = query.count()

    articles = query.order_by(Article.posted_date.desc()).offset(skip).limit(limit).all()

    article_ids = [a.id for a in articles]
    summaries = db.query(Summary).filter(Summary.article_id.in_(article_ids)).all()
    summary_map = {s.article_id: s.text for s in summaries}

    results = [
        ArticleOut(
            id=article.id,
            title=article.title,
            image_url=article.image_url,
            url=article.url,
            posted_date=article.posted_date,
            category=article.category,
            source=article.source,
            summary=summary_map.get(article.id)
        )
        for article in articles
    ]

    return ArticleListResponse(total_article=total_article, articles=results)


@router.get("/categories", response_model=List[str])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(distinct(Article.category)).all()
    return [c[0] for c in categories if c[0]]  # loại bỏ None nếu có