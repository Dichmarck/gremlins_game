FROM python:3.10

COPY ./backend/requirements.txt /backend/requirements.txt

RUN apt update -y && pip install --no-cache-dir --upgrade -r /backend/requirements.txt

COPY ./backend /backend

WORKDIR backend

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]