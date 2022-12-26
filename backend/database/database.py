from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import config
from fastapi.security import HTTPBasic


engine = create_engine(config.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
security = HTTPBasic()


async def get_database_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
