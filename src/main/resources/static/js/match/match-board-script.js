// 팀 데이터 가져오기
import teamData from '/js/mock/teamData.js';

const header = document.querySelector('#header');

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
const calendarPrevBtn = document.querySelector(
    '.calendar-button:first-of-type'
);
const calendarNextBtn = document.querySelector('.calendar-button:last-of-type');

// 이전에 선택된 날짜를 추적하기 위한 변수 추가
let selectedDateDiv = null;

// 캘린더 업데이트 함수
function updateCalendar(date) {
    calendar.innerHTML = '';

    // 주간 캘린더(7일) 표시
    for (let i = -3; i <= 3; i++) {
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
    currentDate.setDate(currentDate.getDate() - 1);
    updateCalendar(currentDate);
    showSchedule(currentDate); // 날짜 변경 후 일정 업데이트
});

calendarNextBtn.addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() + 1);
    updateCalendar(currentDate);
    showSchedule(currentDate); // 날짜 변경 후 일정 업데이트
});

const sportsIcons = ['⚽', '🏀', '⚾️'];

// 상태 뱃지 목록
const statusBadges = ['마감', '신청가능', '마감임박'];

function generateMockData() {
    const mockData = [];

    // 30일 동안의 무작위 일정 생성
    const currentDate = new Date();
    // for (let i = 0; i < 30; i++) {
    //     const randomDate = new Date(currentDate);
    //     randomDate.setDate(currentDate.getDate() + i);
    for (let i = -15; i <= 15; i++) {
        const randomDate = new Date(currentDate);
        randomDate.setDate(currentDate.getDate() + i);

        // 각 날짜당 랜덤으로 일정 생성
        const numberOfSchedules = 2;
        for (let j = 1; j < numberOfSchedules; j++) {
            // 랜덤으로 종목, 시간, 장소, 성별, 및 인원수 선택 (db 작업 후 수정)
            const randomSportIcon =
                sportsIcons[Math.floor(Math.random() * sportsIcons.length)];
            const randomTime = `${Math.floor(Math.random() * 12) + 8}:${
                Math.random() < 0.5 ? '00' : '30'
            }`;
            const randomLocation = `장소 ${j}`;
            const randomGender = generateRandomGender();
            const randomCapacity = generateRandomCapacity(randomSportIcon);

            // 일정 항목 생성
            const scheduleItem = {
                date: randomDate,
                sportIcon: randomSportIcon,
                time: randomTime,
                location: randomLocation,
                gender: randomGender,
                capacity: randomCapacity,
                statusBadge:
                    statusBadges[Math.floor(Math.random() * statusBadges.length)],
            };

            mockData.push(scheduleItem);
        }
    }

    return mockData;
}

function generateRandomGender() {
    const genders = ['남자', '여자', '모두'];
    const randomIndex = Math.floor(Math.random() * genders.length);
    return genders[randomIndex];
}

function generateRandomCapacity(sportIcon) {
    switch (sportIcon) {
        case '⚽':
            return '11vs11';
        case '⚾️':
            return '12vs12';
        case '🏀':
            return '6vs6';
    }
}

// 무작위로 생성된 경기 일정 데이터 가져오기
const scheduleData = generateMockData();

window.addEventListener('load', async function () {
    const res = await fetch(`/match-board/1`);
    const matchBoardInfos = await res.json();
    console.log(matchBoardInfos);

    matchBoardInfos.forEach(matchBoardInfo => {
        console.log(matchBoardInfo);
    });

});

async function showSchedule(date) {
    // 서버에서 matchBoard 데이터 가져오기중
    const res = await fetch(`/match-board/1`);
    const matchBoards = await res.json();

    const selectedSido = '서울';

    // const filteredMatchBoards = matchBoards.filter(matchBoard => {
    //     return matchBoard.mbSido === selectedSido;
    // });

    const filteredMatchBoards = matchBoards.filter(matchBoard => {
        const boardDate = new Date(matchBoard.mbDate);
        return boardDate.getFullYear() === date.getFullYear() &&
            boardDate.getMonth() === date.getMonth() &&
            boardDate.getDate() === date.getDate();
    });


    const scheduleTable = document.querySelector('#schedule');
    scheduleTable.innerHTML = '';

    if (filteredMatchBoards.length === 0) {
        const noScheduleMessage = document.createElement('div');
        noScheduleMessage.classList.add('schedule-none');
        noScheduleMessage.textContent = '경기 일정이 없습니다.';

        scheduleTable.appendChild(noScheduleMessage);
    } else {
        filteredMatchBoards.forEach(matchBoard => {
            const apiScheduleItem = {
                mbNum: matchBoard.mbNum,
                mbTime: matchBoard.mbTime,
                mbAddress: matchBoard.mbAddress,
                mbAddressDetail: matchBoard.mbAddressDetail,
                mbSido: matchBoard.mbSido,
                mbDate: new Date(matchBoard.mbDate)
            };

            scheduleData.forEach((scheduleItem) => {
                // if (apiScheduleItem.mbDate && apiScheduleItem.mbDate.toDateString() === date.toDateString()) {
                if (scheduleItem.date.toDateString() === date.toDateString()) {
                    const row = scheduleTable.insertRow();

                    // 시간과 스포츠 아이콘
                    const timeAndSportIconCell = row.insertCell(0);
                    timeAndSportIconCell.innerHTML = `${apiScheduleItem.mbTime}${scheduleItem.sportIcon}`;

                    function getGenderLabelAndText(gender) {
                        const colors = {
                            남자: '#0066FF',
                            여자: '#FF7474',
                            모두: '#80FF00'
                        };
                        const color = colors[gender];

                        return `
                        <span style="background-color: ${color}; border-radius: 50%; width: 8px; height: 8px; display: inline-block; margin-right: 4px;"></span>
                        ${gender}
                    `;
                    }

                    // 장소와 성별 표시
                    const locationCell = row.insertCell(1);
                    locationCell.innerHTML = `[${apiScheduleItem.mbSido}]
                    <a class="match-board-title" style="color: #111; font-weight: 400; text-decoration: none" href="/page/match/match-view?mbNun=${apiScheduleItem.mbNum}">${apiScheduleItem.mbAddressDetail}</a> <br>
                    <span style="color: gray;">${getGenderLabelAndText(scheduleItem.gender)}</span>
                    <span style="color: gray;">${scheduleItem.capacity}</span>
                `;

                    // 상태 뱃지 표시
                    const statusCell = row.insertCell(2);
                    const statusBadge = document.createElement('span');
                    statusBadge.textContent = scheduleItem.statusBadge;

                    // 상태에 따라 스타일을 지정
                    switch (scheduleItem.statusBadge) {
                        case '마감':
                            statusBadge.style.backgroundColor = '#D3D3D3';
                            statusBadge.style.color = '#8F8F8F';
                            statusBadge.style.padding = '14px 50px';
                            break;
                        case '마감임박':
                            statusBadge.style.backgroundColor = '#FF0000';
                            statusBadge.style.color = '#FFFFFF';
                            statusBadge.style.padding = '14px 37px';
                            break;
                        case '신청가능':
                            statusBadge.style.backgroundColor = '#0066FF';
                            statusBadge.style.color = '#FFFFFF';
                            statusBadge.style.padding = '14px 37px';
                            break;
                    }

                    statusBadge.style.borderRadius = '18px';
                    statusBadge.style.fontSize = '14px';
                    statusBadge.style.fontWeight = '500';

                    statusCell.appendChild(statusBadge);
                }
            });
        });
    }
}


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
                updateCalendar(selectedDate);
                console.log("Selected Date:", selectedDate);
            }
        });
    });


    function updateSchedule() {
        const selectedSport = document.getElementById('sports').value;
        const selectedSido = document.getElementById('sido').value;
        const selectedSigungu = document.getElementById('sigungu').value;
        const selectedPoint = document.getElementById('point').value;

        // 여기에 서버에서 데이터를 가져와서 필터링하고, updateScheduleTable 함수를 호출하여 테이블을 업데이트하는 로직을 작성합니다.
        fetch(`/match-board/${selectedSido}/${selectedSigungu}/${selectedSport}/${selectedPoint}`)
            .then(response => response.json())
            .then(data => updateScheduleTable(data));
    }

// 페이지 로드 시 오늘 날짜의 테이블 자동 표시
    showSchedule(currentDate);

// 초기 캘린더 업데이트
    updateCalendar(currentDate);