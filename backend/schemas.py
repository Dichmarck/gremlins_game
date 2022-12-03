from pydantic import BaseModel


class StartGameSettings(BaseModel):
    uuid: int
    player_1_name: str = "Player 1"
    player_2_name: str = "Player 2"
    questions_count: int
    difficulty: int

    class Config:
        orm_mode = True
