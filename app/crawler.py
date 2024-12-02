import requests
from bs4 import BeautifulSoup
import mysql.connector
from dotenv import load_dotenv
import os
import schedule
import time

# env 로드
load_dotenv()

# DB
db_config = {
    'host': os.getenv('DB_HOST'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PSWORD'),
    'database': os.getenv('DB_DATABASE'),
    'port': int(os.getenv('DB_PORT', 3306)) 
}

# DB 연결
def get_db_connection():
    return mysql.connector.connect(**db_config)

# 크롤링 함수
def scrape_notices():
    url = 'https://www.daejin.ac.kr/daejin/1005/subview.do?enc=Zm5jdDF8QEB8JTJGYmJzJTJGZGFlamluJTJGMTk0JTJGYXJ0Y2xMaXN0LmRvJTNG' 
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    notices = []
    rows = soup.select('table.board-table tbody tr')  # 공지사항 목록의 각 행 선택

    base_url = 'https://www.daejin.ac.kr'  # 절대 경로

    for row in rows:
        try:
            number = row.select_one('td.td-num').get_text(strip=True)  
            title_tag = row.select_one('td.td-subject a')
            title = title_tag.select_one('strong').get_text(strip=True) 
            link = base_url + title_tag['href']  # 절대 경로로 변환
            date = row.select_one('td.td-date').get_text(strip=True)  

            notices.append({
                'number': number,
                'title': title,
                'link': link,
                'date': date
            })
        except AttributeError:
            continue  # 누락된 데이터가 있는 경우 건너뜀

    return notices

# 데이터베이스 저장 함수
def save_to_db(notices):
    connection = get_db_connection()
    cursor = connection.cursor()

    for notice in notices:
        cursor.execute("""
            INSERT INTO recruitNoti (id, title, link, date)
            VALUES (%s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE title=%s, date=%s
        """, (notice['number'], notice['title'], notice['link'], notice['date'], notice['title'], notice['date']))

    connection.commit()
    cursor.close()
    connection.close()
    print("데이터 저장 완료.")

# 크롤링 및 저장 통합 함수
def crawl_and_update():
    print("크롤링 시작...")
    notices = scrape_notices()
    save_to_db(notices)
    print("크롤링 및 데이터베이스 업데이트 완료.")

# 스케줄링 설정
schedule.every().day.at("03:00").do(crawl_and_update)  # 매일 새벽 3시에 실행

if __name__ == '__main__':
    crawl_and_update()  # 초기 실행
    print("스케줄러 실행 중...")
    while True:
        schedule.run_pending()
        time.sleep(1)
