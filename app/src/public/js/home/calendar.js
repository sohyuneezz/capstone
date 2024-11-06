// public/js/calendar.js
let competitionSchedule = [];  // 공모전 일정을 저장할 전역 변수

document.addEventListener("DOMContentLoaded", async () => {
    const date = new Date();
    let currYear = date.getFullYear();
    let currMonth = date.getMonth();

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentDate = document.querySelector('.current-date');
    const daysTag = document.querySelector('.days');
    const prevNextIcons = document.querySelectorAll('.nav .material-icons');

    // 공모전 일정 데이터 가져오기
    competitionSchedule = await fetchCompetitionSchedule();

    // 달력 렌더링 함수
    const renderCalendar = () => {
        currentDate.innerHTML = `${months[currMonth]} ${currYear}`;
        
        let firstDayofMonth = new Date(currYear, currMonth, 1).getDay();
        let lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate();
        let lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay();
        let lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();

        let liTag = "";

        // 이전 달의 날짜 추가
        for (let i = firstDayofMonth; i > 0; i--) {
            liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
        }

        // 현재 달의 날짜 추가
        for (let i = 1; i <= lastDateofMonth; i++) {
            const isToday = 
                i === date.getDate() &&
                currMonth === new Date().getMonth() &&
                currYear === new Date().getFullYear() 
                ? 'active' 
                : '';

            const isCompetitionDay = competitionSchedule.some(event => {
                const startDate = new Date(event.sdate);
                const endDate = new Date(event.edate);

                return (
                    (startDate.getFullYear() === currYear && startDate.getMonth() === currMonth && startDate.getDate() === i) ||
                    (endDate && endDate.getFullYear() === currYear && endDate.getMonth() === currMonth && endDate.getDate() === i)
                );
            });

            liTag += `<li class="${isToday} ${isCompetitionDay ? 'highlight' : ''}">${i}</li>`;
        }

        // 다음 달의 날짜 추가
        for (let i = lastDayofMonth; i < 6; i++) {
            liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
        }

        daysTag.innerHTML = liTag;

        displayContestSchedule(currYear, currMonth); // 현재 달에 해당하는 공모전 일정 표시
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

// 공모전 일정을 API에서 가져오는 함수
async function fetchCompetitionSchedule(numOfRows = 10, pageNo = 1) {
    try {
        const apiUrl = `http://localhost:3000/api/contest?numOfRows=${numOfRows}&pageNo=${pageNo}`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const responseData = Array.isArray(data) ? data[0] : data;

        if (responseData.resultCode !== '09') {
            console.warn('API returned an error:', responseData.resultMsg || 'Unknown error');
            return [];
        }

        const schedules = [];
        responseData.items.forEach(item => {
            item.schedules.forEach(schedule => {
                schedules.push({
                    contestName: item.contestNm,
                    scheduleName: schedule.contestSchedule,
                    sdate: schedule.sdate,
                    edate: schedule.edate
                });
            });
        });

        return schedules;
    } catch (error) {
        console.error('Failed to fetch competition schedule:', error);
        return [];
    }
}

// 공모전 일정 데이터를 가져와서 테이블에 추가하는 함수
function displayContestSchedule(currYear, currMonth) {
    const contestTable = document.getElementById('contestTable').querySelector('tbody');
    contestTable.innerHTML = '';

    const filteredSchedule = competitionSchedule.filter(event => {
        const startDate = new Date(event.sdate);
        const endDate = event.edate ? new Date(event.edate) : null;

        return (
            (startDate.getFullYear() === currYear && startDate.getMonth() === currMonth) ||
            (endDate && endDate.getFullYear() === currYear && endDate.getMonth() === currMonth)
        );
    });

    filteredSchedule.forEach(event => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${event.contestName}</td>
            <td>${event.sdate}</td>
            <td>${event.edate || 'N/A'}</td>
        `;
        contestTable.appendChild(row);
    });
}
