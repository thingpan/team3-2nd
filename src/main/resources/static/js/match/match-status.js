let matchData = [];

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
        const response = await fetch('/match-deal/all');
        if (!response.ok) {
            throw new Error('매칭현황 오류 ');
        }

        const matchDealInfo = await response.json();
        return matchDealInfo;
    } catch (error) {
        console.error('매칭현황 가져오다 오류:', error);
        throw error;
    }
}

window.addEventListener('load', async function () {
    try {
        const matchDealInfo = await fetchMatchDealInfo();
        createMatchTable(matchDealInfo);
        console.log("matchDealInfo", matchDealInfo);

        const teamInfoResponse = await fetch(`/team-infos`);
        const teamInfo = await teamInfoResponse.json();

        // url 주소에서 taNum을 가져옴
        const urlParams = new URLSearchParams(window.location.search);
        const taNum = urlParams.get('taNum');

        // teamInfo 배열에서 taNum에 해당하는 taName 받아오기
        document.querySelector('#team-name').innerText = teamInfo.find(team => team.taNum.toString() === taNum).taName;

        // teamInfo에서 받아온 taNum에 해당하는 taPoint 받아오기
        const teamScore = teamInfo.find(team => team.taNum.toString() === taNum).taPoint;

        const scoreValue = document.querySelector('#score-value');
        scoreValue.textContent = `${teamScore}점`;

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
        console.error('매칭현황 로딩 오류?인가: ', error);
    }
});

function createMatchTable(data) {
    const tableBody = document.querySelector('.match--table tbody');
    const filterSelect = document.querySelector('#sport-filter');
    const selectedValue = filterSelect.value;

    tableBody.innerHTML = '';

    data.forEach((match) => {
        const row = document.createElement('tr');
        const stadiumCell = document.createElement('td');
        stadiumCell.textContent = match.mdAddress;
        row.appendChild(stadiumCell);

        const opponentCell = document.createElement('td');
        opponentCell.textContent = match.taName;
        row.appendChild(opponentCell);

        const dateCell = document.createElement('td');
        dateCell.textContent = `${match.mdDate} | ${match.mdTime}`;
        row.appendChild(dateCell);

        const statusCell = document.createElement('td');

        if (
            (selectedValue === 'home' && match.mdMatchStatus === '1') ||
            (selectedValue === 'away' && match.mdMatchStatus === '0') ||
            selectedValue === 'all'
        ) {
            if (selectedValue === 'home' && match.mdMatchStatus === '1') {
                // 'home' 상태일 때는 select 옵션을 추가
                const select = document.createElement('button');
                select.classList.add('status-button');
                select.innerHTML =
                    '<button id="accept-button" onclick="statusButtonAcceptAlert()" value="accept">수락</button>' +
                    '<button id="refuse-button" onclick="statusButtonDefuseAlert()" value="refuse">거절</button>';
                statusCell.appendChild(select);
            } else if (selectedValue === 'away' && match.status === '0') {
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
    });
}

async function statusButtonAcceptAlert(match) {
    const matchDealResponse = await fetch(`/match-deal/all`);
    const matchDealInfo = await matchDealResponse.json();

    console.log("matchDealInfo 값: ", matchDealInfo[2]);

    const loggedInTeamNum = 31;  // 로그인한 팀의 번호로 대체 되어야 함

    if (matchDealInfo[2].mdHomeNum === loggedInTeamNum) {
        if (confirm(`팀 ${matchDealInfo[2].taName}과 매칭을 성공했습니다.`)) {
            const body = {
                mdNum: matchDealInfo[2].mdNum,
                rsDate: matchDealInfo[2].mdDate,
                rsTime: matchDealInfo[2].mdTime,
                rsAddress: matchDealInfo[2].mdAddress,
                rsTmName: matchDealInfo[2].taName
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
}

async function statusButtonDefuseAlert() {
    const matchDealResponse = await fetch(`/match-deal/all`);
    const matchDealInfo = await matchDealResponse.json();

    console.log("matchDealInfo 값: ", matchDealInfo[0].taName);

    if (confirm(`팀 '${matchDealInfo[0].taName}'의 매칭을 거절합니다.`) == true) {
        const body = {
            mdNum: matchDealInfo[3].mdNum
        }
        const res = await fetch('/match-deal/delete-status', {
            method: 'DELETE',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        });
        const result = await res.json();
        console.log("result 값: ", result);
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
}

createMatchTable(matchData);

document.querySelector('#sport-filter').addEventListener('change', function () {
    const selectedValue = this.value;
    const filteredData = matchData.filter(
        (match) =>
            (selectedValue === 'home' && match.mdMatchStatus === '1') ||
            (selectedValue === 'away' && match.status === 'away') ||
            selectedValue === 'all'
    );

    createMatchTable(filteredData);
});

const initialData = matchData.filter((match) => match.status === 'home');
createMatchTable(initialData);

document.querySelector('#sport-filter').addEventListener('change', function () {
    const selectedValue = this.value;
    const filteredData = matchData.filter(
        (match) =>
            (selectedValue === 'home' && match.status === 'home') ||
            (selectedValue === 'away' && match.status === 'away') ||
            selectedValue === 'all'
    );

    createMatchTable(filteredData);
});
