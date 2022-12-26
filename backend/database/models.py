import datetime

from sqlalchemy.schema import Column
from sqlalchemy.types import String, Integer, Boolean, SmallInteger, DateTime
from hashlib import sha256
from sqlalchemy.orm import Session
from .database import Base
from fastapi import Depends


class Questions(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True)
    question = Column(String(255))
    right_answer = Column(String(255))
    answer_2 = Column(String(255))
    answer_3 = Column(String(255))
    answer_4 = Column(String(255))
    difficulty = Column(SmallInteger)


class Games(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True)
    uuid = Column(String(36))
    player_1_name = Column(String(20))
    player_1_score = Column(SmallInteger)
    player_2_name = Column(String(20))
    player_2_score = Column(SmallInteger)
    questions_count = Column(SmallInteger)
    difficulty = Column(SmallInteger)
    current_question = Column(SmallInteger)
    questions_past = Column(String(255), default="")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    is_finished = Column(Boolean, default=False)
