from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from typing import List
from app.database import get_db
from sqlalchemy.orm import Session
from app.models.models import Article, Summary
from app.schemas.article import ArticleListResponse, ArticleOut
from app.schemas.retriever import RetrieveRequest  
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.models import Filter, SearchRequest, PointStruct
import os

router = APIRouter(prefix="/articles", tags=["Article"])

# Load model and Qdrant config
embedding_model = SentenceTransformer("AITeamVN/Vietnamese_Embedding")
QDRANT_URL = "https://346599ba-1a5c-45c3-bf21-62d89d1aeb19.us-east4-0.gcp.cloud.qdrant.io"
QDRANT_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.RDy0m-Cd4KS1bcg1TiCaLdeEtIT7bO7q_w7nNfZb97U"
COLLECTION_NAME = "rag_embeddings"
client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)


@router.post("/retrieve", response_model=ArticleListResponse)
def retrieve_documents(
    request: RetrieveRequest,
    start_date: Optional[datetime] = Query(None, description="Ngày bắt đầu (YYYY-MM-DD)"),
    end_date: Optional[datetime] = Query(None, description="Ngày kết thúc (YYYY-MM-DD)"),
    db: Session = Depends(get_db)
):
    query_vector = embedding_model.encode(request.query).tolist()

    hits = client.search(
        collection_name=COLLECTION_NAME,
        query_vector=query_vector,
        limit=100,
        with_payload=True
    )

    doc_scores = {}
    for hit in hits:
        doc_id = hit.payload.get("doc_id")
        if doc_id:
            if doc_id not in doc_scores or hit.score > doc_scores[doc_id]:
                doc_scores[doc_id] = hit.score

    query = db.query(Article).filter(Article.id.in_(doc_scores.keys()))
    if start_date:
        query = query.filter(Article.posted_date >= start_date)
    if end_date:
        query = query.filter(Article.posted_date <= end_date)

    filtered_articles = query.all()

    filtered_articles.sort(key=lambda a: doc_scores.get(a.id, 0), reverse=True)
    top_articles = filtered_articles[:10]

    summaries = db.query(Summary).filter(Summary.article_id.in_([a.id for a in top_articles])).all()
    summary_map = {s.article_id: (s.id, s.text) for s in summaries}

    results = [
        ArticleOut(
            article_id=a.id,
            title=a.title,
            image_url=a.image_url,
            url=a.url,
            posted_date=a.posted_date,
            category=a.category,
            source=a.source,
            summary_id=summary_map.get(a.id)[0] if summary_map.get(a.id) else None,
            summary=summary_map.get(a.id)[1] if summary_map.get(a.id) else None
        )
        for a in top_articles
    ]

    return ArticleListResponse(
        total_article=len(results),
        articles=results
    )

