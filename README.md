# News-Summary-PBL7
## FE

### Cài đặt các thư viện cần thiết:

```sh
npm install
```

### Chạy dự án

```sh
npm start
```

## BE

### Tạo .venv

```sh
python -m venv .venv 
.venv\Scripts\activate  
```

### Cài thư viện

```sh
pip install fastapi uvicorn sqlalchemy pymysql alembic pydantic python-dotenv  
pip install requests beautifulsoup4 selenium webdriver-manager torch transformers numpy feedparser gdown time  
```

### Chạy BE

```sh
cd .\backend\    
uvicorn app.main:app --reload  
```

### FastAPI

```sh
http://127.0.0.1:8000/docs# 
```

### Migration

```sh
alembic revision --autogenerate -m "tên commit, vd: add posted_date to articles"
alembic upgrade head
```

### Chạy test pipeline

```sh
python app/run_pipeline.py  
```
