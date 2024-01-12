const furlParams = new URLSearchParams(window.location.search);
const ftaNum = furlParams.get('taNum');

async function getTeamInfo() {
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

	//가입한 팀 확인
	const resSign = await fetch(`/team-user-infos/${ftaNum}`)
	const result = await resSign.json();

	if (teamInfo.taSignStatus == 1) {
		document.querySelector('#teamSignBtn').innerHTML = '<h5 id="team-sign-stay-h" class="fw-semibold mb-0">가입신청 대기중</h6>'
	} else if (teamInfo.taSignStatus == 0) {
		document.querySelector('#teamSignBtn').innerHTML = '<button class="btn btn-primary m-1" onclick="doSendObj()">가입신청</button>'
		if (result == 0) {
			document.querySelector('#teamSignBtn').innerHTML = '';
		}
	}
}




// 이미지 로딩 실패 시 호출되는 함수
function handleImageError() {
	const noImageText = document.querySelector('#noImageText');
	noImageText.style.display = 'block';
}

async function doSendObj() {
	//타임리프 안돼서 일단 ㅠㅠ 
	const obj = {
		taNum: ftaNum
	}
	const res = await fetch('/team-sign-user-add', {
		method: 'POST',
		body: JSON.stringify(obj),
		headers: {
			'Content-Type': 'application/json;charset=UTF-8'
		}
	});
	const result = await res.json();

	console.log(result);
	if (result) {
		alert(`${result.resultMsg}`);
		debugger;
		await getTeamInfo();
	}

}

window.addEventListener('load', getTeamInfo);


