# app/schemas/article.py

from pydantic import BaseModel
from typing import Optional
from datetime import datetime 

class ArticleBase(BaseModel):
    title: str
    image_url: Optional[str]
    url: str
    posted_date: datetime

class ArticleCreate(ArticleBase):
    pass

class ArticleOut(ArticleBase):
    id: int
    summary: Optional[str]  # Thêm dòng này
    class Config:
        orm_mode = True
