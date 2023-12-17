let matchData = [];
let teamInfo;
let awayTeamName;

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.opacity = '0';
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.opacity = '1';
        header.style.transform = 'translateY(0)';
    }
});

async function fetchMatchDealInfo() {
    try {
        // url 주소에서 taNum을 가져옴
        const urlParams = new URLSearchParams(window.location.search);
        const taNum = urlParams.get('taNum');

        const response = await fetch('/match-deal/home-team/' + taNum);
        if (!response.ok) {
            throw new Error('서버에서 매칭현황을 가져오는 중 오류 발생: ' + response.statusText);
        }

        const homeTeamMatchDealInfo = await response.json();
        return homeTeamMatchDealInfo;
    } catch (error) {
        console.error('홈팀 매칭현황 가져오다 오류:', error);
        throw error;
    }
}

window.addEventListener('load', async function () {
    try {
        const matchDealInfo = await fetchMatchDealInfo();
        createMatchTable(matchDealInfo);

        const teamInfoResponse = await fetch(`/team-infos`);
        const teamInfo = await teamInfoResponse.json();

        // url 주소에서 taNum을 가져옴
        const urlParams = new URLSearchParams(window.location.search);
        const taNum = urlParams.get('taNum');

        const homeTeamMatchDealInfo = await fetchMatchDealInfo(taNum);

        createMatchTable(homeTeamMatchDealInfo);
        console.log("homeTeamMatchDealInfo", homeTeamMatchDealInfo);

        // teamInfo 배열에서 taNum에 해당하는 taName 받아오기
        document.querySelector('#team-name').innerText = teamInfo.find(team => team.taNum.toString() === taNum).taName;

        // teamInfo에서 받아온 taNum에 해당하는 taPoint 받아오기
        const teamScore = teamInfo.find(team => team.taNum.toString() === taNum).taPoint;

        const scoreValue = document.querySelector('#score-value');
        scoreValue.textContent = `${teamScore}점`;

        // 점수에 따라 배경 색상 변경
        if (teamScore <= 100) {
            scoreValue.style.backgroundColor = '#ececec';
            scoreValue.style.color = '#767676';
        } else if (teamScore <= 200) {
            scoreValue.style.backgroundColor = '#ede0c4';
            scoreValue.style.color = '#825e01';
        } else if (teamScore <= 300) {
            scoreValue.style.backgroundColor = '#fffbd5';
            scoreValue.style.color = '#ffb800';
        } else if (teamScore <= 400) {
            scoreValue.style.backgroundColor = '#e6f0ff';
            scoreValue.style.color = '#0066ff';
        } else {
            scoreValue.style.backgroundColor = '#f4e2ff';
            scoreValue.style.color = '#8200d2';
        }
    } catch (error) {
        console.error('매칭현황 로딩 오류?인가: ', error.message);
    }
});

async function createMatchTable(data) {
    const tableBody = document.querySelector('.match--table tbody');
    const filterSelect = document.querySelector('#sport-filter');
    const selectedValue = filterSelect.value;

    tableBody.innerHTML = '';

    for (const match of data) {
        const teamInfoResponse = await fetch(`/team-infos`);
        const teamInfo = await teamInfoResponse.json();

        // mdAwayNum에 해당하는 taName 찾아오기
        const teamName = teamInfo.find(team => team.taNum.toString() === match.mdAwayNum.toString()).taName;

        const row = document.createElement('tr');
        const stadiumCell = document.createElement('td');
        stadiumCell.textContent = match.mdAddress;
        row.appendChild(stadiumCell);

        const opponentCell = document.createElement('td');
        opponentCell.textContent = teamName;
        row.appendChild(opponentCell);

        const dateCell = document.createElement('td');
        dateCell.textContent = `${match.mdDate} | ${match.mdTime}`;
        row.appendChild(dateCell);

        const statusCell = document.createElement('td');

        if (
            (selectedValue === 'home' && match.mdMatchStatus === '0') ||
            (selectedValue === 'away' && match.mdMatchStatus === '1') ||
            selectedValue === '0'
        ) {
            if (selectedValue === 'home' && match.mdMatchStatus === '0') {
                // 'home' 상태일 때는 select 옵션을 추가
                const select = document.createElement('button');
                select.classList.add('status-button');
                select.innerHTML =
                    `<button id="accept-button" onclick="statusButtonAcceptAlert(${match.mdNum})" value="accept">수락</button>` +
                    `<button id="refuse-button" onclick="statusButtonDefuseAlert(${match.mdNum})" value="refuse">거절</button>`

                statusCell.appendChild(select);
            } else if (selectedValue === 'away' && match.mdMatchStatus === '1') {
                // 'away' 상태일 때는 뱃지를 추가
                const badge = document.createElement('span');
                badge.classList.add('filter-badge');

                if (match.filterStatus) {
                    switch (match.filterStatus) {
                        case 'accept':
                            badge.textContent = '수락';
                            badge.style.backgroundColor = '#E6F0FF';
                            badge.style.color = '#0066FF';
                            break;
                        case 'refuse':
                            badge.textContent = '거절';
                            badge.style.backgroundColor = '#FFE6E6';
                            badge.style.color = '#FF5C5C';
                            break;
                        default:
                            badge.textContent = '대기중';
                            badge.style.backgroundColor = '#ECECEC';
                            badge.style.color = '#767676';
                            break;
                    }

                    statusCell.appendChild(badge);
                } else {
                    statusCell.textContent = '데이터 에러~';
                }
            }
        }

        row.appendChild(statusCell);
        tableBody.appendChild(row);
    }
}

async function getLoggedInTeamNum() {
    try {
        // url 주소에서 taNum을 가져옴
        const urlParams = new URLSearchParams(window.location.search);
        const taNum = urlParams.get('taNum');

        if (taNum != null) {
            const loggedInTeamNum = taNum;
            console.log(taNum);
            return loggedInTeamNum;
        } else {
            console.error('로그인 상태를 확인하는 중 오류 발생:');
            return null;
        }
    } catch (error) {
        console.error('로그인 상태를 확인하는 중 예외 발생:', error);
        return null;
    }
}

async function statusButtonAcceptAlert(mdNum) {
    try {
        if (!mdNum) {
            console.error('statusButtonAcceptAlert: mdNum이 정의되어 있지 않습니다.');
            return;
        }

        const teamInfoResponse = await fetch(`/team-infos`);
        teamInfo = await teamInfoResponse.json();

        const matchDealResponse = await fetch(`/match-deal/${mdNum}`);
        const matchDealInfo = await matchDealResponse.json();

        awayTeamName = teamInfo.find(team => team.taNum.toString() === matchDealInfo.mdAwayNum.toString()).taName;

        console.log("matchDealInfo 값: ", matchDealInfo.mdHomeNum);

        // 타입 일치를 위해 loggedInTeamNum를 숫자로 변환
        const loggedInTeamNum = parseInt(await getLoggedInTeamNum(), 10);
        console.log("loggedInTeamNum 값:", loggedInTeamNum);

        if (matchDealInfo.mdHomeNum === loggedInTeamNum) {
            console.log(matchDealInfo.mdHomeNum === loggedInTeamNum);
            if (confirm(`팀 ${awayTeamName}과 매칭을 성공했습니다.`)) {
                const body = {
                    mdNum: matchDealInfo.mdNum,
                    rsDate: matchDealInfo.mdDate,
                    rsTime: matchDealInfo.mdTime,
                    rsAddress: matchDealInfo.mdAddress,
                    rsTmName: awayTeamName,
                    rsType: matchDealInfo.mdType
                };

                console.log("body 값:", body);

                const res = await fetch('/record-save/insert', {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                });

                console.log("res 값: ", res);

                const result = await res.json();

                if (result) {
                    alert('매칭을 성공했습니다.');
                    // 페이지를 다시 로드하기 전에 서버에서 최신 데이터를 가져와서 matchData를 갱신
                    matchData = await fetchMatchDealInfo();
                    createMatchTable(matchData);
                } else {
                    alert('매칭 성공을 실패했습니다. 다시 시도해주세요.');
                    location.reload();
                }
            }
        } else {
            alert(`해당 게시글은 다른 팀의 경기입니다.`);
        }
    } catch (error) {
        console.error('매칭 성공 처리 실패:', error);
    }
}

async function statusButtonDefuseAlert(mdNum) {
    try {
        const matchDealResponse = await fetch(`/match-deal/${mdNum}`);
        const matchDealInfo = await matchDealResponse.json();

        const teamInfoResponse = await fetch(`/team-infos`);
        const teamInfo = await teamInfoResponse.json();

        const awayTeamName = teamInfo.find(team => team.taNum.toString() === matchDealInfo.mdAwayNum.toString()).taName;

        if (confirm(`팀 '${awayTeamName}'의 매칭을 거절합니다.`)) {
            const body = {
                mdNum: matchDealInfo.mdNum
            };

            const res = await fetch('/match-deal/delete-status', {
                method: 'DELETE',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            });

            const result = await res.json();

            if (result) {
                alert('매칭을 거절했습니다.');
                location.reload();
            } else {
                alert('매칭 거절 실패, 다시 시도해주세요.');
                location.reload();
            }
        } else {
            return false;
        }
    } catch (error) {
        console.error('매칭 거절 처리 실패:', error);
    }
}

const initialData = matchData.filter((match) => match.mdMatchStatus === 'home');
createMatchTable(initialData);

document.querySelector('#sport-filter').addEventListener('change', async function () {
    const selectedValue = this.value;
    try {
        const matchDealInfo = await fetchMatchDealInfo();
        const filteredData = matchDealInfo.filter(
            (match) =>
                (selectedValue === 'home' && match.mdMatchStatus === '0') ||
                (selectedValue === 'away' && match.mdMatchStatus === '1') ||
                selectedValue === '0'
        );

        createMatchTable(filteredData);
    } catch (error) {
        console.error('데이터 필터링 중 오류:', error);
    }
});