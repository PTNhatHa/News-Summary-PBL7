# app/api/feedbacks.py
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.models import models
from app.database import get_db

router = APIRouter(prefix="/feedbacks", tags=["Feedback"])

@router.post("/like/{summary_id}")
def like_summary(summary_id: int, db: Session = Depends(get_db)):
    feedback = db.query(models.Feedback).filter(models.Feedback.summary_id == summary_id).first()

    if feedback:
        feedback.like = True
        feedback.dislike = False
    else:
        feedback = models.Feedback(summary_id=summary_id, like=True, dislike=False)
        db.add(feedback)

    db.commit()
    db.refresh(feedback)
    return {"message": "Liked", "feedback_id": feedback.id}

@router.post("/dislike/{summary_id}")
def dislike_summary(summary_id: int, db: Session = Depends(get_db)):
    feedback = db.query(models.Feedback).filter(models.Feedback.summary_id == summary_id).first()

    if feedback:
        feedback.like = False
        feedback.dislike = True
    else:
        feedback = models.Feedback(summary_id=summary_id, like=False, dislike=True)
        db.add(feedback)

    db.commit()
    db.refresh(feedback)
    return {"message": "Disliked", "feedback_id": feedback.id}

@router.get("/count/{summary_id}")
def get_feedback_count(summary_id: int, db: Session = Depends(get_db)):
    likes = db.query(models.Feedback).filter(
        models.Feedback.summary_id == summary_id,
        models.Feedback.like == True
    ).count()

    dislikes = db.query(models.Feedback).filter(
        models.Feedback.summary_id == summary_id,
        models.Feedback.dislike == True
    ).count()

    return {
        "summary_id": summary_id,
        "likes": likes,
        "dislikes": dislikes
    }
