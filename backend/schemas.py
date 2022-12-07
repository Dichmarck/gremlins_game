from pydantic import BaseModel


class StartGameSettings(BaseModel):
    player_1_name: str
    player_2_name: str
    questions_count: int
    difficulty: int

    class Config:
        orm_mode = True

class GameSettings(StartGameSettings):
    uuid: str
    questions_past: str

