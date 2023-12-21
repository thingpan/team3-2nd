let matchData;
let mrNum;
const urlParams = new URLSearchParams(window.location.search);
const taNum = urlParams.get('taNum');

window.addEventListener('scroll', () => {
	if (window.scrollY > 50) {
		header.style.opacity = '0'; // 스크롤 위치에 따라 내비게이션 바 숨김
		header.style.transform = 'translateY(-100%)';
	} else {
		header.style.opacity = '1'; // 스크롤 위치에 따라 내비게이션 바 표시
		header.style.transform = 'translateY(0)';
	}
});


//홈 어웨이 셀렉트 박스 값 변할 때 밸류 갑 가져오기
function getSelectChangeListener(obj) {
	if (obj.value == 'home') {
		getHomeAjaxList();
	} else {
		getAwayAjaxList();
	}
}

async function getHomeAjaxList(evt, page) {
	let total = 0;
	let pageSize = 5;
	const blockSize = 5;

	if (!page) {
		page = 1;
	}

	let url = `/match-result-home-infos?page=${page}&pageSize=${pageSize}&taHomeNum=${taNum}`;
	const res = await fetch(url);
	const pageInfos = await res.json();
	const totalCnt = pageInfos.total;
	const pageBlock = Math.ceil(totalCnt / pageSize);

	const startBlock = (Math.ceil(page / blockSize) - 1) * blockSize + 1;
	let endBlock = startBlock + blockSize - 1;
	let pageHtml = '';

	console.log(pageInfos.list);

	if (endBlock > pageBlock) {
		endBlock = pageBlock;
	}

	if (startBlock != 1) {
		pageHtml += `<li class="page-item"><a class="page-link" aria-label="Previous" href="javascript:void(0)" onclick="getTeamUserInfoList(event,${startBlock - 1})"><span aria-hidden="true">&laquo;</span></a></li>`;
	}

	for (let i = startBlock; i <= endBlock; i++) {
		pageHtml += `<li class="page-item"><a class="page-link" href="javascript:void(0)" onclick="getTeamUserInfoList(event,${i})">${i}</a></li>`;
	}

	if (endBlock < pageBlock) {
		pageHtml += `<li class="page-item"><a  class="page-link" aria-label="Next" href="javascript:void(0)" onclick="getTeamUserInfoList(event,${endBlock + 1})"><span aria-hidden="true">&raquo;</span></a></li>`;
	}


	document.querySelector('#pageDiv').innerHTML = pageHtml;

	//여기서 상태별로 화면에 다르게 보여야함

	let html = '';
	if (pageInfos.list.length == 0) {
		html += '<tr><td colspan="5">비어있는 리스트 입니다.</td></tr>';
	} else {
		for (let matchStatus of pageInfos.list) {
			if (matchStatus.mrRequestStatus == '0') {
				html += '<li>';
				html += `<span>${matchStatus.mdDate}||${matchStatus.mdTime}</span>`;
				html += `<span>${matchStatus.taName}</span>`;
				html += `<span>${matchStatus.mdAddress}</span>`;
				html += `<span><button type="button" class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#scoreModal" onclick="saveMrNum(${matchStatus.mrNum})">
  						경기종료
						</button></span>`;
				html += `</li>`;
			}
			if (matchStatus.mrRequestStatus == '1') {
				html += '<li>';
				html += `<span>${matchStatus.mdDate}||${matchStatus.mdTime}</span>`;
				html += `<span>${matchStatus.taName}</span>`;
				html += `<span>${matchStatus.mdAddress}</span>`;
				html += `<span>상대팀 수락 대기중</span>`;
				html += `</li>`;
			} if (matchStatus.mrRequestStatus == '2') {
				html += '<li>';
				html += `<span>${matchStatus.mdDate}||${matchStatus.mdTime}</span>`;
				html += `<span>${matchStatus.taName}</span>`;
				html += `<span>${matchStatus.mdAddress}</span>`;
				html += `<span>거절됨 </span>`;
				html += `<button class="btn btn-dark">다시입력</button>`;
				html += `</li>`;
			} if (matchStatus.mrRequestStatus == '3') {
				//상태 검사
				html += '<li>';
				html += `<span>${matchStatus.mdDate}||${matchStatus.mdTime}</span>`;
				html += `<span>${matchStatus.taName}</span>`;
				html += `<span>${matchStatus.mdAddress}</span>`;
				html += `<span>${matchStatus.mrHomeScore} : ${matchStatus.mrAwayScore}</span>`;
				html += `<span>${matchStatus.mrWinLoose}</span>`;
				html += `</li>`;
			}

		}
	}

	document.querySelector('#match-list').innerHTML = html;

}

async function getAwayAjaxList(evt, page) {
	let total = 0;
	let pageSize = 5;
	const blockSize = 5;

	if (!page) {
		page = 1;
	}

	let url = `/match-result-away-infos?page=${page}&pageSize=${pageSize}&taAwayNum=${taNum}`;
	const res = await fetch(url);
	const pageInfos = await res.json();
	const totalCnt = pageInfos.total;
	const pageBlock = Math.ceil(totalCnt / pageSize);

	const startBlock = (Math.ceil(page / blockSize) - 1) * blockSize + 1;
	let endBlock = startBlock + blockSize - 1;
	let pageHtml = '';

	console.log(pageInfos.list);

	if (endBlock > pageBlock) {
		endBlock = pageBlock;
	}

	if (startBlock != 1) {
		pageHtml += `<li class="page-item"><a class="page-link" aria-label="Previous" href="javascript:void(0)" onclick="getTeamUserInfoList(event,${startBlock - 1})"><span aria-hidden="true">&laquo;</span></a></li>`;
	}

	for (let i = startBlock; i <= endBlock; i++) {
		pageHtml += `<li class="page-item"><a class="page-link" href="javascript:void(0)" onclick="getTeamUserInfoList(event,${i})">${i}</a></li>`;
	}

	if (endBlock < pageBlock) {
		pageHtml += `<li class="page-item"><a  class="page-link" aria-label="Next" href="javascript:void(0)" onclick="getTeamUserInfoList(event,${endBlock + 1})"><span aria-hidden="true">&raquo;</span></a></li>`;
	}

	document.querySelector('#pageDiv').innerHTML = pageHtml;

	let html = '';
	if (pageInfos.list.length == 0) {
		html += '<tr><td colspan="5">비어있는 리스트 입니다.</td></tr>';
	} else {
		for (let matchStatus of pageInfos.list) {
			if (matchStatus.mrRequestStatus == '0') {
				html += '<li>';
				html += `<span>${matchStatus.mdDate}||${matchStatus.mdTime}</span>`;
				html += `<span>${matchStatus.taName}</span>`;
				html += `<span>${matchStatus.mdAddress}</span>`;
				html += `<span>상대팀 입력 대기중</span>`;
				html += `</li>`;
			}
			if (matchStatus.mrRequestStatus == '1') {
				html += '<li>';
				html += `<span>${matchStatus.mdDate}||${matchStatus.mdTime}</span>`;
				html += `<span>${matchStatus.taName}</span>`;
				html += `<span>${matchStatus.mdAddress}</span>`;
				html += `<span>${matchStatus.mrHomeScore} : ${matchStatus.mrAwayScore}</span>`;
				html += `<button class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#mannerModal" onclick="saveMrNum(${matchStatus.mrNum})">수락</button>`;
				html += `<button class="btn btn-dark" onclick="saveMrNum(${matchStatus.mrNum},1)">거절</button>`;
				html += `</li>`;
			} if (matchStatus.mrRequestStatus == '2') {
				html += '<li>';
				html += `<span>${matchStatus.mdDate}||${matchStatus.mdTime}</span>`;
				html += `<span>${matchStatus.taName}</span>`;
				html += `<span>${matchStatus.mdAddress}</span>`;
				html += `<span>재입력 대기중 </span>`;
				html += `</li>`;
			} if (matchStatus.mrRequestStatus == '3') {
				//상태 검사
				html += '<li>';
				html += `<span>${matchStatus.mdDate}||${matchStatus.mdTime}</span>`;
				html += `<span>${matchStatus.taName}</span>`;
				html += `<span>${matchStatus.mdAddress}</span>`;
				html += `<span>${matchStatus.mrHomeScore} : ${matchStatus.mrAwayScore}</span>`;
				html += `<span>${matchStatus.mrWinLoose}</span>`;
				html += `</li>`;
			}

		}
	}
	document.querySelector('#match-list').innerHTML = html;

}

function saveMrNum(mrNum, check) {
	this.mrNum = mrNum;
	console.log(mrNum);
	if(check != null || check != undefined){
		updateMatchResultCancle();
	}
}

async function updateMatchResultCancle(){
	let mrNum = this.mrNum;
	const body = {
		mrNum: mrNum,
		mrRequestStatus: '2'
	};
	const res = await fetch(`/match-result-infos`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body)
	});
	const result = await res.json();
	alert(result.resultMsg)
	location.reload();
} 

async function updateMatchResultAccept() {
	let mrNum = this.mrNum;
	let homeMannerPoint = document.querySelector('#mannerPointInput2').value;
	console.log(homeMannerPoint);
	const body = {
		mrNum: mrNum,
		mrHomeMannerPoint: homeMannerPoint,
		mrRequestStatus: '3'
	};
	const res = await fetch(`/match-result-infos`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body)
	});
	const result = await res.json();
	alert(result.resultMsg)
	location.reload();
}




async function updateFirstMatchResult() {
	let homeScore = document.querySelector('#homeScoreInput').value;
	let awayScore = document.querySelector('#awayScoreInput').value;
	let awayMannerPoint = document.querySelector('#mannerPointInput').value;
	let mrNum = this.mrNum;

	const body = {
		mrNum: mrNum,
		mrHomeScore: homeScore,
		mrAwayScore: awayScore,
		mrAwayMannerPoint: awayMannerPoint,
		mrRequestStatus: '1'
	};
	const res = await fetch(`/match-result-infos`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body)
	});
	const result = await res.json();
	alert(result.resultMsg)
	location.reload();
}

window.addEventListener('load', getHomeAjaxList());


/* 
// 팀 이름을 메인 화면에 설정
document.querySelector('#team-name').innerText = 'Team Name';

// Membership 모달에서 팀 이름 설정


// 확인 버튼을 클릭하면 alert 표시, 모달 숨김, 그리고 페이지 새로고침
document
	.querySelector('#confirmMembershipBtn')
	.addEventListener('click', function() {
		$('#membershipModal').modal('hide'); // 모달 숨기기 // 알림 표시
	});

window.addEventListener('load', async function() {
	try {
		console.log(taNum);
		const recordRes = await fetch(`/match-result/match-result-home-infos/${taNum}`);
		if (!recordRes.ok) {
			throw new Error(`HTTP 에러: ${recordRes.status}`);
		}

		matchData = await recordRes.json();
		console.log("matchData", matchData);

		// 데이터를 가져온 후에 매치 리스트를 렌더링
		renderMatchList();
	} catch (error) {
		console.error('데이터를 가져오는 중 에러 발생:', error);
	}
});

// 매치 리스트 렌더링 함수
async function renderMatchList() {
	const matchList = document.querySelector('#match-list');

	const teamInfoResponse = await fetch(`/match-result/match-result-home-infos/${taNum}`);
	const teamInfo = await teamInfoResponse.json();

	console.log("teamInfo", teamInfo[0].taType);

	// 기존 매치 아이템 삭제
	matchList.innerHTML = '';

	// 받아온 데이터를 이용하여 매치 아이템 생성
	matchData.forEach(match => {
		if (match.rsType === teamInfo[0].taType) {
			const matchItem = createMatchItem(match);

			matchItem.classList.add('match-item');
			matchList.appendChild(matchItem);
		}
	});
}

let matchEndButtons = [];

function createMatchItem(record) {
	const matchItem = document.createElement('li');
	const matchDate = document.createElement('span');
	const matchArena = document.createElement('span');
	const matchOpponent = document.createElement('span');
	const matchScore = document.createElement('span');
	const matchStatus = document.createElement('span');

	const date = record.rsDate;
	const time = record.rsTime;

	matchDate.innerHTML = `${date}<br>${time}`;
	matchArena.textContent = record.rsAddress;
	matchOpponent.textContent = record.rsTmName;
	matchScore.textContent = '경기 시작 전';

	const matchStatusResult = record.rsMatchStatus;
	console.log("record:", record.rsAddress);
	switch (matchStatusResult) {
		case "0":
			matchScore.textContent = '경기 시작 전';
			matchItem.style.backgroundColor = '#EAEAEA';
			matchScore.style.color = '#000000';
			matchScore.style.fontSize = '16px';
			matchScore.style.fontWeight = '500';
			// 경기 시작 전이면 '경기종료' 버튼 생성
			matchEndButton = document.createElement('button');
			matchEndButton.textContent = '경기종료';
			matchEndButton.style.fontSize = '14px';
			matchEndButton.style.padding = '7px 12px';
			matchEndButton.style.border = 'none';
			matchEndButton.style.borderRadius = '10px';
			matchEndButton.style.background = '#000';
			matchEndButton.style.color = '#fff';
			matchEndButton.style.margin = '3px';
			matchEndButton.addEventListener('click', openModal);
			matchStatus.appendChild(matchEndButton);
			matchEndButtons.push(matchEndButton);
			break;
		case "1":
			matchScore.textContent = getRandomScore(true);
			matchScore.style.color = '#0066FF';
			matchScore.style.fontSize = '32px';
			matchScore.style.fontWeight = '500';
			matchItem.style.backgroundColor = '#D9E5FF';
			matchStatus.textContent = 'W';
			matchStatus.style.color = '#0066FF';
			matchStatus.style.fontSize = '36px';
			matchStatus.style.fontWeight = '600';
			break;
		case "2":
			matchScore.textContent = getRandomScore(false);
			matchItem.style.backgroundColor = '#FFE6E6';
			matchScore.style.color = '#FF5C5C';
			matchScore.style.fontSize = '32px';
			matchScore.style.fontWeight = '500';
			matchStatus.textContent = 'L';
			matchStatus.style.color = '#FF5C5C';
			matchStatus.style.fontSize = '36px';
			matchStatus.style.fontWeight = '600';
			break;
	}

	matchItem.classList.add('match-item');
	matchItem.appendChild(matchDate);
	matchItem.appendChild(matchArena);
	matchItem.appendChild(matchOpponent);
	matchItem.appendChild(matchScore);
	matchItem.appendChild(matchStatus);

	return matchItem;
}

// for (let i = 0; i < 5; i++) {
//     createMatchItem(matchData);
// }

function openModal() {
	const scoreModal = document.querySelector('#scoreModal');
	$(scoreModal).modal('show');
}

// matchEndButtons 배열에 대한 이벤트 리스너 추가
matchEndButtons.forEach((button) => {
	button.addEventListener('click', function() {
		openModal();
	});
});

let isSaving = false; // 중복 저장 방지를 위한 변수

function saveMatchResult() {
	if (isSaving) {
		// 이미 저장 중이면 더 이상 실행하지 않음
		return;
	}

	// 중복 저장을 방지하기 위해 변수 업데이트
	isSaving = true;

	// 입력된 값 가져오기
	const homeScore = parseInt(document.querySelector('#homeScoreInput').value);
	const awayScore = parseInt(document.querySelector('#awayScoreInput').value);

	// 유효성 검사 - 입력된 값이 모두 숫자인지 확인
	if (isNaN(homeScore) || isNaN(awayScore)) {
		alert('올바른 숫자를 입력해주세요.');
		// 중복 저장 방지 변수 초기화
		isSaving = false;
		return;
	}

	// 콘솔에 home, away 점수 출력
	console.log('Home Score:', homeScore);
	console.log('Away Score:', awayScore);

	// 새로운 matchItem 생성
	const matchItem = document.createElement('li');
	const matchDate = document.createElement('span');
	const matchArena = document.createElement('span');
	const matchOpponent = document.createElement('span');
	const matchScore = document.createElement('span');
	const matchStatus = document.createElement('span');

	// 여기서부터는 기존 코드를 참고하여 날짜, 시간, 경기장, 상대팀, 점수, 상태 설정
	const date = getRandomDate();
	const time = getRandomTime();

	matchDate.innerHTML = `${date}<br>${time}`;
	matchArena.textContent = getRandomArena();
	matchScore.textContent = `${homeScore} : ${awayScore}`;
	matchOpponent.textContent = getRandomOpponent();

	// 경기 결과에 따라 승/무/패 상태 설정
	if (homeScore > awayScore) {
		matchStatus.textContent = 'W'; // 이기면 'W'
		matchStatus.style.color = '#0066FF';
		matchStatus.style.fontSize = '36px';
		matchStatus.style.fontWeight = '600';
		matchItem.style.backgroundColor = '#D9E5FF';
		matchScore.style.fontSize = '32px';
		matchScore.style.color = '#0066FF';
		matchScore.style.fontWeight = '500';
	} else if (homeScore < awayScore) {
		matchStatus.textContent = 'L'; // 지면 'L'
		matchStatus.style.color = '#FF5C5C';
		matchStatus.style.fontSize = '36px';
		matchStatus.style.fontWeight = '600';
		matchItem.style.backgroundColor = '#FFE6E6';
		matchScore.style.fontSize = '32px';
		matchScore.style.color = '#FF5C5C';
		matchScore.style.fontWeight = '500';
	} else {
		matchStatus.textContent = 'D'; // 비기면 'D'
		matchStatus.style.color = '#7aff5c';
		matchStatus.style.fontSize = '36px';
		matchStatus.style.fontWeight = '600';
		matchItem.style.backgroundColor = '#EAEAEA';
		matchScore.style.fontSize = '32px';
		matchScore.style.fontWeight = '500';
	}

	// matchItem에 각 요소 추가
	matchItem.classList.add('match-item');
	matchItem.appendChild(matchDate);
	matchItem.appendChild(matchArena);
	matchItem.appendChild(matchOpponent);
	matchItem.appendChild(matchScore);
	matchItem.appendChild(matchStatus);

	// matchList에 matchItem 추가
	matchList.appendChild(matchItem);

	// 모달 닫기
	$('#scoreModal').modal('hide');

	// 경기 결과 저장 완료 알림
	alert('경기 결과가 저장되었습니다.');

	// 중복 저장 방지 변수 초기화
	isSaving = false;
}

// 저장 버튼을 눌렀을 때의 동작
document.querySelector('#confirmButton').addEventListener('click', function() {
	// 경기 종료 상태인지 확인
	const matchItem = document.querySelector('.match-item');
	const isMatchEnd = matchItem.classList.contains('match-end');

	if (isMatchEnd) {
		const homeScore = parseInt(document.querySelector('#homeScoreInput').value);
		const awayScore = parseInt(document.querySelector('#awayScoreInput').value);
		const matchStatus = document.querySelector('.match-item .match-status');

		// 결과에 따라 승패 상태 변경
		if (homeScore > awayScore) {
			matchStatus.textContent = 'W';
			matchStatus.style.color = '#0066FF';
			matchStatus.style.fontSize = '36px';
			matchStatus.style.fontWeight = '600';
		} else if (homeScore < awayScore) {
			matchStatus.textContent = 'L';
			matchStatus.style.color = '#FF5C5C';
			matchStatus.style.fontSize = '36px';
			matchStatus.style.fontWeight = '600';
		}
	}
	document
		.querySelector('#confirmButton')
		.removeEventListener('click', handleConfirmMembershipBtnClick);
});

// 모달의 확인 버튼을 눌렀을 때의 동작
function handleConfirmMembershipBtnClick() {
	// 확인 버튼에 대한 이벤트 리스너 제거
	document
		.querySelector('#confirmMembershipBtn')
		.removeEventListener('click', handleConfirmMembershipBtnClick);

	// 모달 숨기기
	$('#membershipModal').modal('hide');

	// 알림 표시
	alert('가입신청이 완료되었습니다.');

	// 이벤트 리스너 제거
	document
		.querySelector('#confirmMembershipBtn')
		.off('click', handleConfirmMembershipBtnClick);
}

// '경기종료' 버튼을 클릭했을 때의 동작
function handleMatchEndButtonClick() {
	// 모달 열기
	openModal();

	// 모달에서 스코어 입력 후의 동작
	document
		.querySelector('#confirmButton')
		.addEventListener('click', function() {
			// 경기 종료 상태인지 확인
			const matchItem = document.querySelector('.match-item');
			const isMatchEnd = matchItem.classList.contains('match-end');

			if (isMatchEnd) {
				// 결과에 따라 승패 상태 변경
				const homeScore = parseInt(
					document.querySelector('#homeScoreInput').value
				);
				const awayScore = parseInt(
					document.querySelector('#awayScoreInput').value
				);

				if (!isNaN(homeScore) && !isNaN(awayScore)) {
					let matchStatus = matchItem.querySelector('.match-status');

					// match-status가 없다면 동적으로 생성
					if (!matchStatus) {
						matchStatus = document.createElement('span');
						matchStatus.classList.add('match-status');
						matchItem.appendChild(matchStatus);
					}

					if (homeScore > awayScore) {
						matchStatus.textContent = 'W';
						matchStatus.style.color = '#0066FF';
						matchStatus.style.fontSize = '36px';
						matchStatus.style.fontWeight = '600';
					} else if (homeScore < awayScore) {
						matchStatus.textContent = 'L';
						matchStatus.style.color = '#FF5C5C';
						matchStatus.style.fontSize = '36px';
						matchStatus.style.fontWeight = '600';
					}

					// 경기 결과 저장 함수 호출
					saveMatchResult(matchItem);
				} else {
					alert('올바른 숫자를 입력해주세요.');
				}
			}
		});
}
*/