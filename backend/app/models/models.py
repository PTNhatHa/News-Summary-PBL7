# app/models/models.py
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Article(Base):
    __tablename__ = 'articles'
    id = Column(Integer, primary_key=True)
    title = Column(String(512))
    image_url = Column(String(512))
    url = Column(String(512), unique=True)
    posted_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.now)
    category = Column(String(512))  # Ví dụ: 'Thời sự', 'Kinh tế'
    source = Column(String(512))    # Ví dụ: 'VNExpress', 'Tuổi Trẻ'
    summary = relationship("Summary", back_populates="article", uselist=False)

class Summary(Base):
    __tablename__ = 'summaries'
    id = Column(Integer, primary_key=True)
    article_id = Column(Integer, ForeignKey('articles.id'))
    text = Column(Text)
    created_at = Column(DateTime, default=datetime.now)
    article = relationship("Article", back_populates="summary")
    feedbacks = relationship("Feedback", back_populates="summary")

class Feedback(Base):
    __tablename__ = 'feedbacks'
    id = Column(Integer, primary_key=True)
    summary_id = Column(Integer, ForeignKey('summaries.id'))
    like = Column(Boolean, default=False)
    dislike = Column(Boolean, default=False)
    summary = relationship("Summary", back_populates="feedbacks")

class CrawlLog(Base):
    __tablename__ = "crawl_log"
    source = Column(String, primary_key=True)
    last_crawled = Column(DateTime, default=datetime.now)