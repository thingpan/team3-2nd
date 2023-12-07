const calendar = document.querySelector('.calendar');
const calendarPrevBtn = document.querySelector('.calendar-button:first-of-type');
const calendarNextBtn = document.querySelector('.calendar-button:last-of-type');

// 이전에 선택된 날짜를 추적하기 위한 변수 추가
let selectedDateDiv = null;

async function showSchedule(date) {
    // 서버에서 matchBoard 데이터 가져오기 중
    const res = await fetch(`/match-board`);
    const clonedRes = res.clone();
    const matchBoardInfos = await clonedRes.json();

    console.log("msg", await res.text());
    console.log("match-board list: ", matchBoardInfos);

    const apiScheduleItems = matchBoardInfos.matchBoardList.map(matchBoardList => {
        return {
            mbNum: matchBoardList.mbNum,
            mbTime: matchBoardList.mbTime,
            mbAddress: matchBoardList.mbAddress,
            mbAddressDetail: matchBoardList.mbAddressDetail,
            mbSido: matchBoardList.mbSido,
            mbDate: new Date(matchBoardList.mbDate),
            mbType: matchBoardList.mbType,
            mbStatus: matchBoardList.mbStatus,
        };
    });

    const filteredMatchBoards = apiScheduleItems.filter(apiScheduleItem => {
        // matchBoardList 안에 있는 경우 처리
        if (apiScheduleItem.matchBoardList) {
            // matchBoardList에서 mbDate와 date가 같은 경우 필터링
            const matchingItems = apiScheduleItem.matchBoardList.filter(item => {
                const boardDate = new Date(item.mbDate);
                boardDate.setHours(0, 0, 0, 0);

                date.setHours(0, 0, 0, 0);

                return (
                    boardDate.getTime() === date.getTime()
                );
            });

            // matchingItems이 비어있으면 false 반환
            return matchingItems.length > 0;
        }

        // matchBoardList가 없는 경우, matchBoard의 mbDate와 date가 같은 경우 필터링
        const boardDate = new Date(apiScheduleItem.mbDate);
        boardDate.setHours(0, 0, 0, 0);

        date.setHours(0, 0, 0, 0);

        return boardDate.getTime() === date.getTime();
    });

    console.log("filteredMatchBoards:", filteredMatchBoards);


    const scheduleTable = document.querySelector('#schedule');
    scheduleTable.innerHTML = '';

    if (filteredMatchBoards.length === 0) {
        const noScheduleMessage = document.createElement('div');
        noScheduleMessage.classList.add('schedule-none');
        noScheduleMessage.textContent = '경기 일정이 없습니다.';

        scheduleTable.appendChild(noScheduleMessage);
    } else {
        filteredMatchBoards.forEach(apiScheduleItem => {
            const row = scheduleTable.insertRow();

            const sportIconsMap = {
                '축구': '⚽',
                '농구': '🏀',
                '야구': '⚾️'
            };

            // 시간과 스포츠 아이콘
            const timeAndSportIconCell = row.insertCell();
            const sportIcon = getSportIconByType(apiScheduleItem.mbType);
            timeAndSportIconCell.innerHTML = `${apiScheduleItem.mbTime}${sportIcon}`;

            function getSportIconByType(mbType) {
                return sportIconsMap[mbType];
            }

            // 장소와 상태 뱃지 표시
            const locationAndStatusCell = row.insertCell();
            locationAndStatusCell.innerHTML = `[${apiScheduleItem.mbSido}]
                <a class="match-board-title" style="color: #111; font-weight: 400; text-decoration: none" href="/page/match/match-view?mbNum=${apiScheduleItem.mbNum}">${apiScheduleItem.mbAddressDetail}</a> <br>
            `;

            // 상태 뱃지 표시
            const statusCell = row.insertCell();
            const statusBadge = document.createElement('span');

            // 상태에 따라 스타일을 지정
            if (apiScheduleItem.mbStatus === "0") {
                statusBadge.textContent = '신청가능';
                statusBadge.style.backgroundColor = '#0066FF';
                statusBadge.style.color = '#FFFFFF';
                statusBadge.style.padding = '14px 37px';
            } else if (apiScheduleItem.mbStatus === "1") {
                statusBadge.textContent = '마감';
                statusBadge.style.backgroundColor = '#D3D3D3';
                statusBadge.style.color = '#8F8F8F';
                statusBadge.style.padding = '14px 50px';
            }

            statusBadge.style.borderRadius = '18px';
            statusBadge.style.fontSize = '14px';
            statusBadge.style.fontWeight = '500';

            statusCell.appendChild(statusBadge);
        });
    }
}

// 캘린더 업데이트 함수
function updateCalendar(date) {
    calendar.innerHTML = '';

    // 주간 캘린더(7일) 표시
    for (let i = 0; i <= 6; i++) {
        const day = new Date(date); // 현재 날짜에서부터 i일 전/후의 날짜를 계산
        day.setDate(date.getDate() + i);

        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');

        const dayDate = day.getDate();
        const dayName = day.toLocaleDateString('en-US', {weekday: 'short'});
        dayDiv.textContent = `${dayDate}\n${dayName}`;

        dayDiv.addEventListener('click', () => {
            if (selectedDateDiv) {
                selectedDateDiv.classList.remove('selected');
            }
            selectDate(dayDiv);
            selectedDateDiv = dayDiv;
            showSchedule(day); // 클릭된 날짜에 대한 일정 업데이트
        });

        calendar.appendChild(dayDiv);

        if (i === 0) {
            selectDate(dayDiv);
            selectedDateDiv = dayDiv;
            showSchedule(day); // 초기에는 오늘 날짜의 일정을 표시
        }
    }
}

// 선택된 날짜에 대한 스타일을 적용하는 함수
function selectDate(selectedDate) {
    const dayDivs = document.querySelectorAll('.day');
    dayDivs.forEach((dayDiv) => {
        dayDiv.classList.remove('selected');
    });

    selectedDate.classList.add('selected');
}

// 초기 캘린더 업데이트
let currentDate = new Date();
updateCalendar(currentDate);

calendarPrevBtn.addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() - 7);
    updateCalendar(currentDate);
    showSchedule(currentDate); // 날짜 변경 후 일정 업데이트
});

calendarNextBtn.addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() + 7);
    updateCalendar(currentDate);
    showSchedule(currentDate); // 날짜 변경 후 일정 업데이트

    // 스포츠 종목별 아이콘 매핑
    const sportIconsMap = {
        '축구': '⚽',
        '농구': '🏀',
        '야구': '⚾️'
    };

    window.addEventListener('load', async function () {
        try {
            const res = await fetch(`/match-board`);
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            const matchBoardInfos = await res.json();

            if (Array.isArray(matchBoardInfos.matchBoardList)) {
                // 여기서 바로 showSchedule 호출
                showSchedule(matchBoardInfos.matchBoardList);
            } else {
                console.error('Invalid data format received from the server.');
            }

        } catch (error) {
            console.error('Error fetching match-board data:', error);
        }
    });

    // 페이지 로드 시 오늘 날짜의 테이블 자동 표시
    showSchedule(currentDate);

    // 초기 캘린더 업데이트
    updateCalendar(currentDate);

    // 캘린더 날짜 클릭 시 일정 표시
    const calendarDays = document.querySelectorAll('.day');
    calendarDays.forEach((dayElement) => {
        dayElement.addEventListener('click', () => {
            const selectedDate = new Date(currentDate);
            selectedDate.setDate(
                selectedDate.getDate() + parseInt(dayElement.textContent) - 1
            );

            if (selectedSido === '부산') {
                showSchedule(selectedDate);
            } else {
                console.log("Selected Date:", selectedDate);

                // 새로 선택된 날짜에 대한 일정만 표시
                showSchedule(selectedDate);
            }
        });
    });

    // 페이지 로드 시 오늘 날짜의 테이블 자동 표시
    showSchedule(currentDate);
});