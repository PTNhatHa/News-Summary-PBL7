# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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
# Cho phép tất cả origin (không nên dùng trong production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # hoặc ["*"] để cho tất cả
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(articles.router, prefix="/api")