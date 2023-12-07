const teamData = [
	{
		name: 'Soccer 1',
		type: '축구',
		points: 450,
		sport: 'soccer',
		location: '서울'
	},
	{
		name: 'KIA TIGERS',
		type: '야구',
		points: 480,
		sport: 'baseball',
		location: '광주'
	},
	{
		name: 'BasketBall 1',
		type: '농구',
		points: 400,
		sport: 'basketball',
		location: '서울'
	},
	{
		name: 'Soccer 2',
		type: '축구',
		points: 430,
		sport: 'soccer',
		location: '부산'
	},
	{
		name: 'Baseball 2',
		type: '야구',
		points: 401,
		sport: 'baseball',
		location: '충북'
	},
	{
		name: 'BasketBall 2',
		type: '농구',
		points: 390,
		sport: 'basketball',
		location: '강원'
	},
	{
		name: 'Soccer 3',
		type: '축구',
		points: 312,
		sport: 'soccer',
		location: '대전'
	},
	{
		name: 'Baseball 3',
		type: '야구',
		points: 391,
		sport: 'baseball',
		location: '제주'
	},
	{
		name: 'BasketBall 3',
		type: '농구',
		points: 310,
		sport: 'basketball',
		location: '경북'
	},
	{
		name: 'Soccer 4',
		type: '축구',
		points: 281,
		sport: 'soccer',
		location: '전남'
	},
	{
		name: 'Baseball 4',
		type: '야구',
		points: 211,
		sport: 'baseball',
		location: '전북'
	},
	{
		name: 'BasketBall 4',
		type: '농구',
		points: 280,
		sport: 'basketball',
		location: '서울'
	},
	{
		name: 'Soccer 5',
		type: '축구',
		points: 450,
		sport: 'soccer',
		location: '경기'
	},
	{
		name: 'Baseball 5',
		type: '야구',
		points: 135,
		sport: 'baseball',
		location: '인천'
	},
	{
		name: 'BasketBall 5',
		type: '농구',
		points: 129,
		sport: 'basketball',
		location: '충남'
	},
];

// 각 종목별로 팀 데이터를 분류
const soccerTeams = teamData.filter((team) => team.sport === 'soccer');
const baseballTeams = teamData.filter((team) => team.sport === 'baseball');
const basketballTeams = teamData.filter((team) => team.sport === 'basketball');

// 각 종목별로 포인트에 따라 정렬
soccerTeams.sort((a, b) => b.points - a.points);
baseballTeams.sort((a, b) => b.points - a.points);
basketballTeams.sort((a, b) => b.points - a.points);

// 각 종목별로 상위 5위 팀 가져오기
const top5SoccerTeams = soccerTeams.slice(0, 5);
const top5BaseballTeams = baseballTeams.slice(0, 5);
const top5BasketballTeams = basketballTeams.slice(0, 5);

// 각 팀에 순위 부여
top5SoccerTeams.forEach((team, index) => {
	team.rank = index + 1;
});
top5BaseballTeams.forEach((team, index) => {
	team.rank = index + 1;
});
top5BasketballTeams.forEach((team, index) => {
	team.rank = index + 1;
});

// 종목 별로 상위 5위 팀 데이터를 합치기
const top5TeamsBySport = {
	soccer: top5SoccerTeams,
	baseball: top5BaseballTeams,
	basketball: top5BasketballTeams,
};

document.addEventListener('DOMContentLoaded', function() {
	const tableBody = document.querySelector('.team-table tbody');

	// 종목 별로 팀 데이터 가져오기
	const soccerTeams = top5TeamsBySport.soccer;
	const baseballTeams = top5TeamsBySport.baseball;
	const basketballTeams = top5TeamsBySport.basketball;

	// HTML 테이블에 데이터 추가 함수
	function populateTable(teams) {
		teams.forEach((team) => {
			const row = document.createElement('tr');
			row.innerHTML = `
          <td>${team.rank}</td>
          <td>${team.type}</td>
          <td>${team.name}</td>
          <td>${team.location}</td>
          <td>${team.points}</td>
        `;
			tableBody.appendChild(row);
		});
	}

	// 초기에는 축구 종목의 상위 5위 팀 데이터를 표시
	populateTable(soccerTeams);

	// 스포츠 필터 변경 시, 해당 종목의 상위 5위 팀 데이터를 표시
	const sportFilter = document.querySelector('#sport-filter');
	sportFilter.addEventListener('change', () => {
		tableBody.innerHTML = ''; // 테이블 비우기
		const selectedSport = sportFilter.value;
		switch (selectedSport) {
			case 'soccer':
				populateTable(soccerTeams);
				break;
			case 'baseball':
				populateTable(baseballTeams);
				break;
			case 'basketball':
				populateTable(basketballTeams);
				break;
		}
	});
});

// 모듈로 내보내기
export default top5TeamsBySport;
