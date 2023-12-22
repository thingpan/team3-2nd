// SVG 요소 생성
const svgWidth = 500; // 차트의 전체 너비
const svgHeight = 500; // 차트의 전체 높이
const chartWidth = 400; // 차트 내용의 너비
const chartHeight = 400; // 차트 내용의 높이

const colors = ['#5D9EFF', '#D9D9D9', '#FF5C5C']; // 승리, 무승부, 패배 순

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.opacity = '0'; // 스크롤 위치에 따라 내비게이션 바 숨김
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.opacity = '1'; // 스크롤 위치에 따라 내비게이션 바 표시
        header.style.transform = 'translateY(0)';
    }
});

window.addEventListener('load', async function () {
    const urlParams = new URL(location.href).searchParams;
    const taNum = urlParams.get('taNum');

    const res = await fetch(`/team-info?taNum=${taNum}`);
    const teamInfo = await res.json();

    // n 경기 중 승, 무, 패의 개수 계산
    const totalGames = teamInfo.taWinCnt + teamInfo.taDrawCnt + teamInfo.taLooseCnt;
    console.log("총 경기수: ", totalGames);
    const winGames = teamInfo.taWinCnt;
    const drawGames = teamInfo.taDrawCnt;
    const loseGames = teamInfo.taLooseCnt;

    // 승률 계산
    const winRate = (winGames / totalGames) * 100;

    document.querySelector('.game-record-detail').innerText = totalGames + '경기 중';
    document.querySelector('.record').innerText = winGames + '승 ' + drawGames + '무 ' + loseGames + '패';

    // 현재 승률 표시
    if (isNaN(winRate)) {
        document.querySelector('.odds').innerText = '0%';
    } else {
        const formattedWinRate = winRate === 100 ? '100%' : winRate.toFixed(2) + '%';
        document.querySelector('.odds').innerText = formattedWinRate;
    }

    // 랭킹 제목 업데이트
    const rankTitleElement = document.querySelector('.game-ranks-title .all-title');
    if (rankTitleElement) {
        rankTitleElement.innerText = `${teamInfo.taType} 랭킹`;
    } else {
        console.error("랭킹 제목 업데이트 실패: 데이터를 찾을 수 없습니다.");
    }

    const taType = teamInfo.taType;
    console.log("내 종목: ", taType);

    const rankRes = await fetch('/team-infos');
    const teamData = await rankRes.json();

    console.log('teamData:', teamData);

    async function getTeamRankByTypeAndDisplay(taType, taNum) {
        const rankRes = await fetch(`/team-infos/${taType}`);
        const teamInfos = await rankRes.json();

        const teamInfo = teamInfos.find(team => team.taNum == taNum);

        // 순위를 화면에 표시
        const teamRank = teamInfo ? teamInfos.findIndex(team => team.taNum == taNum) + 1 : undefined;
        const medalEmoji = teamRank && teamRank <= 3 ? getMedalEmoji(teamRank) : '😎';
        const rankText = teamRank ? `${ordinalSuffix(teamRank)}위 ${medalEmoji}` : '순위 없음';
        console.log("순위:", rankText);

        // 순위를 화면에 표시
        document.querySelector('.ranks').innerText = rankText;
    }

    await getTeamRankByTypeAndDisplay(taType, taNum);

    function ordinalSuffix(i) {
        return i;
    }

    function getMedalEmoji(rank) {
        if (rank === 1) {
            return '🥇';
        } else if (rank === 2) {
            return '🥈';
        } else if (rank === 3) {
            return '🥉';
        } else {
            return '😎';
        }
    }

    // SVG 요소 생성
    const svg = d3.select(".game-record-chart")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", "translate(" + (svgWidth / 2) + "," + (svgHeight / 2) + ")");

    // 나머지 부분은 그대로 유지
    const pie = d3.pie();
    const arc = d3.arc().innerRadius(0).outerRadius(chartWidth / 2);

    const data = [winGames, drawGames, loseGames]; // 승, 무, 패 갯수

    const arcs = svg.selectAll(".arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc");

    arcs.append("path")
        .attr("d", arc)
        .attr("fill", function (d, i) {
            return colors[i];
        });

    const userRes = await fetch(`/team-info?taNum=${taNum}`);
    const user = await userRes.json();

    document.querySelector('#team-name-modal').innerText = user.taName;
});

async function doSendObj() {
    //타임리프 안돼서 일단 ㅠㅠ
    const urlParams = new URL(location.href).searchParams;
    const taNum = urlParams.get('taNum');
    const obj = {
        taNum: taNum
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
        window.location.reload();
        alert(`${result.resultMsg}`);
    }
}
