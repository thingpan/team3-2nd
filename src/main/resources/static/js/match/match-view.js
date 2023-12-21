let oponentTaName;
let myTaName;
const urlParams = new URL(location.href).searchParams;
const mbNum = urlParams.get('mbNum');
let matchInfo;
let teamList;
let selectedTeamNum;
let currentSlide = 0;
let slides;
let slideCount;

console.log('Slide Count:', slideCount);

document.addEventListener('DOMContentLoaded', function () {
	const sliderContainer = document.getElementById('slider-container');
	const prevBtn = document.getElementById('prev-btn');
	const nextBtn = document.getElementById('next-btn');

	let currentSlide = 0;

	function showSlide(n) {
		const slides = document.querySelectorAll('#slider-container img');
		slides.forEach((slide, index) => {
			slide.style.display = index === n ? 'block' : 'none';
		});
	}

	function prevSlide() {
		currentSlide = (currentSlide - 1 + matchPhotos.length) % matchPhotos.length;
		showSlide(currentSlide);
	}

	function nextSlide() {
		currentSlide = (currentSlide + 1) % matchPhotos.length;
		showSlide(currentSlide);
	}

	async function fetchMatchPhotos() {
		const response = await fetch(`/match-view/${mbNum}`);
		const matchPhoto = await response.json();
		console.log("matchPhoto", matchPhoto);

		const matchPhotos = matchPhoto.matchPhotos;
		console.log("matchPhotos", matchPhotos);
		return matchPhotos;
	}

	async function initializeSlider() {
		const matchPhotos = await fetchMatchPhotos();

		matchPhotos.forEach(photo => {
			const img = document.createElement('img');
			img.src = photo.mbpFilePath;
			sliderContainer.appendChild(img);
		});

		showSlide(currentSlide);

		prevBtn.addEventListener('click', prevSlide);
		nextBtn.addEventListener('click', nextSlide);
	}

	initializeSlider();
});

window.addEventListener('load', async function () {
	const res = await fetch(`/match-view/${mbNum}`);
	matchInfo = await res.json();

	console.log("matchInfo", matchInfo);

	matchPhotos = matchInfo.matchPhotos;

	const teamRes = await fetch(`/my-team-infos-by-type/${matchInfo.mbType}`);
	teamList = await teamRes.json();

	oponentTaName = matchInfo.taName;
	let typeFileName;
	if (matchInfo.mbType == '농구') {
		typeFileName = 'basketball';
	} else if (matchInfo.mbType == '야구') {
		typeFileName = 'baseball';
	} else {
		typeFileName = 'soccerball';
	}

	document.querySelector('.select-team').innerHTML = `<img src="/imgs/${typeFileName}.png"></img>`;
	document.querySelector('.team-info').value = matchInfo.taNum;
	console.log("team-info!", document.querySelector('.team-info').value);
	for (let key in matchInfo) {
		if (document.querySelector(`#${key}`) != null) {
			document.querySelector(`#${key}`).innerHTML = matchInfo[key];
		}
	}

	for (const team of teamList) {
		console.log("away team을 찾아서", team.taNum);
		let html = '';
		if (matchInfo.mbType == team.taType) {
			if (team.taType == '농구') {
				type = 'basketball';
			} else if (team.taType == '야구') {
				type = 'baseball';
			} else if (team.taType == '축구') {
				type = 'soccerball';
			}
			html += '<div id="team-list-div" style="display: inline-block; margin: 0 auto;">'
			html += `<button onclick="selectedTeam(${team.taNum}, '${team.taName}')" value="${team.taNum}" id="team${team.taNum}">`;
			if (team.taFilePath != null && team.taFilePath != '') {
				html += `<img src="${team.taFilePath}">`;
			} else {
				html += `<img src="/imgs/${type}.png">`;
			}
			html += '</button>';
			html += `<span>${team.taName}<span>`;
			html += '</div>';
		}
		document.querySelector('.team-list').innerHTML += html;
	}

	const taNum = matchInfo.taNum;
	console.log("이거멍미:", taNum);

	const teamListRes = await fetch(`/team-info?taNum=${taNum}`);
	const teamInfoList = await teamListRes.json();

	const scoreValue = document.querySelector('#score-value');
	const nameValue = document.querySelector('#taName');

	const taName = teamInfoList.taName;
	const teamPoint = teamInfoList.taPoint;

	nameValue.innerHTML = `${taName}`;
	scoreValue.innerHTML = `${teamPoint}점`;

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
// *window 마지막 부분

//팀 선택시 팀 번호 저장
function selectedTeam(taNum, taName) {
	let myTeams = document.querySelectorAll('.team-list button');
	for (i = 0; i < myTeams.length; i++) {
		myTeams[i].style.backgroundColor = "gray";
	}
	document.querySelector(`#team${taNum}`).style.backgroundColor = "black";
	doMakePostMessageDiv();
	selectedTeamNum = taNum;

	document.querySelector('#post-message-oponentName').innerHTML = oponentTaName;
	document.querySelector('#post-message-info-oponentName').innerHTML = oponentTaName;
	document.querySelector('#post-message-taName').innerHTML = taName;
}

//쪽지 보내기 div 생성
function doMakePostMessageDiv() {
	document.querySelector('#send-button').innerHTML = null;
	document.querySelector('#send-button').innerHTML = `<button onclick="matchRequest()" class="btn btn-dark">신청하기</button>`;
	document.querySelector('#post-message-info').innerHTML = null;
}

async function matchRequest() {
	console.log("넌뭐냐", selectedTeamNum);
	if (selectedTeamNum == undefined) {
		alert('팀을 선택해 주세요!');
	} else {
		// 이미 신청된 게시물인지 확인 로직 추가
		const matchDealInfo = { // 선택된 팀 번호
			mbNum: mbNum, // 매치 보드 번호
			mdHomeNum: matchInfo.taNum,
			mdAwayNum: selectedTeamNum,
			mdAddress: matchInfo.mbAddressDetail,
			mdTime: matchInfo.mbTime,
			mdDate: matchInfo.mbDate,
			mdType: matchInfo.mbType,
			mdMatchStatus: 1
		};

		console.log("matchDealInfo: ", matchDealInfo);
		if (matchInfo.taNum == selectedTeamNum) {
			alert('같은 팀은 매칭 할 수 없습니다');
		} else {
			const response = await fetch('/math-deal-infos', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(matchDealInfo),
			});
			const errorMessage = await response.json();
			if (!response.ok) {
				console.log(errorMessage);
				console.error('오류 메시지:', errorMessage);
			} else {
				console.log(errorMessage);
				alert(errorMessage.resultMsg);
				location.reload();
			}
		}
	}
}

function goTeamPage(obj) {
	location.href = `/page/team/record?taNum=${obj.value}`;
}

//쪽지 보내기
async function sendPostMessage() {
	const param = {}
}