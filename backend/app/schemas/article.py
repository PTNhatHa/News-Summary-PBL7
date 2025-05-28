# app/schemas/article.py

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime 

class ArticleBase(BaseModel):
    title: str
    image_url: Optional[str]
    url: str
    posted_date: datetime
    category: str
    source: str

class ArticleCreate(ArticleBase):
    pass

class ArticleOut(ArticleBase):
    id: int
    summary: Optional[str]  # Thêm dòng này
    class Config:
        orm_mode = True

class ArticleListResponse(BaseModel):
    total_article: int
    articles: List[ArticleOut]