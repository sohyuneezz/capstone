let competitionSchedule = []; // 전역 변수로 선언

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
    
        // 이전 달의 날짜 추가
        let row = "<tr>";
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
    
            const isCompetitionDay = competitionSchedule.some(event => {
                const startDate = new Date(event.sdate);
                const endDate = new Date(event.edate);
    
                return (
                    (startDate.getFullYear() === currYear && startDate.getMonth() === currMonth && startDate.getDate() === i) ||
                    (endDate && endDate.getFullYear() === currYear && endDate.getMonth() === currMonth && endDate.getDate() === i)
                );
            });
    
            row += `<td class="${isToday} ${isCompetitionDay ? 'highlight' : ''}" onclick="showPopup(${i}, ${currMonth}, ${currYear})" style="cursor: pointer;">${i}</td>`;
    
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
        displayContestSchedule(currYear, currMonth);
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
        // 서버의 API 엔드포인트로 요청
        const response = await fetch(`/api/contests?year=${year}&month=${month + 1}`); // 0부터 시작해서 1 더함
        if (!response.ok) {
            throw new Error('Failed to load competition data');
        }

        const data = await response.json(); 

        return data.map(event => ({
            contestName: event.title, 
            organizer: event.organizer,
            sdate: new Date(event.period.split('~')[0].trim()).toISOString().split('T')[0], // 날짜만 
            edate: new Date(event.period.split('~')[1]?.trim() || event.period.split('~')[0].trim()).toISOString().split('T')[0]
        }));
    } catch (error) {
        console.error('공모전 일정을 가져오는 데 실패했습니다:', error);
        return [];
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
        const popup = document.getElementById('popup');
        const popupTitle = document.getElementById('popup-title');
        const popupDetails = document.getElementById('popup-details');

        popupTitle.textContent = event.contestName;
        popupDetails.textContent = `${event.organizer}: ${event.sdate} - ${event.edate || 'N/A'}`;

        popup.style.display = 'block';

        // 닫기 버튼 
        document.querySelector('.close-btn').addEventListener('click', () => {
            popup.style.display = 'none';
        });
    }
}

function displayContestSchedule(currYear, currMonth) {
    const contestTable = document.getElementById('contestTable').querySelector('tbody');
    contestTable.innerHTML = ''; // 테이블 초기화

    // 현재 날짜
    const today = new Date();

    // "시작일"이 현재 달에 해당하는 일정만 필터링
    const filteredSchedule = competitionSchedule.filter(event => {
        const startDate = new Date(event.sdate);
        return startDate.getFullYear() === currYear && startDate.getMonth() === currMonth;
    });

    // 날짜 순으로 정렬 
    filteredSchedule.sort((a, b) => new Date(a.sdate) - new Date(b.sdate));

    // 필터링된 일정만 테이블에 표시
    filteredSchedule.forEach(event => {
        const startDate = new Date(event.sdate);
        const endDate = new Date(event.edate);

        // 남은 기간 계산
        const remainingDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)); // 일 단위로 계산

        // 상태 결정 및 색상 설정
        let status = '';
        let statusColor = '';
        if (remainingDays > 0) {
            if (remainingDays <= 7) {
                status = '마감 임박';
                statusColor = 'red'; // 마감 임박: 빨간색
            } else {
                status = '진행 중';
                statusColor = '#1F4E9C'; // 진행 중: 파란색
            }
        } else {
            status = '마감 완료';
            statusColor = 'black'; // 마감 완료: 검정색
        }

        // 테이블 행 생성
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${event.contestName}</td>
            <td>${event.organizer}</td>
            <td>${event.sdate} ~ ${event.edate || 'N/A'}</td>
            <td>${remainingDays > 0 ? `D-${remainingDays}` : '마감'}</td>
            <td style="color: ${statusColor}; font-weight: bold;">${status}</td>
        `;
        contestTable.appendChild(row);
    });
}

