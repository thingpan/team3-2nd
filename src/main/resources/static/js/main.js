// 팀 데이터 가져오기
import teamData from '/js/mock/teamData.js';

let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const slideCount = slides.length;
let slideInterval;

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.opacity = '0'; // 스크롤 위치에 따라 내비게이션 바 숨김
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.opacity = '1'; // 스크롤 위치에 따라 내비게이션 바 표시
        header.style.transform = 'translateY(0)';
    }
});

function showSlide(n) {
    slides.forEach((slide) => (slide.style.display = 'none'));
    slides[n].style.display = 'block';
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slideCount;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slideCount) % slideCount;
    showSlide(currentSlide);
}

// 페이지 로드 시 슬라이드 표시
document.addEventListener('DOMContentLoaded', () => {
    showSlide(currentSlide);
    slideInterval = setInterval(nextSlide, 3000); // 3초마다 자동 슬라이드

    const slidePrevBtn = document.querySelector('.prev-btn');
    const slideNextBtn = document.querySelector('.next-btn');

    // 이전 버튼 클릭 시 이전 슬라이드로 이동
    slidePrevBtn.addEventListener('click', () => {
        clearInterval(slideInterval); // 자동 슬라이드 중지
        prevSlide();
        slideInterval = setInterval(nextSlide, 3000); // 다시 자동 슬라이드 시작
    });

    // 다음 버튼 클릭 시 다음 슬라이드로 이동
    slideNextBtn.addEventListener('click', () => {
        clearInterval(slideInterval); // 자동 슬라이드 중지
        nextSlide();
        slideInterval = setInterval(nextSlide, 3000); // 다시 자동 슬라이드 시작
    });
});

// teamData 관련 코드
document.addEventListener('DOMContentLoaded', function () {
    console.log('Team Data:', teamData); // 콘솔에 출력

    const tbody = document.querySelector('.team-table tbody');
    const sportFilter = document.querySelector('#sport-filter');

    // 페이지 로드 시 기본적으로 축구 데이터 표시
    const defaultSport = 'soccer';

    sportFilter.value = defaultSport;

    // 스포츠 필터 변경 시, 해당 스포츠 팀 데이터만 필터링하여 표시
    sportFilter.addEventListener('change', () => {
        const selectedSport = sportFilter.value;

        // 해당 스포츠 데이터 필터링
        const selectedSportTeams = teamData[selectedSport] || []; // 선택된 스포츠 데이터가 없을 경우 빈 배열로 기본 설정

        const top5Teams = selectedSportTeams.slice(0, 5);

        // 테이블 비우기
        tbody.innerHTML = '';

        // 필터링된 데이터를 HTML에 추가
        top5Teams.forEach((team) => {
            const row = document.createElement('tr');
            row.innerHTML = `
        <td>${team.rank}</td>
        <td>${team.type}</td>
        <td>${team.name}</td>
        <td>${team.location}</td>
        <td>${team.points}</td>
      `;
            tbody.appendChild(row);
        });
    });
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
});

const sportsIcons = ['⚽', '🏀', '⚾️'];

// 상태 뱃지 목록
const statusBadges = ['마감', '신청가능'];

function generateMockData() {
    const mockData = [];

    // 30일 동안의 무작위 일정 생성
    const currentDate = new Date();
    for (let i = 0; i < 30; i++) {
        const randomDate = new Date(currentDate);
        randomDate.setDate(currentDate.getDate() + i);

        // 각 날짜당 5개의 일정 생성
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
    const genders = ['남자', '여자', '모두', '학생'];
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
        default:
            return 'N/A';
    }
}

// 무작위로 생성된 경기 일정 데이터 가져오기
const scheduleData = generateMockData();

// 스포츠 종목별 아이콘 매핑
const sportIconsMap = {
    '축구': '⚽',
    '농구': '🏀',
    '야구': '⚾️'
};

// 현재 날짜의 경기 일정을 표시하는 함수
async function showSchedule(date) {
    // 서버에서 matchBoard 데이터 가져오기 중
    const res = await fetch(`/match-board/1`);
    const matchBoards = await res.json();

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
                mbDate: new Date(matchBoard.mbDate),
                mbType: matchBoard.mbType,
            };

            scheduleData.forEach((scheduleItem) => {
                if (scheduleItem.date.toDateString() === date.toDateString()) {
                    const row = scheduleTable.insertRow();

                    // 시간과 스포츠 아이콘
                    const timeAndSportIconCell = row.insertCell(0);
                    const sportIcon = getSportIconByType(apiScheduleItem.mbType);
                    timeAndSportIconCell.innerHTML = `${apiScheduleItem.mbTime}${sportIcon}`;


                    function getSportIconByType() {
                        return sportIconsMap[apiScheduleItem.mbType];
                    }

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
                    <a class="match-board-title" style="color: #111; font-weight: 400; text-decoration: none" href="/page/match/match-view?mbNum=${apiScheduleItem.mbNum}">${apiScheduleItem.mbAddressDetail}</a> <br>
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
                            break;임
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