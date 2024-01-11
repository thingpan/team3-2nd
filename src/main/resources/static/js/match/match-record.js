
async function getTeamInfo() {

	const urlParams = new URLSearchParams(window.location.search);
	const taNum = urlParams.get('taNum');

	const res = await fetch(`/team-info?taNum=${taNum}`);
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


	const resMatchList = await fetch(`/match-infos?page=${1}&pageSize=${5}&taNum=${taNum}`);
	const pageInfos = await resMatchList.json();
	console.log(pageInfos);

	let html = '';
	for (let matchinfo of pageInfos.list) {
		if (matchinfo.activityStatus != '1') {
			let mbCredat = matchinfo.mbCredat;
			var mbCredatParsing = [mbCredat.slice(0, 4), "-", mbCredat.slice(4, 6), "-", mbCredat.slice(6, 8)].join('')

			html += `<tr onclick="doGoMatchViewPage(${matchinfo.mbNum})">`;
			html += `<td> <h6 class="fw-semibold mb-0">${matchinfo.mbAddressDetail}</h6></td>`;
			html += `<td><h6 class="fw-semibold mb-0">${matchinfo.mbDate} | ${matchinfo.mbTime}</h6></td>`;
			html += `<td><h6 class="fw-semibold mb-0">${mbCredatParsing}</h6></td>`;
			html += `<td><h6 class="fw-semibold mb-0">${matchinfo.mbAddress}</h6></td>`;
			if (matchinfo.mbStatus == 1) {
				html += `<td><span class="badge bg-danger rounded-3 fw-semibold">신청마감</span></td>`;
			} else {
				html += `<td><span class="badge bg-primary rounded-3 fw-semibold">모집중</span></td>`;
			}

			html += '</tr>';
		}
	}
	document.querySelector('#team-user-list-info').innerHTML = html;

}

function goMatchListPage() {
	const urlParams = new URLSearchParams(window.location.search);
	const taNum = urlParams.get('taNum');
	location.href = `/page/team/team-match-list?taNum=${taNum}`;
}



window.addEventListener('load', getTeamInfo);