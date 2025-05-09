# app/main.py
from fastapi import FastAPI
from app.api import articles
from app.models import models
from app.database import engine, SessionLocal, Base
from app.utils.create_data import create_fake_data
from contextlib import asynccontextmanager
# Khởi tạo DB
models.Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    db = SessionLocal()
    try:
        create_fake_data(db)
    finally:
        db.close()

    yield

app = FastAPI(lifespan=lifespan)
app.include_router(articles.router, prefix="/api")