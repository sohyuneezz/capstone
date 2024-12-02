import random
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
import mysql.connector
from dotenv import load_dotenv
import os
import schedule

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

# 크롬드라이버 경로
driver_path = "C:/Users/csh88/Downloads/chromedriver-win64/chromedriver.exe"

# 데이터를 저장할 리스트 생성
data = []

# 데이터 크롤링 함수
def scrape_page_data(driver):
    """현재 페이지의 공모전 데이터를 크롤링하여 리스트에 추가"""
    soup = BeautifulSoup(driver.page_source, "html.parser")
    data_list = soup.find("tbody", {"id": "dataList"})
    if data_list:
        contests = data_list.find_all("tr", class_="contentitem")
        for contest in contests:
            title = contest.find("div", class_="tit").get_text(strip=True)
            organizer = contest.find_all("td")[2].get_text(strip=True)
            days_left = contest.find_all("td")[3].get_text(strip=True)
            period = contest.find_all("td")[4].get_text(strip=True)
            status = contest.find_all("td")[5].get_text(strip=True)
            contest_id = contest.get("data-contest_pk")

            # 데이터를 리스트에 추가
            data.append({
                "title": title,
                "organizer": organizer,
                "days_left": days_left,
                "period": period,
                "status": status,
                "contest_id": contest_id
            })
    else:
        print("현재 페이지에서 데이터를 찾을 수 없습니다.")

# 데이터베이스 저장 함수
def save_to_db(data):
    """크롤링 데이터를 MySQL 데이터베이스에 저장"""
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()

    for contest in data:
        cursor.execute("""
            INSERT INTO contests (title, organizer, days_left, period, status, contest_id)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE organizer=%s, days_left=%s, period=%s, status=%s
        """, (
            contest['title'], contest['organizer'], contest['days_left'], 
            contest['period'], contest['status'], contest['contest_id'],
            contest['organizer'], contest['days_left'], contest['period'], contest['status']
        ))

    connection.commit()
    cursor.close()
    connection.close()

# 페이지 크롤링 함수
def crawl_and_update():
    """크롤링을 실행하고 데이터를 DB에 저장"""
    global data
    data = [] 

    # 웹드라이버 시작
    service = Service(driver_path)
    driver = webdriver.Chrome(service=service)

    try:
        # 메인 페이지 로드
        url = "https://www.thinkcontest.com/thinkgood/user/contest/index.do"
        driver.get(url)
        time.sleep(5)  # 페이지 로드 대기

        # 게임/소프트웨어 메뉴 버튼 클릭
        game_software_link = driver.find_element(By.XPATH, "//a[@data-value='CCFD002']")
        game_software_link.click()
        time.sleep(3)

        # 대학생 메뉴 버튼 클릭
        college_student_link = driver.find_element(By.XPATH, "//a[@data-value='PCQF006']")
        college_student_link.click()
        time.sleep(3)

        # 페이지 크롤링
        for page in range(1, 11):  # 최대 10페이지 크롤링
            try:
                print(f"{page} 페이지 크롤링 중...")
                scrape_page_data(driver)
                if page < 10:
                    driver.execute_script(f"goListPage('B0AqDFAht_4T6_77U_bLrLYkP_SD9axCznqEc3_WaX4', {page + 1});")
                    time.sleep(random.uniform(2, 4))  # 페이지 로드 대기
            except Exception as e:
                print(f"{page} 페이지에서 오류 발생:", e)
                break

    finally:
        driver.quit()

    # 데이터베이스 저장
    save_to_db(data)
    print("데이터베이스에 저장 완료.")

# 스케줄 설정
schedule.every().day.at("02:00").do(crawl_and_update)  # 매일 오전 2시에 실행

print("스케줄러 실행 중...")
while True:
    schedule.run_pending()
    time.sleep(1)
