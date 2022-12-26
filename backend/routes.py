import datetime
import uuid
from fastapi import Form, Request, Response, Depends, HTTPException, APIRouter, Body
from fastapi.encoders import jsonable_encoder
from starlette.exceptions import HTTPException as StarletteHTTPException
from schemas import StartGameSettings, ChangePlayerScore
from sqlalchemy.orm import Session
from fastapi import Depends
from fastapi.responses import HTMLResponse, JSONResponse
from database.database import get_database_session
from database.models import Questions, Games
import random
from fastapi.templating import Jinja2Templates


templates = Jinja2Templates(directory="templates")
router = APIRouter()


@router.post("/api/create_game")
async def create_game(player_1_name: str = Form(), player_2_name: str = Form(), questions_count: int = Form(),
                      difficulty: int = Form(), db: Session = Depends(get_database_session)):
    game_uuid = uuid.uuid4()
    new_game = Games(uuid=game_uuid, player_1_name=player_1_name, player_1_score=0,
                     player_2_name=player_2_name, player_2_score=0,
                     questions_count=questions_count, difficulty=difficulty, current_question=None,
                     questions_past="", created_at=datetime.datetime.utcnow(), is_finished=False)
    db.add(new_game)
    db.commit()
    db.refresh(new_game)
    return {"uuid": game_uuid}


@router.get("/api/get_game")
async def get_game(uuid: str, db: Session = Depends(get_database_session)):
    return db.query(Games).filter_by(uuid=uuid).one_or_none()


@router.get("/api/get_question")
async def get_question(difficulty: int, exclude: str = "", db: Session = Depends(get_database_session)):
    exclude = exclude.strip().split(" ")
    validated_exclude = []
    for e in exclude:
        try:
            validated_exclude.append(int(e))
        except Exception:
            pass
    print(f"Exclude: {validated_exclude}")
    questions = db.query(Questions).filter_by(difficulty=difficulty).filter(Questions.id.not_in(validated_exclude)).all()
    return random.choice(questions)


@router.post("/api/change_player_score")
async def change_player_score(request: Request, db: Session = Depends(get_database_session)):

    request_body = await request.body()
    reqeust_body_list = request_body.decode('utf8').split('&')

    uuid = reqeust_body_list[0].split('=')[1]
    player = int(reqeust_body_list[1].split('=')[1])
    scores_to_add = int(reqeust_body_list[2].split('=')[1])
    print(f"uuid: {uuid}, player: {player}, scores_to_add: {scores_to_add}")

    game = db.query(Games).filter_by(uuid=uuid).one_or_none()
    if not game:
        return {"Error": f"game with {uuid} not found"}
    else:
        if scores_to_add not in [-1, 0, 1]:
            return {"Error": f"scores_to_add value should be -1, 0 or 1"}

        if player == 1:
            game.player_1_score += scores_to_add
            db.commit()
        elif player == 2:
            game.player_2_score += scores_to_add
            db.commit()
        else:
            return {"Error": f"player value should be 1 or 2"}

        print("ОЧКИ ИЗМЕНЕНЫ:")
        print(game)

        return db.query(Games).filter_by(uuid=uuid).one_or_none()


@router.get("/")
async def show_create_game_form(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@router.get("/rules")
async def get_rules(request: Request):
    return templates.TemplateResponse("rules.html", {"request": request})


@router.get("/authors")
async def get_authors(request: Request):
    return templates.TemplateResponse("authors.html", {"request": request})


@router.get("/{uuid}")
async def get_game_template(request: Request, uuid: str, db: Session = Depends(get_database_session)):
    game = db.query(Games).filter_by(uuid=uuid).one_or_none()
    if not game:
        return templates.TemplateResponse("error.html", {"request": request, "error": f"Игра не найдена :("})
    context = {
        "request": request,
        "player_1_name": game.player_1_name,
        "player_1_score": game.player_1_score,
        "player_2_name": game.player_2_name,
        "player_2_score": game.player_2_score,
        "questions_count": game.questions_count,
        "difficulty": game.difficulty,
        "current_question": game.current_question,
        "questions_past": game.questions_past,
        "created_at": game.created_at,
        "is_finished": game.is_finished,
    }

    print(context)
    if len(game.questions_past.split(' ')) > game.questions_count:
        winner = None
        if game.player_1_score > game.player_2_score:
            winner = game.player_1_name
        elif game.player_1_score < game.player_2_score:
            winner = game.player_2_name
        context['winner'] = winner
        return templates.TemplateResponse("game_end.html", context=context)
    else:
        return templates.TemplateResponse("game.html", context=context)


@router.get("/api/get_next_question_for_game")
async def get_next_question_for_game(uuid: str, db: Session = Depends(get_database_session)):
    """Функция по указанному uuid находит игру, получает из базы новый вопрос с нужной сложностью,
    меняет у игры текущий вопрос и прошлые вопросы и возвращает json полученного нового вопроса."""
    game = db.query(Games).filter_by(uuid=uuid).one_or_none()

    if not game:
        return {"Error": f"game with {uuid} not found"}

    exclude = game.questions_past.strip().split(" ")
    validated_exclude = []
    for e in exclude:
        try:
            validated_exclude.append(int(e))
        except Exception:
            pass

    questions = db.query(Questions).filter_by(difficulty=game.difficulty).\
        filter(Questions.id.not_in(validated_exclude)).all()
    random_question = random.choice(questions)

    cur_questions_past = []

    if not game.current_question:
        game.current_question = random_question.id
    else:
        game.questions_past += f" {game.current_question}"
        game.current_question = random_question.id
    db.commit()

    result = {"id": random_question.id, "question": random_question.question,
              "right_answer": random_question.right_answer, "answer_2": random_question.answer_2,
              "answer_3": random_question.answer_3, "answer_4": random_question.answer_4,
              "difficulty": random_question.difficulty, "questions_past": game.questions_past,
              'questions_count': game.questions_count}
    return result


async def not_found(request: Request, exc: StarletteHTTPException):
    return templates.TemplateResponse("error.html", {"request": request,
                                      "error": "Страница не найдена :("}, status_code=exc.status_code)


async def method_not_allowed(request: Request, exc: StarletteHTTPException):
    return templates.TemplateResponse("error.html", {"request": request,
                                      "error": "Недопустимый метод :("}, status_code=exc.status_code)


async def internal_server_error(request: Request, exc: StarletteHTTPException):
    return templates.TemplateResponse("error.html", {"request": request,
                                      "error": "Внутренняя ошибка сервера. Пожалуйста, попробуйте позже :("},
                                      status_code=exc.status_code)


custom_exception_handlers = {
    404: not_found,
    405: method_not_allowed,
    500: internal_server_error,
}

