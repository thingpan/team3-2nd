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
        console.log("teamInfo", teamInfo);

        document.querySelector('#team-name').innerText = teamInfo[0].taName;

        const teamScore = teamInfo[0].taPoint;
        console.log("teamScore 값: ", teamScore);

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

function statusButtonAcceptAlert() {
    alert('매칭 수락을 성공했습니다.');
}

function statusButtonDefuseAlert() {
    alert('매칭 거절을 성공했습니다.');
}

createMatchTable(matchData);

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
