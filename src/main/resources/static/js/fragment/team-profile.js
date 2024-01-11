
async function getTeamInfo() {
	const urlParams = new URLSearchParams(window.location.search);
	const ftaNum = urlParams.get('taNum');

	const res = await fetch(`/team-info?taNum=${ftaNum}`);
	const teamInfo = await res.json();
	console.log(teamInfo);
	document.querySelector('#taName').innerHTML = teamInfo.taName;
	document.querySelector('#taDesc').innerHTML = teamInfo.taDesc;

	if (teamInfo.taType == '농구') {
		type = 'basketball';
	} else if (teamInfo.taType == '야구') {
		type = 'baseball';
	} else if (teamInfo.taType == '축구') {
		type = 'soccerball';
	}

	if (teamInfo.taFilePath == null) {
		document.querySelector('#teamImg').src = `/imgs/${type}.png`
	} else {
		try {
			document.querySelector('#teamImg').src = teamInfo.taFilePath;
		} catch {
			document.querySelector('#teamImg').src = `/imgs/${type}.png`
		}

	}


	const mannersProgress = document.querySelector('#manners-progress');
	// taMannerPoint가 참 값인지 확인; 그렇지 않으면 0으로 기본값 사용
	const mannerPercent = Math.floor(teamInfo.taMannerPoint ? (teamInfo.taMannerPoint / teamInfo.taMatchCount) : 0);
	mannersProgress.style.width = `${mannerPercent}%`;

	// 현재 점수 표시
	const currentScore = document.querySelector('#current-score');
	currentScore.textContent = `(${mannerPercent} / 100)`;


	const randomScore = teamInfo.taPoint;

	const scoreValue = document.querySelector('#score-value');
	scoreValue.textContent = `${randomScore}점`;

	// 점수에 따라 배경색과 텍스트색 변경
	if (randomScore <= 100) {
		scoreValue.style.backgroundColor = '#ececec';
		scoreValue.style.color = '#767676';
	} else if (randomScore <= 200) {
		scoreValue.style.backgroundColor = '#ede0c4';
		scoreValue.style.color = '#825e01';
	} else if (randomScore <= 300) {
		scoreValue.style.backgroundColor = '#fffbd5';
		scoreValue.style.color = '#ffb800';
	} else if (randomScore <= 400) {
		scoreValue.style.backgroundColor = '#e6f0ff';
		scoreValue.style.color = '#0066ff';
	} else {
		scoreValue.style.backgroundColor = '#f4e2ff';
		scoreValue.style.color = '#8200d2';
	}

	const wholeRecord = `${teamInfo.taMatchCount}전 ${teamInfo.taWinCnt}승 ${teamInfo.taDrawCnt}무 ${teamInfo.taLooseCnt}패`
	document.querySelector('#whole-record').innerHTML = wholeRecord;



}

window.addEventListener('load', getTeamInfo);