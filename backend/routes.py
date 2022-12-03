from fastapi import APIRouter
from schemas import StartGameSettings
import requests
import config
import random
import json


router = APIRouter()

@router.post("/api/new_game")
async def launch_new_game(game_settings: StartGameSettings):
    return game_settings


@router.get("/api/get_question")
async def get_question(difficulty: int):
    params = {"qType": difficulty, "count": 1, "apikey": config.API_KEY}
    outer_api_response = requests.get(url=config.OUTER_API_URL, params=params).json()['data'][0]

    question = outer_api_response['question']
    right_answer = outer_api_response['answers'][0]
    answers = outer_api_response['answers']
    random.shuffle(answers)

    return {"question": question,
            "right_answer": right_answer,
            "answers": answers}
