from flask import Flask, send_file
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import io
import matplotlib.font_manager as fm

app = Flask(__name__)

# CSV 파일 경로
CSV_FILE = "employment_data.csv"

# 한글 폰트 설정 함수
def set_korean_font():
    # 시스템에 설치된 한글 폰트를 설정합니다.
    font_path = "C:/Windows/Fonts/malgun.ttf"  # Windows의 경우 '맑은 고딕' 경로
    font_prop = fm.FontProperties(fname=font_path)
    plt.rcParams["font.family"] = font_prop.get_name()

# 그래프 생성 함수
def create_graph():
    # CSV 데이터 읽기
    data = pd.read_csv(CSV_FILE)

    # 데이터 미리보기 (디버깅용)
    print(data.head())

    # 남자와 여자 졸업자 수를 합산하여 '취업자수' 열 생성
    data["취업자수"] = data["남자졸업자수(A)(명)"] + data["여자졸업자수(A)(명)"]

    # 학과별 연도별 데이터 피벗 테이블 생성
    pivot_data = pd.pivot_table(
        data,
        values="취업자수",
        index="기준년도",
        columns="학과명(전공)",
        aggfunc="sum",
        fill_value=0,  # 데이터가 없는 곳은 0으로 채움
    )

    # 한글 폰트 설정
    set_korean_font()

    # 그래프 그리기
    plt.figure(figsize=(14, 8))  # 그래프 크기 설정
    x_indexes = np.arange(len(pivot_data.index))  # 연도별 x축 인덱스 생성
    width = 0.15  # 막대 폭 설정

    # 학과별 막대그래프 생성
    for i, department in enumerate(pivot_data.columns):
        plt.bar(
            x_indexes + i * width,  # 막대가 옆으로 나열되도록 위치 조정
            pivot_data[department],  # 학과별 취업자 수 데이터
            width=width,  # 막대 폭
            label=department,  # 학과명
        )

    # 그래프 꾸미기
    plt.title("학과별 연도별 취업 현황", fontsize=16)
    plt.xlabel("기준년도", fontsize=12)
    plt.ylabel("취업자수", fontsize=12)
    plt.xticks(
        ticks=x_indexes + width * (len(pivot_data.columns) - 1) / 2,  # x축 중앙 정렬
        labels=pivot_data.index,  # 연도 라벨 표시
        fontsize=10,
    )
    plt.yticks(fontsize=10)
    plt.legend(title="학과명", fontsize=10, loc="upper left", bbox_to_anchor=(1.05, 1))  # 범례 추가
    plt.grid(axis="y", linestyle="--", alpha=0.7)
    plt.tight_layout()

    # 그래프를 메모리에 저장
    img = io.BytesIO()
    plt.savefig(img, format="png")
    img.seek(0)
    plt.close()
    return img

# API 엔드포인트: 그래프 생성
@app.route("/graph", methods=["GET"])
def graph():
    try:
        img = create_graph()
        return send_file(img, mimetype="image/png")
    except Exception as e:
        print(f"그래프 생성 중 오류 발생: {e}")
        return "그래프 생성 중 오류가 발생했습니다.", 500

# 기본 페이지 확인
@app.route("/")
def home():
    return "Flask 서버가 실행 중입니다. /graph에서 그래프 확인 가능합니다."

if __name__ == "__main__":
    app.run(debug=True)
