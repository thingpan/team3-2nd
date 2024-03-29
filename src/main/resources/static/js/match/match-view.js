let oponentTaName;
const urlParams = new URL(location.href).searchParams;
const mbNum = urlParams.get('mbNum');
let matchInfo;
let teamList;
let selectedTeamNum;

document.addEventListener('DOMContentLoaded', function () {
    const sliderContainer = document.querySelector('#slider-container');
    const prevBtn = document.querySelector('#prev-btn');
    const nextBtn = document.querySelector('#next-btn');

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
        const response = await fetch(`/auth/match-infos/${mbNum}`);
        const matchPhoto = await response.json();
        console.log("matchPhoto", matchPhoto);

        const matchPhotos = matchPhoto.matchPhotos;
        return matchPhotos;
    }

    async function initializeSlider() {
        const matchPhotos = await fetchMatchPhotos();

        if (matchPhotos.length === 1) {
            const prevBtn = document.querySelector('#prev-btn');
            if (prevBtn) {
                prevBtn.style.display = 'none';
            }

            const nextBtn = document.querySelector('#next-btn');
            if (nextBtn) {
                nextBtn.style.display = 'none';
            }
        }

        if (matchPhotos.length === 0) {
            console.log(matchPhotos.length);

            // 이미지가 없을 경우 이미지 없음 텍스트 출력
            const img = document.createElement('div');
            img.style.width = '100%';
            img.style.height = '350px';
            img.style.borderRadius = '10px';
            img.style.backgroundColor = '#e1e1e1';
            img.style.display = 'flex';
            img.style.alignItems = 'center';
            img.style.justifyContent = 'center';

            // 텍스트 추가
            const text = document.createElement('span');
            text.textContent = '등록된 사진이 없습니다.';
            text.style.color = '#555';
            text.style.fontSize = '18px';

            img.appendChild(text);
            sliderContainer.appendChild(img);

            console.log("매치 포토", matchPhotos.length);

            const prevBtn = document.querySelector('#prev-btn');
            if (prevBtn) {
                prevBtn.style.display = 'none';
            }

            const nextBtn = document.querySelector('#next-btn');
            if (nextBtn) {
                nextBtn.style.display = 'none';
            }
        } else {
            matchPhotos.forEach(photo => {
                const img = document.createElement('img');

                if (photo.mbpFilePath) {
                    img.src = photo.mbpFilePath;
                }

                sliderContainer.appendChild(img);
            });

            showSlide(currentSlide);

            prevBtn.addEventListener('click', prevSlide);
            nextBtn.addEventListener('click', nextSlide);
        }
    }

    initializeSlider();
});

window.addEventListener('load', async function () {
    const res = await fetch(`/auth/match-infos/${mbNum}`);
    matchInfo = await res.json();

    const mbPayElement = document.querySelector('#formattedMbPay');
    const rawMbPay = matchInfo.mbPay; // 서버에서 받아온 mbPay 값
    const formattedMbPay = addCommas(rawMbPay);

    mbPayElement.textContent = formattedMbPay;

    console.log("matchInfo", matchInfo);
    const today = new Date(); // 현재 날짜
    today.setHours(0, 0, 0, 0); // 오늘 날짜의 시간을 00:00:00으로 설정

    if (matchInfo.mbStatus == 1 || matchInfo == null) {
        alert('신청 마감된 매치입니다.')
        this.location.href = '/page/match/match-board';
    } else if (matchInfo.activityStatus == 1) {
        alert('삭제된 매치입니다')
        this.location.href = '/page/match/match-board';
    } else if (new Date(matchInfo.mbDate) < today) {
        alert('기간이 지난 매치입니다')
        this.location.href = '/page/match/match-board';
    }

    function addCommas(number) {
        const numericValue = number.toString().replace(/[^\d]/g, ''); // 문자열로 변환 후 숫자 이외의 문자 제거
        return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    matchPhotos = matchInfo.matchPhotos;

    const teamRes = await fetch(`/auth/team-infos/admin/${matchInfo.mbType}`);
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

    const teamListRes = await fetch(`/auth/team-infos/${taNum}`);
    const teamInfoList = await teamListRes.json();


    const scoreValue = document.querySelector('#score-value');
    const nameValue = document.querySelector('#taName');

    const taName = teamInfoList.taName;
    const teamPoint = teamInfoList.taPoint;

    if (teamInfoList.uiNum == document.querySelector('#matchViewUiNum').innerHTML) {
        document.querySelector('#updateAndDeleteButton').innerHTML = '<button class="btn btn-dark" id="modifyBtn" onclick="doGoUpdatePage()">수정</button><button class="btn btn-dark" id="deleteBtn" onclick="matchboarddelete()">삭제</button>'
    }

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
    var mapContainer = document.querySelector('#map'), // 지도를 표시할 div
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
}

//쪽지 보내기 div 생성
function doMakePostMessageDiv() {
    document.querySelector('#send-button').innerHTML = null;
    document.querySelector('#send-button').innerHTML = `<button onclick="matchRequest()" class="btn btn-dark">신청하기</button>`;
    document.querySelector('#post-message-info').innerHTML = null;
}

async function matchboarddelete() {
    const data = {
        mbNum: mbNum
    }
    const response = await fetch(`/auth/match-infos/delete`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const userConfirmed = window.confirm('매치글을 삭제하시겠습니까?');

    if (userConfirmed) {
        const errorMessage = await response.json();

        if (errorMessage === 1) {
            alert('삭제가 완료되었습니다.');
            location.href = '/page/match/match-board';
        }
    }
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
            const response = await fetch('/auth/match-deal-infos', {
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

                // 매치 신청이 완료되면 match-board 페이지로 이동
                location.href = '/page/match/match-board';
            }
        }
    }
}

function goTeamPage(obj) {
    location.href = `/page/team/team-record?taNum=${obj.value}`;
}

function doGoUpdatePage() {
    location.href = `/page/match/match-update-view?mbNum=${mbNum}`;
}