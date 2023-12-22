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

document.addEventListener('DOMContentLoaded', function () {
	const tbody = document.querySelector('.team-table tbody');
	const sportFilter = document.querySelector('#sport-filter');

	// 페이지 로드 시 기본적으로 축구 데이터 표시
	const defaultSport = '축구';

	// 스포츠 필터 변경 시, 해당 스포츠 팀 데이터만 필터링하여 표시
	sportFilter.addEventListener('change', async () => {
		let i = 1;
		const selectedSport = sportFilter.value;

		try {
			// 서버로부터 데이터 불러오기
			const response = await fetch(`/team-infos`);
			const selectedSportTeams = await response.json();

			console.log("selectedSportTeams", selectedSportTeams[0].taType);

			// 선택된 스포츠 데이터가 없을 경우 빈 배열로 기본 설정
			const top5Teams = selectedSportTeams.slice(0, 5);

			// 테이블 비우기링
			tbody.innerHTML = '';

			// 필터링된 데이터를 HTML에 추가
			top5Teams.forEach((team) => {
				const row = document.createElement('tr');
				row.innerHTML = `
                    <td>${i}</td>
                    <td>${team.taType}</td>
                    <td><a href="/page/team/record?taNum=${team.taNum}">${team.taName}</a></td>
                    <td>${team.taBoundarySido}</td>
                    <td>${team.taPoint}</td>
                `;
				tbody.appendChild(row);
				i++;
			});
		} catch (error) {
			console.error('Error fetching team data:', error);
		}
	});
});

const calendar = document.querySelector('.calendar');

document.addEventListener('DOMContentLoaded', function() {
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
			const dayName = day.toLocaleDateString('en-US', { weekday: 'short' });
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
			const isSportMatch = !selectedSport || selectedSport === 'all' || apiScheduleItem.mbType === selectedSport;
			// 시도가 2글자 초과인 경우, 앞의 2글자를 제외하고 나머지 글자만 가져옴
			const isSidoMatch = !selectedSido || selectedSido === 'sido' || apiScheduleItem.mbSido.slice(0, 2) === selectedSido;
			const isDateMatch = mbDate.setHours(0, 0, 0, 0) === new Date(date).setHours(0, 0, 0, 0);

			// 모든 조건이 충족되어야 필터링
			return isSportMatch && isSidoMatch && isDateMatch;
		});

		const scheduleTable = document.querySelector('#schedule');
		scheduleTable.innerHTML = '';

		const top5MatchBoards = filteredMatchBoards.slice(0, 5);

		if (top5MatchBoards.length === 0) {
			const noScheduleMessage = document.createElement('div');
			noScheduleMessage.classList.add('schedule-none');
			noScheduleMessage.textContent = '경기 일정이 없습니다.';

			scheduleTable.appendChild(noScheduleMessage);
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

