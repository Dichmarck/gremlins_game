import uvicorn
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from routes import router


app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(router)


if __name__ == "__main__":
    # uvicorn main:app --port 80 --reload
    uvicorn.run(app, host="0.0.0.0", port=80)
