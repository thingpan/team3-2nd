
async function getTeamInfo() {

	const urlParams = new URLSearchParams(window.location.search);
	const taNum = urlParams.get('taNum');

	const res = await fetch(`/team-info?taNum=${taNum}`);
	const teamInfo = await res.json();
	console.log(teamInfo);


	const wholeRecord = `${teamInfo.taMatchCount}전 ${teamInfo.taWinCnt}승 ${teamInfo.taDrawCnt}무 ${teamInfo.taLooseCnt}패`
	document.querySelector('#whole-record').innerHTML = wholeRecord;
	if (teamInfo.taMatchCount != 0) {
		//chart
		$(function() {

			// =====================================
			// Breakup
			// =====================================
			var breakup = {
				color: "#adb5bd",
				series: [teamInfo.taWinCnt, teamInfo.taDrawCnt, teamInfo.taLooseCnt],
				labels: ["Win", "Draw", "Lose"],
				chart: {
					width: 200,
					type: "donut",
					fontFamily: "Plus Jakarta Sans', sans-serif",
					foreColor: "#adb0bb",
				},
				plotOptions: {
					pie: {
						startAngle: 0,
						endAngle: 360,
						donut: {
							size: '75%',
						},
					},
				},
				stroke: {
					show: false,
				},

				dataLabels: {
					enabled: false,
				},

				legend: {
					show: false,
				},
				colors: ["#5D87FF", "#FFBF01", "#FF0100"],

				responsive: [
					{
						breakpoint: 991,
						options: {
							chart: {
								width: 150,
							},
						},
					},
				],
				tooltip: {
					theme: "dark",
					fillSeriesColor: false,
				},
			};

			var chart = new ApexCharts(document.querySelector("#breakup"), breakup);
			chart.render();
		})
		document.querySelector('#match-win-draw-loose').innerHTML = `${teamInfo.taMatchCount}전 ${teamInfo.taWinCnt}승 ${teamInfo.taDrawCnt}무 ${teamInfo.taLooseCnt}패`;

		const victoryPercent = Math.floor((teamInfo.taWinCnt / teamInfo.taMatchCount) * 100);
		document.querySelector('#victory-percent').innerHTML = `${victoryPercent}%`;
	} else {
		document.querySelector('#match-win-draw-loose-div').innerHTML = '<h6 class="fw-semibold mb-3" id="match-win-draw-loose">첫 경기 전입니다.</h6>';

	}

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
				html += `<td><span class="badge bg-primary rounded-3 fw-semibold" style="margin-left: 1vh;">모집중</span></td>`;
			}

			html += '</tr>';
		}
	}
	document.querySelector('#match-list-info').innerHTML = html;

	let url = `/team-users/helper?page=${1}&pageSize=${5}&taNum=${taNum}`;
	const resMember = await fetch(url);
	const membersInfo = await resMember.json();
	
	let memberHtml = '';
			for (let user of membersInfo.list) {
				let role = user.tuRole;
				if (role == 'ADMIN') {
					role = '팀장';
				} else {
					role = '팀원';
				}
				memberHtml += '<tr>';
				memberHtml += `<td>${user.uiName}</td>`;
				memberHtml += `<td>${role}</td>`;
				memberHtml += `<td>${user.uiAddress}</td>`;
				memberHtml += '</tr>';
			}
			document.querySelector('#team-user-list-info').innerHTML = memberHtml;

}

function goMatchListPage() {
	const urlParams = new URLSearchParams(window.location.search);
	const taNum = urlParams.get('taNum');
	location.href = `/page/team/team-match-list?taNum=${taNum}`;
}

function goTeamMemberPage(){
	
	const urlParams = new URLSearchParams(window.location.search);
	const taNum = urlParams.get('taNum');
	location.href = `/page/team/team-members?taNum=${taNum}`;
}






window.addEventListener('load', getTeamInfo);