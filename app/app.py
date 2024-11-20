import matplotlib
matplotlib.use('Agg')  # GUI 모드 비활성화

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
    font_path = "C:/Windows/Fonts/malgun.ttf"  
    font_prop = fm.FontProperties(fname=font_path)
    plt.rcParams["font.family"] = font_prop.get_name()

# 막대 그래프 생성 함수
def create_graph():
    data = pd.read_csv(CSV_FILE)

    # 남자와 여자 졸업자 수를 합산하여 '취업자수' 열 생성
    data["취업자수"] = data["남자졸업자수(A)(명)"] + data["여자졸업자수(A)(명)"]

    # 학과별 연도별 데이터 피벗 테이블 생성
    pivot_data = pd.pivot_table(
        data,
        values="취업자수",
        index="기준년도",
        columns="학과명(전공)",
        aggfunc="sum",
        fill_value=0,
    )

    set_korean_font()

    # 그래프 그리기
    plt.figure(figsize=(10, 6))  # 그래프 크기 조정
    x_indexes = np.arange(len(pivot_data.index))
    width = 0.15

    for i, department in enumerate(pivot_data.columns):
        plt.bar(
            x_indexes + i * width,
            pivot_data[department],
            width=width,
            label=department,
        )

    plt.title("학과별 연도별 취업 현황", fontsize=16)
    plt.xlabel("기준년도", fontsize=12)
    plt.ylabel("취업자수", fontsize=12)
    plt.xticks(
        ticks=x_indexes + width * (len(pivot_data.columns) - 1) / 2,
        labels=pivot_data.index,
        fontsize=10,
    )
    plt.yticks(fontsize=10)
    plt.legend(title="학과명", fontsize=10, loc="upper left", bbox_to_anchor=(1.05, 1))
    plt.grid(axis="y", linestyle="--", alpha=0.7)
    plt.tight_layout()

    img = io.BytesIO()
    plt.savefig(img, format="png", dpi=100)
    img.seek(0)
    plt.close()
    return img

# 막대 그래프 이미지 반환 엔드포인트
@app.route("/graph", methods=["GET"])
def graph():
    try:
        img = create_graph()
        return send_file(img, mimetype="image/png")
    except Exception as e:
        print(f"막대 그래프 생성 중 오류 발생: {e}")
        return "막대 그래프 생성 중 오류가 발생했습니다.", 500

# 기본 페이지
@app.route("/")
def home():
    return "Flask 서버가 실행 중입니다. /graph에서 막대 그래프 확인 가능합니다."

if __name__ == "__main__":
    app.run(debug=True)
