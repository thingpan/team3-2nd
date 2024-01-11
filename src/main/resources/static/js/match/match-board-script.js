const calendar = document.querySelector('.calendar');
let date;

document.addEventListener('DOMContentLoaded', function () {
    const deadlineCheckbox = document.querySelector('#btn-check');
    let isCheckboxDisabled = false;

    deadlineCheckbox.addEventListener('change', () => {
        applyFilters();
    });

    async function applyFilters() {
        // 필터링된 일정을 표시
        showSchedule(selectedDate, selectedSport, selectedSido, selectedPoint);
    }

    const calendarPrevBtn = document.querySelector('.calendar-button:first-of-type');
    const calendarNextBtn = document.querySelector('.calendar-button:last-of-type');

    let selectedDateDiv = null;
    let selectedSport = null;
    let selectedSido = null;
    let selectedPoint = null;
    let selectedDate = new Date();

    let matchBoardInfos = null;

    async function fetchMatchBoardData() {
        const res = await fetch(`/match-board`);
        matchBoardInfos = await res.json();

        console.log("matchBoardInfos", matchBoardInfos);
    }

    // 캘린더 업데이트 함수
    function updateCalendar(date) {
        calendar.innerHTML = '';

        // 주간 캘린더(7일) 표시
        for (let i = 0; i <= 6; i++) {
            const day = new Date(date);
            day.setDate(date.getDate() + i);

            const today = new Date(); // 현재 날짜
            today.setHours(0, 0, 0, 0); // 오늘 날짜의 시간을 00:00:00으로 설정

            // 현재 날짜와 비교하여 오늘 이후의 날짜만 표시
            if (day < today) {
                continue;
            }

            const dayDiv = document.createElement('div');
            dayDiv.classList.add('day');

            const dayDate = day.getDate();
            const dayName = day.toLocaleDateString('en-US', {weekday: 'short'});
            dayDiv.textContent = `${dayDate}\n${dayName}`;
            dayDiv.setAttribute('data-dayname', dayName);

            dayDiv.addEventListener('click', () => {
                if (selectedDateDiv) {
                    selectedDateDiv.classList.remove('selected');
                }
                selectDate(dayDiv);
                selectedDateDiv = dayDiv;

                // 클릭한 날짜를 선택된 날짜로 업데이트
                selectedDate = new Date(day);
                showSchedule(selectedDate, selectedSport, selectedSido, selectedPoint);
            });

            calendar.appendChild(dayDiv);

            if (i === 0) {
                selectDate(dayDiv);
                selectedDateDiv = dayDiv;

                // 초기 선택일을 클릭한 날짜로 변경
                selectedDate = new Date(day);
                showSchedule(selectedDate, selectedSport, selectedSido, selectedPoint);
            }
        }
    }

    console.log('Clicked date:', selectedDate);

    // 이벤트 리스너 함수
    async function onFilterChange() {
        fetchMatchBoardData(selectedSport, selectedSido, selectedPoint)
            .then(() => {
                showSchedule(selectedDate, selectedSport, selectedSido, selectedPoint);
            })
            .catch(error => {
                console.error('매치 데이터 fetch 실패:', error);
            });
    }

    // 선택된 날짜에 대한 스타일을 적용하는 함수
    function selectDate(selectedDate) {
        const dayDivs = document.querySelectorAll('.day');
        dayDivs.forEach((dayDiv) => {
            dayDiv.classList.remove('selected');
        });

        selectedDate.classList.add('selected');
    }

    // 이벤트 리스너 등록
    const selectSport = document.querySelector('#sports');
    if (selectSport) {
        selectSport.addEventListener('change', () => {
            selectedSport = selectSport.value;
            onFilterChange();
        });
    }

    const selectSido = document.querySelector('#sido');
    if (selectSido) {
        selectSido.addEventListener('change', () => {
            selectedSido = selectSido.value;
            onFilterChange();
        });
    }

    const inputPoint = document.querySelector('#point');
    if (inputPoint) {
        inputPoint.addEventListener('input', () => {
            selectedPoint = inputPoint.value;
            onFilterChange();
        });
    }

    // 초기 캘린더 업데이트
    let currentDate = new Date();
    updateCalendar(currentDate);

    // 이전 주 버튼 클릭 시 이벤트 리스너
    calendarPrevBtn.addEventListener('click', () => {
        const oneWeekAgo = new Date(selectedDate);
        oneWeekAgo.setDate(selectedDate.getDate() - 7);

        const today = new Date(); // 현재 날짜
        today.setHours(0, 0, 0, 0); // 오늘 날짜의 시간을 00:00:00으로 설정

        if (oneWeekAgo <= today) {
            // 오늘 이전이면 버튼 비활성화
            return;
        }

        selectedDate = oneWeekAgo;
        updateCalendar(selectedDate);
    });

    // 다음 주 버튼 클릭 시 이벤트 리스너
    calendarNextBtn.addEventListener('click', () => {
        selectedDate.setDate(selectedDate.getDate() + 7);
        updateCalendar(selectedDate);
        showSchedule(selectedDate, selectedSport, selectedSido, selectedPoint);
    });

    // 일정 표시 함수
    async function showSchedule(selectedDate, selectedSport, selectedSido, selectedPoint) {
        date = selectedDate;

        // matchBoardInfos가 null이면 데이터를 다시 가져옴
        if (!matchBoardInfos) {
            try {
                await fetchMatchBoardData();
            } catch (error) {
                console.error('Failed to fetch match board data:', error);
                return;
            }
        }

        console.log('matchBoardInfos:', matchBoardInfos);

        if (!matchBoardInfos || !matchBoardInfos.matchBoardList) {
            console.error('데이터가 이상해:', matchBoardInfos);
            return;
        }

        const apiScheduleItems = matchBoardInfos.matchBoardList.map(matchBoardList => {
            return {
                activityStatus: matchBoardList.activityStatus,
                mbNum: matchBoardList.mbNum,
                mbTime: matchBoardList.mbTime,
                mbAddress: matchBoardList.mbAddress,
                mbAddressDetail: matchBoardList.mbAddressDetail,
                mbSido: matchBoardList.mbSido,
                mbsigungu: matchBoardList.mbSigungu,
                mbDate: new Date(matchBoardList.mbDate),
                mbType: matchBoardList.mbType,
                mbStatus: matchBoardList.mbStatus,
                taMannerPoint: matchBoardList.taMannerPoint,
                taPoint: matchBoardList.taPoint
            };
        });

        let filteredMatchBoards;

        // 시간 순서로 배열 정렬
        apiScheduleItems.sort((a, b) => {
            const timeA = new Date(`2023-01-01 ${a.mbTime}`);
            const timeB = new Date(`2023-01-01 ${b.mbTime}`);
            return timeA - timeB;
        });

        // 필터링된 매치 목록 (mbStatus 0 또는 1인 것만 포함)
        filteredMatchBoards = apiScheduleItems.filter(apiScheduleItem => {
            const mbDate = new Date(apiScheduleItem.mbDate);
            const skill = parseInt(document.querySelector("#point").value) || 0;
            const upperBound = skill + 100;

            console.log('apiScheduleItem.activityStatus:', apiScheduleItem.activityStatus);

            // 종목과 시도가 선택되었을 때만 해당 조건을 검사
            const isSportMatch = !selectedSport || selectedSport === 'all' || apiScheduleItem.mbType === selectedSport;
            // 시도가 2글자 초과인 경우, 앞의 2글자를 제외하고 나머지 글자만 가져옴
            const isSidoMatch = !selectedSido || selectedSido === 'sido' || apiScheduleItem.mbSido.slice(0, 2) === selectedSido;
            const isDateMatch =
                mbDate.getDate() === selectedDate.getDate() &&
                mbDate.getMonth() === selectedDate.getMonth() &&
                mbDate.getFullYear() === selectedDate.getFullYear();
            const isActivityStatus = apiScheduleItem.activityStatus == 0
            const isPointMatch = !selectedPoint || skill === 0 || (apiScheduleItem.taPoint >= skill && apiScheduleItem.taPoint <= upperBound);
            const isDeadlineMatch = !deadlineCheckbox.checked || apiScheduleItem.mbStatus !== "1";

            return isSportMatch && isSidoMatch && isDateMatch && isPointMatch && isDeadlineMatch && isActivityStatus;
        });

        // 체크박스를 비활성화할지 여부를 결정
        isCheckboxDisabled = filteredMatchBoards.length === 0 && !deadlineCheckbox.checked;

        const scheduleTable = document.querySelector('#schedule');
        scheduleTable.innerHTML = '';

        if (filteredMatchBoards.length === 0) {
            const noScheduleMessage = document.createElement('tr');
            noScheduleMessage.classList.add('schedule-none');

            const cell = noScheduleMessage.insertCell();
            cell.colSpan = "4"; // 이 값을 컬럼 수에 맞게 조절

            const messageDiv = document.createElement('div');
            messageDiv.textContent = '경기 일정이 없습니다.';

            cell.appendChild(messageDiv);

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
                locationAndStatusCell.innerHTML = `[${apiScheduleItem.mbSido.slice(0, 2)}]
        <a class="match-board-title" style="color: #111; font-weight: 400; text-decoration: none" href="/page/match/match-view?mbNum=${apiScheduleItem.mbNum}">${apiScheduleItem.mbAddressDetail}</a> <br>`;

                const teamPoint = row.insertCell();
                teamPoint.innerHTML = `${apiScheduleItem.taPoint}`;

                // 상태 뱃지 표시
                const statusCell = row.insertCell();
                const statusBadge = document.createElement('span');

                // 상태에 따라 스타일을 지정
                if (apiScheduleItem.mbStatus === "0") {
                    statusBadge.textContent = '신청가능';
                    statusBadge.style.backgroundColor = '#0066FF';
                    statusBadge.style.color = '#FFFFFF';
                    statusBadge.style.padding = window.innerWidth <= 450 ? '8px' : '14px 40px';
                    statusBadge.style.borderRadius = '18px';
                    statusBadge.style.fontSize = window.innerWidth <= 500 ? '8px' : '16px';
                } else if (apiScheduleItem.mbStatus === "1") {
                    statusBadge.textContent = '마감';
                    statusBadge.style.backgroundColor = '#D3D3D3';
                    statusBadge.style.color = '#8F8F8F';
                    statusBadge.style.padding = window.innerWidth <= 450 ? '8px' : '14px 40px';
                    statusBadge.style.borderRadius = '18px';
                    statusBadge.style.fontSize = window.innerWidth <= 500 ? '10px' : '16px';
                }

                statusBadge.style.fontWeight = '500';

                statusCell.appendChild(statusBadge);
            });
        }

            // 체크박스 비활성화 여부를 설정
        deadlineCheckbox.disabled = isCheckboxDisabled;
    }
});