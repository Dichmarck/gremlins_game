import os
from dotenv import load_dotenv


load_dotenv()


API_KEY = "b31c66c9f6c8aec1c2e2ebe91"
OUTER_API_URL = "https://lip2.xyz/api/millionaire.php"
POSTGRES_PASSWORD = os.environ.get("POSTGRES_PASSWORD", "dan4ik")
DATABASE_HOST = os.environ.get("DATABASE_HOST", "localhost")
DATABASE_URL = f"postgresql://postgres:{POSTGRES_PASSWORD}@{DATABASE_HOST}/gremlins"
