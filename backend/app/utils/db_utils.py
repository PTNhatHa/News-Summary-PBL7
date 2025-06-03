from models import models
from sqlalchemy.orm import Session
from datetime import datetime

def get_last_crawl_date(db: Session, source: str):
    log = db.query(models.CrawlLog).filter_by(source=source).first()
    
    if log and log.last_crawled:
        return log.last_crawled

    return datetime.fromisoformat("2025-05-28T15:00:00.975380")

def update_last_crawl_date(db: Session, source: str):
    log = db.query(models.CrawlLog).filter_by(source=source).first()
    if log:
        log.last_crawled = datetime.now()
    else:
        log = models.CrawlLog(source=source, last_crawled=datetime.now())
        db.add(log)
    db.commit()
