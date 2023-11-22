window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.opacity = '0'; // 스크롤 위치에 따라 내비게이션 바 숨김
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.opacity = '1'; // 스크롤 위치에 따라 내비게이션 바 표시
        header.style.transform = 'translateY(0)';
    }
});

// 팀 이름을 메인 화면에 설정
document.querySelector('#team-name').innerText = 'Team Name';

// 랜덤 점수 생성 함수
function getRandomPoint() {
    return Math.floor(Math.random() * 501); // 0부터 500까지
}

// 랜덤으로 점수 생성
const randomScore = getRandomPoint();

// 점수 출력
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

const matchData = [
    {
        stadium: '월곡구민축구장',
        opponent: 'Away Team1',
        date: '2023.11.14 | 12:00',
        status: 'home',
    },
    {
        stadium: '월드컵 보조 경기장',
        opponent: 'Away Team2',
        date: '2023.11.14 | 19:00',
        status: 'away',
        filterStatus: 'refuse',
    },
    {
        stadium: '노량진축구장',
        opponent: 'Away Team3',
        date: '2023.11.20 | 21:00',
        status: 'away',
        filterStatus: 'accept',
    },
    {
        stadium: '고척스카이돔 야외 축구장',
        opponent: 'Away Team4',
        date: '2023.11.22 | 20:00',
        status: 'home',
    },
    {
        stadium: '고척스카이돔 야외 축구장',
        opponent: 'Away Team4',
        date: '2023.11.22 | 20:00',
        status: 'away',
        filterStatus: 'standby',
    },
    {
        stadium: '고척스카이돔 야외 축구장',
        opponent: 'Away Team5',
        date: '2023.11.22 | 11:00',
        status: 'home',
    },
    {
        stadium: '노량진 축구장',
        opponent: 'Away Team7',
        date: '2023.11.26 | 10:00',
        status: 'away',
        filterStatus: 'accept',
    },
];

function createMatchTable(data) {
    const tableBody = document.querySelector('.match--table tbody');
    const filterSelect = document.querySelector('#sport-filter');
    const selectedValue = filterSelect.value;

    tableBody.innerHTML = '';

    data.forEach((match) => {
        const row = document.createElement('tr');

        const stadiumCell = document.createElement('td');
        stadiumCell.textContent = match.stadium;
        row.appendChild(stadiumCell);

        const opponentCell = document.createElement('td');
        opponentCell.textContent = match.opponent;
        row.appendChild(opponentCell);

        const dateCell = document.createElement('td');
        dateCell.textContent = match.date;
        row.appendChild(dateCell);

        const statusCell = document.createElement('td');

        if (
            (selectedValue === 'home' && match.status === 'home') ||
            (selectedValue === 'away' && match.status === 'away') ||
            selectedValue === 'all'
        ) {
            if (selectedValue === 'home' && match.status === 'home') {
                // 'home' 상태일 때는 select 옵션을 추가
                const select = document.createElement('button');
                select.classList.add('status-button');
                select.innerHTML =
                    '<button id="accept-button" onclick="statusButtonAlert()" value="accept">수락</button>' +
                    '<button id="refuse-button" value="refuse">거절</button>';
                statusCell.appendChild(select);
            } else if (selectedValue === 'away' && match.status === 'away') {
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
                    statusCell.textContent = 'Data Error';
                }
            }
        }

        row.appendChild(statusCell);

        tableBody.appendChild(row);
    });
}

function statusButtonAlert() {
    alert('수락 되었습니다.');
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
