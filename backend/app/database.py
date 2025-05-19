# app/database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv
from urllib.parse import quote_plus
from pathlib import Path

# Load biến môi trường từ .env
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

# MYSQL_USER = os.getenv("MYSQL_USER", "root")
# MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "")
# MYSQL_HOST = os.getenv("MYSQL_HOST", "127.0.0.1")
# MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
# MYSQL_DB = os.getenv("MYSQL_DB", "news_summarizer")

# # Chuỗi kết nối
# if MYSQL_PASSWORD:
#     DATABASE_URL = f"mysql+pymysql://{MYSQL_USER}:{quote_plus(MYSQL_PASSWORD)}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
# else:
#     DATABASE_URL = f"mysql+pymysql://{MYSQL_USER}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"

DATABASE_URL = "postgresql://postgres:IvIJyAtnqkbrVoYTJsauWEOYlWceNTZO@interchange.proxy.rlwy.net:29037/railway"

# SQLAlchemy engine và session
engine = create_engine(DATABASE_URL, 
                       echo=True,
                       pool_pre_ping=True, # kiểm tra kết nối trước mỗi query
                        pool_recycle=1800, # tái tạo kết nối sau 30 phút
                        pool_timeout=30, # thời gian chờ kết nối tối đa là 30s
                       )
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Hàm lấy session cho mỗi request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Debug
print("== DATABASE CONFIG ==")
# print("User:", MYSQL_USER)
# print("Password:", repr(MYSQL_PASSWORD))
# print("Host:", MYSQL_HOST)
# print("Port:", MYSQL_PORT)
# print("DB:", MYSQL_DB)
print("Connection URL:", DATABASE_URL)
