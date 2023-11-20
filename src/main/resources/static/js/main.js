// 팀 데이터 가져오기
import teamData from '/js/mock/teamData.js';

let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const slideCount = slides.length;
let slideInterval;

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
        <td>${team.name}</td>
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

    for (let i = -3; i <= 3; i++) {
        const day = new Date(date); // 현재 날짜에서부터 i일 전/후의 날짜를 계산
        day.setDate(date.getDate() + i);

        const dayDiv = document.createElement('div'); // 동적 생성을 위해 querySelector 대신 사용
        dayDiv.classList.add('day');

        const dayDate = day.getDate(); // 날짜 부분 추출
        const dayName = day.toLocaleDateString('en-US', {weekday: 'short'}); // 날짜의 요일 부분을 가져옴
        dayDiv.textContent = `${dayDate}\n${dayName}`;

        dayDiv.addEventListener('click', () => {
            if (selectedDateDiv) {
                selectedDateDiv.classList.remove('selected'); // 기존 선택된 날짜 스타일 제거
            }
            selectDate(dayDiv);
            selectedDateDiv = dayDiv;
        });

        calendar.appendChild(dayDiv);

        if (i === 0) {
            selectDate(dayDiv); // 현재 날짜 (i가 0인 경우)를 선택된 날짜로 표시
            selectedDateDiv = dayDiv; // 선택된 날짜로 설정
        }
    }
}

function isToday(date) {
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
}

function selectDate(selectedDate) {
    const dayDivs = document.querySelectorAll('.day');
    dayDivs.forEach((dayDiv) => {
        dayDiv.classList.remove('selected');
    });

    selectedDate.classList.add('selected');
}

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
    for (let i = 0; i < 30; i++) {
        const randomDate = new Date(currentDate);
        randomDate.setDate(currentDate.getDate() + i);

        // 각 날짜당 5개의 일정 생성
        const numberOfSchedules = 6;
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

// 현재 날짜의 경기 일정을 표시하는 함수
function showSchedule(date) {
    const scheduleTable = document.querySelector('#schedule');
    scheduleTable.innerHTML = '';

    scheduleData.forEach((scheduleItem) => {
        if (scheduleItem.date.toDateString() === date.toDateString()) {
            const row = scheduleTable.insertRow();

            // 시간과 스포츠 아이콘 열
            const timeAndSportIconCell = row.insertCell(0);
            timeAndSportIconCell.innerHTML = `${scheduleItem.time}${scheduleItem.sportIcon}`;

            function getGenderLabelAndText(gender) {
                const colors = {
                    남자: '#0066FF',
                    여자: '#FF7474',
                    모두: '#80FF00',
                    학생: '#FFE500',
                };
                const color = colors[gender];

                return `
          <span style="background-color: ${color}; border-radius: 50%; width: 8px; height: 8px; display: inline-block; margin-right: 4px;"></span>
          ${gender}
        `;
            }

            // 장소와 성별 표시
            const locationCell = row.insertCell(1);
            locationCell.innerHTML = `
  ${scheduleItem.location}<br>
  <span style="color: gray;">${getGenderLabelAndText(
                scheduleItem.gender
            )}</span>
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
        showSchedule(selectedDate);
    });
});
