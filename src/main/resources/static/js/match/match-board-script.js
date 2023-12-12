const calendar = document.querySelector('.calendar');

document.addEventListener('DOMContentLoaded', function () {
    const calendarPrevBtn = document.querySelector('.calendar-button:first-of-type');
    const calendarNextBtn = document.querySelector('.calendar-button:last-of-type');

    let selectedDateDiv = null;
    let selectedSport = null;
    let selectedSido = null;
    let selectedPoint = null;

// 캘린더 업데이트 함수
    function updateCalendar(date) {
        calendar.innerHTML = '';

        // 주간 캘린더(7일) 표시
        for (let i = 0; i <= 6; i++) {
            const day = new Date(date);
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

                showSchedule(day, selectedSport, selectedSido, selectedPoint);
            });

            calendar.appendChild(dayDiv);

            if (i === 0) {
                selectDate(dayDiv);
                selectedDateDiv = dayDiv;

                showSchedule(day, selectedSport, selectedSido, selectedPoint);
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

    // 종목 선택 시 이벤트 리스너
    const selectSport = document.querySelector('#sports');
    if (selectSport) {
        selectSport.addEventListener('change', () => {
            selectedSport = selectSport.value;
            showSchedule(currentDate, selectedSport, selectedSido, selectedPoint);
        });
    }

    const selectSido = document.querySelector('#sido');
    selectSido.addEventListener('change', () => {
        selectedSido = selectSido.value;

        showSchedule(currentDate, selectedSport, selectedSido, selectedPoint);
    });

    const inputPoint = document.querySelector('#point');
    inputPoint.addEventListener('input', () => {
        selectedPoint = inputPoint.value;
        showSchedule(currentDate, selectedSport, selectedSido, selectedPoint);
    });

// 초기 캘린더 업데이트
    let currentDate = new Date();
    updateCalendar(currentDate);

// 이전 주 버튼 클릭 시 이벤트 리스너
    calendarPrevBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 7);
        updateCalendar(currentDate);
    });

// 다음 주 버튼 클릭 시 이벤트 리스너
    calendarNextBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 7);
        updateCalendar(currentDate);
        showSchedule(currentDate, selectedSport, selectedSido, selectedPoint);
    });

// 일정 표시 함수
    async function showSchedule(date, selectedSport, selectedSido, selectedPoint) {
        console.log('showSchedule 호출');
        const res = await fetch(`/match-board`);
        const matchBoardInfos = await res.json();

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

        let filteredMatchBoards;

        filteredMatchBoards = apiScheduleItems.filter(apiScheduleItem => {
            const mbDate = new Date(apiScheduleItem.mbDate);

            // 종목과 시도가 선택되었을 때만 해당 조건을 검사
            const isSportMatch = !selectedSport || apiScheduleItem.mbType === selectedSport;
            const isSidoMatch = !selectedSido || apiScheduleItem.mbSido === selectedSido;
            const isDateMatch = mbDate.setHours(0, 0, 0, 0) === new Date(date).setHours(0, 0, 0, 0);

            // 모든 조건이 충족되어야 필터링
            return isSportMatch && isSidoMatch && isDateMatch;
        });

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
});