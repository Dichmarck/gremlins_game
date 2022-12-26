import psycopg2
from psycopg2 import sql
import requests
import config
import random




try:
    connection = psycopg2.connect(dbname='gremlins', user='postgres',
                               password='dan4ik', host='localhost')
    cursor = connection.cursor()

    for difficulty in range(3, 4):
        params = {"qType": difficulty, "apikey": config.API_KEY, "count": 1}

        for i in range(50):
            outer_api_response = requests.get(url=config.OUTER_API_URL, params=params).json()['data'][0]

            question = outer_api_response['question'].replace("\u2063", "")
            right_answer = outer_api_response['answers'][0].replace("\u2063", "")
            answer_2 = outer_api_response['answers'][1].replace("\u2063", "")
            answer_3 = outer_api_response['answers'][2].replace("\u2063", "")
            answer_4 = outer_api_response['answers'][3].replace("\u2063", "")

            try:
                insert_query = f"INSERT INTO questions (question, right_answer, answer_2, answer_3, answer_4, difficulty) " \
                               f"VALUES (\'{question}\', \'{right_answer}\', \'{answer_2}\', \'{answer_3}\', \'{answer_4}\', \'{difficulty}\')"
                cursor.execute(insert_query)

                print(insert_query)

                connection.commit()

            except Exception as e:
                connection.rollback()
                print(e)

        connection.commit()



except Exception as e:
    raise e
finally:
    cursor.close()
    connection.close()