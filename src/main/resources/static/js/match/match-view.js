let oponentTaName;
let myTaName;
const urlParams = new URL(location.href).searchParams;
const mbNum = urlParams.get('mbNum');


window.addEventListener('load', async function() {
	const res = await fetch(`/match-view/${mbNum}`);

	const matchInfo = await res.json();
	console.log("matchInfo", matchInfo);

	const teamRes = await fetch(`/my-team-infos-by-type/${matchInfo.mbType}`);
	const teamList = await teamRes.json();

	
	oponentTaName = matchInfo.taName;
	let typeFileName;
	if(matchInfo.mbType == '농구'){
		typeFileName = 'basketball';
	}else if(matchInfo.mbType == '야구'){
		typeFileName = 'baseball';
	}else{
		typeFileName = 'soccer';
	}

	document.querySelector('.select-team').innerHTML = `<img src="/imgs/${typeFileName}.png"></img>`;
	document.querySelector('.team-info').value = matchInfo.taNum;
	console.log("team-info", document.querySelector('.team-info').value);
	for (let key in matchInfo) {
		if (document.querySelector(`#${key}`) != null) {
			document.querySelector(`#${key}`).innerHTML = matchInfo[key];
		}
	}

	for (const team of teamList) {
		let html = '';
		if (matchInfo.mbType == team.taType) { 
			html += '<div id="team-list-div" style="display: inline-block; margin: 0 auto;">'
			html += `<button onclick="selectedTeam(${team.taNum}, '${team.taName}')" value="${team.taNum}" id="team${team.taNum}">`;
			html += '</button>';
			html += `<span>${team.taName}<span>`;
			html += '</div>';
		}
		document.querySelector('.team-list').innerHTML += html;
	}
	// 게시글 올린 팀 점수 배지 표시
	const scoreValue = document.querySelector('#score-value');
	const teamPoint = matchInfo.riPoint;
	scoreValue.innerHTML = `${teamPoint}점`;

	// 점수에 따라 배경색과 텍스트색 변경
	if (teamPoint <= 100) {
		scoreValue.style.backgroundColor = '#ececec';
		scoreValue.style.color = '#767676';
	} else if (teamPoint <= 200) {
		scoreValue.style.backgroundColor = '#ede0c4';
		scoreValue.style.color = '#825e01';
	} else if (teamPoint <= 300) {
		scoreValue.style.backgroundColor = '#fffbd5';
		scoreValue.style.color = '#ffb800';
	} else if (teamPoint <= 400) {
		scoreValue.style.backgroundColor = '#e6f0ff';
		scoreValue.style.color = '#0066ff';
	} else {
		scoreValue.style.backgroundColor = '#f4e2ff';
		scoreValue.style.color = '#8200d2';
	}

	// 지도파트!!
	var mapContainer = document.getElementById('map'), // 지도를 표시할 div
		mapOption = {
			center: new kakao.maps.LatLng(matchInfo.mbMapY, matchInfo.mbMapX), // 지도의 중심좌표
			level: 3 // 지도의 확대 레벨
		};

	var map = new kakao.maps.Map(mapContainer, mapOption);


	// 마커가 표시될 위치입니다
	var markerPosition = new kakao.maps.LatLng(matchInfo.mbMapY, matchInfo.mbMapX);

	// 마커를 생성합니다
	var marker = new kakao.maps.Marker({
		position: markerPosition
	});

	// 마커가 지도 위에 표시되도록 설정합니다
	marker.setMap(map);

	var iwContent = `<div style="padding:5px;">${matchInfo.mbAddress} <br> <a href="https://map.kakao.com/link/to/${matchInfo.mbAddress},${matchInfo.mbMapY},${matchInfo.mbMapX}" style="color:blue" target="_blank">길찾기</a></div>`;
	var iwPosition = new kakao.maps.LatLng(matchInfo.mbMapY, matchInfo.mbMapX); //인포윈도우 표시 위치입니다

	// 인포윈도우를 생성합니다
	var infowindow = new kakao.maps.InfoWindow({
		position: iwPosition,
		content: iwContent
	});

	// 마커 위에 인포윈도우를 표시합니다. 두번째 파라미터인 marker를 넣어주지 않으면 지도 위에 표시됩니다
	infowindow.open(map, marker);
})

//팀 선택시 팀 번호 저장
function selectedTeam(taNum, taName) {
	let myTeams = document.querySelectorAll('.team-list button');
	for (i = 0; i < myTeams.length; i++) {
		myTeams[i].style.backgroundColor = "gray";
	}
	document.querySelector(`#team${taNum}`).style.backgroundColor = "black";
	doMakePostMessageDiv();

	document.querySelector('#post-message-oponentName').innerHTML = oponentTaName;
	document.querySelector('#post-message-info-oponentName').innerHTML = oponentTaName;
	document.querySelector('#post-message-taName').innerHTML = taName;
}

//쪽지 보내기 div 생성
function doMakePostMessageDiv() {
	document.querySelector('#send-button').innerHTML = null;
	document.querySelector('#send-button').innerHTML = `<button onclick="matchRequest()" class="btn btn-dark">신청하기</button>`;
	document.querySelector('#post-message-info').innerHTML = null;
	document.querySelector('#post-message-info').innerHTML += `
			<hr><div>
					<span id="post-message-info-oponentName"></span><span>팀 에게 궁금한 점을 물어보세요!</span>
					</div>
					<div>
						<button type="button" class="btn btn-dark" data-bs-toggle="modal"
							data-bs-target="#post-message-modal">
							쪽지 보내기
						</button>
					</div>`
}

function matchRequest() {
	if (selectedTeamNum == undefined) {
		alert('팀을 선택해 주세요!');
	} else {
		alert('이미 신청된 게시물인지도 확인 해야함')
	}
}

function goTeamPage(obj) {
	location.href = `/page/team/record?taNum=${obj.value}`;
}

//쪽지 보내기
async function sendPostMessage() {
	const param = {}
}
