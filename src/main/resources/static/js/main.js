const slides = document.querySelectorAll('.slide');
let selectedDate = new Date();
let matchBoardInfos = null;
let date;

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.opacity = '0'; // 스크롤 위치에 따라 내비게이션 바 숨김
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.opacity = '1'; // 스크롤 위치에 따라 내비게이션 바 표시
        header.style.transform = 'translateY(0)';
    }
});

const calendar = document.querySelector('.calendar');

document.addEventListener('DOMContentLoaded', function () {
    const calendarPrevBtn = document.querySelector('.calendar-button:first-of-type');
    const calendarNextBtn = document.querySelector('.calendar-button:last-of-type');

    let selectedDateDiv = null;
    let selectedSport = null;
    let selectedSido = null;
    let selectedPoint = null;

    async function fetchMatchBoardData() {
        const res = await fetch(`/match-infos`);
        matchBoardInfos = await res.json();

        console.log("matchBoardInfos", matchBoardInfos);
    }

    // 초기 캘린더 업데이트 시에도 데이터를 가져오도록 수정
    async function init() {
        await fetchMatchBoardData();
        updateCalendar(selectedDate);
        showSchedule(selectedDate, selectedSport, selectedSido, selectedPoint);
    }

    init();

    // 캘린더 업데이트 함수
    function updateCalendar(date) {
        calendar.innerHTML = '';

        for (let i = 0; i <= 6; i++) {
            const day = new Date(date);
            day.setDate(date.getDate() + i);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (day < today) {
                continue;
            }

            const dayDiv = document.createElement('div');
            dayDiv.classList.add('day');

            const dayDate = day.getDate();
            const dayName = day.toLocaleDateString('en-US', {weekday: 'short'});

            dayDiv.textContent = `${dayDate}\n${dayName}`;
            dayDiv.setAttribute('data-dayname', dayName);

            // 주말 색상 추가
            if (dayName === 'Sun') {
                dayDiv.classList.add('sunday');
            } else if (dayName === 'Sat') {
                dayDiv.classList.add('saturday');
            }

            if (selectedDateDiv && dayDiv === selectedDateDiv) {
                dayDiv.classList.add('selected');
            }

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

    // 이전 주 버튼 클릭 시 이벤트 리스너
    calendarPrevBtn.addEventListener('click', () => {
        const oneWeekAgo = new Date(selectedDate);
        oneWeekAgo.setDate(selectedDate.getDate() - 7);

        const today = new Date();
        today.setHours(0, 0, 0, 0); // 오늘 날짜의 시간을 00:00:00으로 설정

        if (oneWeekAgo > today) {
            // 이전 주가 오늘 이전인 경우에만 업데이트
            selectedDate = oneWeekAgo;
        } else {
            // 그 외의 경우에는 오늘 날짜로 업데이트
            selectedDate = today;
        }

        updateCalendar(selectedDate);
        showSchedule(selectedDate, selectedSport, selectedSido, selectedPoint);
    });

    // 다음 주 버튼 클릭 시 이벤트 리스너
    calendarNextBtn.addEventListener('click', () => {
        selectedDate.setDate(selectedDate.getDate() + 7);
        updateCalendar(selectedDate);
        showSchedule(selectedDate, selectedSport, selectedSido, selectedPoint);
    });

    // 일정 표시 함수
    async function showSchedule(date, selectedSport, selectedSido, selectedPoint) {
        console.log('showSchedule 호출');
        const res = await fetch(`/match-infos`);
        const matchBoardInfos = await res.json();
        const apiScheduleItems = matchBoardInfos.matchBoardList.map(matchBoardList => {
            return {
                activityStatus: matchBoardList.activityStatus,
                mbNum: matchBoardList.mbNum,
                mbTime: matchBoardList.mbTime,
                mbAddress: matchBoardList.mbAddress,
                mbAddressDetail: matchBoardList.mbAddressDetail,
                mbSido: matchBoardList.mbSido,
                mbDate: new Date(matchBoardList.mbDate),
                mbType: matchBoardList.mbType,
                mbStatus: matchBoardList.mbStatus,
                taMannerPoint: matchBoardList.taMannerPoint,
                taPoint: matchBoardList.taPoint
            };
        });

        let filteredMatchBoards;

        filteredMatchBoards = apiScheduleItems.filter(apiScheduleItem => {
            const mbDate = new Date(apiScheduleItem.mbDate);

            // 종목과 시도가 선택되었을 때만 해당 조건을 검사
            const isSportMatch = !selectedSport || selectedSport === 'all' || apiScheduleItem.mbType === selectedSport;
            // 시도가 2글자 초과인 경우, 앞의 2글자를 제외하고 나머지 글자만 가져옴
            const isSidoMatch = !selectedSido || selectedSido === 'sido' || apiScheduleItem.mbSido.slice(0, 2) === selectedSido;
            const isDateMatch = mbDate.setHours(0, 0, 0, 0) === new Date(date).setHours(0, 0, 0, 0);
            const isActivityStatus = apiScheduleItem.activityStatus == 0

            // 모든 조건이 충족되어야 필터링
            return isSportMatch && isSidoMatch && isDateMatch && isActivityStatus;
        });

        const scheduleTable = document.querySelector('#schedule');
        scheduleTable.innerHTML = '';

        const top5MatchBoards = filteredMatchBoards.slice(0, 5);
		const headerRow = scheduleTable.insertRow();
		headerRow.innerHTML = `
    	<th style="text-align:left; width: 25%;">매칭시간</th>
    	<th style="text-align:center; width: 25%;">장소</th>
    	<th style="text-align:center; width: 25%;">팀 점수</th>
    	<th style="text-align:center; width: 25%;">신청상태</th>
								`	;
        if (top5MatchBoards.length === 0) {
            const noScheduleMessage = document.createElement('div');
        	noScheduleMessage.classList.add('schedule-none');
			noScheduleMessage.textContent = '경기 일정이 없습니다.';

			// 중앙 정렬을 위한 스타일 적용
			noScheduleMessage.style.textAlign = 'center';

			const noScheduleRow = scheduleTable.insertRow();
			const noScheduleCell = noScheduleRow.insertCell();
			noScheduleCell.colSpan = 4; // 4개의 열을 병합
			noScheduleCell.appendChild(noScheduleMessage);
        } else {
            top5MatchBoards.forEach(apiScheduleItem => {
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
                const teamPoint = row.insertCell();
                teamPoint.innerHTML = `${apiScheduleItem.taPoint}`;

                // 상태 뱃지 표시
                const statusCell = row.insertCell();
                const statusBadge = document.createElement('span');

                let status;
                let badgeStyle = '';

                if (apiScheduleItem.mbStatus === "0") {
                    status = '신청가능';
                    badgeStyle = 'badge-possible';
                } else if (apiScheduleItem.mbStatus === "1") {
                    status = '마감';
                    badgeStyle = 'badge-deadline';
                }

                statusBadge.textContent = status;
                statusBadge.classList.add(badgeStyle);

                statusBadge.style.fontWeight = '500';
                statusCell.appendChild(statusBadge);
            });
        }
    }
});

// 스포츠 종목별 아이콘 매핑
const sportIconsMap = {
    '축구': '⚽',
    '농구': '🏀',
    '야구': '⚾️'
};



