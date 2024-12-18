let competitionSchedule = []; 

document.addEventListener("DOMContentLoaded", async () => {
    const date = new Date();
    let currYear = date.getFullYear();
    let currMonth = date.getMonth();

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentDate = document.querySelector('.current-date');
    const calendarBody = document.getElementById('calendar-body');
    const prevNextIcons = document.querySelectorAll('.nav .material-icons');

    // 공모전 일정 데이터 가져오기
    competitionSchedule = await fetchCompetitionSchedule(currYear, currMonth); 
    
    const renderCalendar = () => {
        currentDate.innerHTML = `${months[currMonth]} ${currYear}`;
    
        let firstDayofMonth = new Date(currYear, currMonth, 1).getDay();
        let lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate();
        let lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay();
        let lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();
    
        let tableRows = "";
        let row = "<tr>";
    
        // 이전 달의 날짜 추가
        for (let i = firstDayofMonth; i > 0; i--) {
            row += `<td class="inactive">${lastDateofLastMonth - i + 1}</td>`;
        }
    
        // 현재 달의 날짜 추가
        for (let i = 1; i <= lastDateofMonth; i++) {
            const isToday = 
                i === date.getDate() &&
                currMonth === new Date().getMonth() &&
                currYear === new Date().getFullYear() 
                ? 'today' 
                : '';

            const isCompetitionDay = !isToday && competitionSchedule.some(event => {
                const startDate = new Date(event.sdate);
                const endDate = new Date(event.edate);

                return (
                    (startDate.getFullYear() === currYear && startDate.getMonth() === currMonth && startDate.getDate() === i) ||
                    (endDate && endDate.getFullYear() === currYear && endDate.getMonth() === currMonth && endDate.getDate() === i)
                );
            });

            const cellClass = isToday ? 'today' : isCompetitionDay ? 'highlight' : '';

            row += `<td class="${cellClass}" onclick="showPopup(${i}, ${currMonth}, ${currYear})" style="cursor: pointer;">${i}</td>`;

            if ((i + firstDayofMonth) % 7 === 0) { // 일주일이 끝날 때마다 줄 바꿈
                tableRows += row + "</tr>";
                row = "<tr>";
            }
        }

        // 다음 달의 날짜 추가
        for (let i = lastDayofMonth + 1; i <= 6; i++) {
            row += `<td class="inactive">${i - lastDayofMonth}</td>`;
        }
        tableRows += row + "</tr>";
    
        calendarBody.innerHTML = tableRows;
    
        // 현재 달에 해당하는 공모전 일정 표시
        displayContestSchedule();
    };
    

    // 이전/다음 버튼 클릭 이벤트
    prevNextIcons.forEach((icon) => {
        icon.addEventListener("click", () => {
            currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

            if (currMonth < 0) {
                currMonth = 11;
                currYear--;
            }
            if (currMonth > 11) {
                currMonth = 0;
                currYear++;
            }

            renderCalendar();
        });
    });

    renderCalendar();
});

// 공모전 일정 데이터 가져오기
async function fetchCompetitionSchedule(year, month) {
    try {
        const response = await fetch(`/api/contests?year=${year}&month=${month + 1}`);
        if (!response.ok) throw new Error("Failed to load competition data");

        const data = await response.json();

        return data.map(event => {
            const periodParts = event.period ? event.period.split('~').map(date => date.trim()) : [];
            const sdate = periodParts[0] || null;
            const edate = periodParts[1] || null;

            return {
                title: event.title,
                organizer: event.organizer,
                sdate,
                edate,
                category: event.category,
                days_left: calculateDdayAndColor(sdate, edate).dDayText
            };
        });
    } catch (error) {
        console.error("공모전 일정을 가져오는 데 실패했습니다:", error);
        return [];
    }
}

// D-DAY 계산 함수
function calculateDdayAndColor(startDate, endDate) {
    const today = new Date();
    const targetDate = new Date(endDate || startDate);

    if (isNaN(targetDate.getTime())) return { dDayText: 'Invalid Date', dDayColor: 'gray' };

    const diffTime = targetDate - today;
    const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (remainingDays > 0) {
        return { dDayText: `D-${remainingDays}`, dDayColor: 'red' };
    } else if (remainingDays === 0) {
        return { dDayText: 'D-DAY', dDayColor: '#1F4E9C' };
    } else {
        return { dDayText: '마감 완료', dDayColor: 'black' };
    }
}

// 팝업 창
function showPopup(day, month, year) {
    const event = competitionSchedule.find(event => {
        const startDate = new Date(event.sdate);
        const endDate = new Date(event.edate);

        return (
            (startDate.getFullYear() === year && startDate.getMonth() === month && startDate.getDate() === day) ||
            (endDate && endDate.getFullYear() === year && endDate.getMonth() === month && endDate.getDate() === day)
        );
    });

    if (event) {
        const { dDayText, dDayColor } = calculateDdayAndColor(event.sdate, event.edate);

        const popup = document.getElementById('popup');
        const popupTitle = document.getElementById('popup-title');
        const popupDetails = document.getElementById('popup-details');

        popupTitle.textContent = event.title;
        popupDetails.innerHTML = `
            <p><strong>주최:</strong> ${event.organizer}</p>
            <p><strong>접수 기간:</strong> ${event.sdate} - ${event.edate || 'N/A'}</p>
            <p><strong>D-DAY:</strong> <span style="color: ${dDayColor}; font-weight: bold;">${dDayText}</span></p>
        `;

        popup.style.display = 'block';

        const closeButton = popup.querySelector('.close-btn');
        closeButton.addEventListener('click', () => {
            popup.style.display = 'none';
        });
    }
}

// 키워드 기반 카테고리 분류 함수
function classifyCategory(title) {
    const categories = {
        "AI": ["AI", "인공지능", "머신러닝", "딥러닝", "NLP", "컴퓨터 비전"],
        "빅데이터": ["빅데이터", "데이터 분석", "데이터 과학", "데이터 시각화"],
        "소프트웨어": ["소프트웨어", "프로그래밍", "코딩", "알고리즘"],
        "게임": ["게임", "VR", "AR"],
        "앱": ["앱", "모바일", "iOS"],
        "보안": ["보안", "해킹", "암호학"],
    };

    for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => title.includes(keyword))) {
            return category;
        }
    }
    return "기타"; // 기본 카테고리
}

// 공모전 일정 테이블 표시
function displayContestSchedule() {
    const contestTable = document.getElementById("contestTable").querySelector("tbody");
    contestTable.innerHTML = "";

    competitionSchedule.forEach(event => {
        const category = classifyCategory(event.title);
        const { dDayText } = calculateDdayAndColor(event.sdate, event.edate);

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${category}</td>
            <td>${event.title}</td>
            <td>${event.organizer}</td>
            <td>${event.sdate && event.edate ? `${event.sdate} ~ ${event.edate}` : '기간 정보 없음'}</td>
            <td>${dDayText}</td>
        `;
        contestTable.appendChild(row);
    });
}