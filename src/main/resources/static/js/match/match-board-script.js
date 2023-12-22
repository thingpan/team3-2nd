const calendar = document.querySelector('.calendar');
let date;

document.addEventListener('DOMContentLoaded', function() {
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
		console.log(matchBoardInfos);
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
				console.log('Click event detected!');
				if (selectedDateDiv) {
					selectedDateDiv.classList.remove('selected');
				}
				selectDate(dayDiv);
				selectedDateDiv = dayDiv;

				// 클릭한 날짜를 선택된 날짜로 업데이트
				selectedDate = new Date(day);

				console.log('Clicked date:', selectedDate);
				showSchedule(selectedDate, selectedSport, selectedSido, selectedPoint);
			});

			calendar.appendChild(dayDiv);

			if (i === 0) {
				selectDate(dayDiv);
				selectedDateDiv = dayDiv;

				// 초기 선택일을 클릭한 날짜로 변경
				selectedDate = new Date(day);

				showSchedule(selectedDate, selectedSport, selectedSido, selectedPoint);
				console.log('Click on dayDiv. 날짜:', selectedDate);
			}
		}
	}


	// 이벤트 리스너 함수
	function onFilterChange() {
		showSchedule(selectedDate, selectedSport, selectedSido, selectedPoint);
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
		selectedDate.setDate(selectedDate.getDate() - 7);
		updateCalendar(selectedDate);
	});

	// 다음 주 버튼 클릭 시 이벤트 리스너
	calendarNextBtn.addEventListener('click', () => {
		selectedDate.setDate(selectedDate.getDate() + 7);
		updateCalendar(selectedDate);
		showSchedule(selectedDate, selectedSport, selectedSido, selectedPoint);
	});

	// 일정 표시 함수
	async function showSchedule(selectedDate, selectedSport, selectedSido, selectedPoint, selectedsigungu) {
		console.log('showSchedule 호출. Date: ', selectedDate);
		console.log('Selected Sport: ', selectedSport);
		console.log('Selected Sido: ', selectedSido);
		console.log('selectedPoint: ', selectedPoint);
		date = selectedDate;
		console.log(date);

		// matchBoardInfos가 null이면 데이터를 다시 가져옴
		if (!matchBoardInfos) {
			await fetchMatchBoardData();
		}

		const apiScheduleItems = matchBoardInfos.matchBoardList.map(matchBoardList => {
			return {
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

		filteredMatchBoards = apiScheduleItems.filter(apiScheduleItem => {
			const mbDate = new Date(apiScheduleItem.mbDate);
			const skill = parseInt(document.getElementById("point").value);
			const upperBound = skill + 100;

			// 종목과 시도가 선택되었을 때만 해당 조건을 검사
			const isSportMatch = !selectedSport || selectedSport === 'all' || apiScheduleItem.mbType === selectedSport;
			// 시도가 2글자 초과인 경우, 앞의 2글자를 제외하고 나머지 글자만 가져옴
			const isSidoMatch = !selectedSido || selectedSido === 'sido' || apiScheduleItem.mbSido.slice(0, 2) === selectedSido;

			// 날짜만을 비교하도록 수정 (클릭한 날짜 대신에 선택된 날짜 사용)
			const isDateMatch =
				mbDate.getDate() === selectedDate.getDate() &&
				mbDate.getMonth() === selectedDate.getMonth() &&
				mbDate.getFullYear() === selectedDate.getFullYear();

			const isPointMatch = !selectedPoint || skill === '0' || (apiScheduleItem.taPoint >= skill && apiScheduleItem.taPoint <= upperBound);

			console.log(selectedDate);
			console.log(isSportMatch);
			console.log(isSidoMatch);
			console.log(isDateMatch);
			console.log(isPointMatch);

			return isSportMatch && isSidoMatch && isDateMatch && isPointMatch;
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