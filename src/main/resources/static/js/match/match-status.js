let matchData = [];
let teamInfo;
let awayTeamName;
const urlParams = new URL(location.href).searchParams;
const taNum = urlParams.get('taNum');


window.addEventListener('scroll', () => {
	if (window.scrollY > 50) {
		header.style.opacity = '0';
		header.style.transform = 'translateY(-100%)';
	} else {
		header.style.opacity = '1';
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

//토글이 어웨이일때 리스트 불러오기
async function getAwayAjaxList(evt, page) {
	let total = 0;
	let pageSize = 5;
	const blockSize = 5;

	if (!page) {
		page = 1;
	}

	let url = `/math-deal-away-infos?page=${page}&pageSize=${pageSize}&taNum=${taNum}`;
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
			let status;
			html += '<tr>';
			html += `<td>${matchStatus.mdAddress}</td>`;
			html += `<td>${matchStatus.taName}</td>`;
			html += `<td>${matchStatus.mdDate}</td>`;
			
			if (matchStatus.mdMatchStatus == 0) {
				status = '대기중';
			} else if (matchStatus.mdMatchStatus == 1) {
				status = '수락';
			}
			else if (matchStatus.mdMatchStatus == 2) {
				status = '거절';
			}
			html += `<td>${status}</td>`;
			html += '</tr>';
		}
	}
	document.querySelector('#table-body').innerHTML = html;
}

//토글이 홈일때 리스트 불러오기
async function getHomeAjaxList(evt, page) {
	let total = 0;
	let pageSize = 5;
	const blockSize = 5;

	if (!page) {
		page = 1;
	}

	let url = `/math-deal-home-infos?page=${page}&pageSize=${pageSize}&taNum=${taNum}`;
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
			html += '<tr>';
			html += `<td>${matchStatus.mdAddress}</td>`;
			html += `<td>${matchStatus.taName}</td>`;
			html += `<td>${matchStatus.mdDate}</td>`;
			html += `<td><button class="btn btn-dark" onclick="doAcceptCheck('${matchStatus.taName}',${matchStatus.mdNum}, ${matchStatus.mdHomeNum}, ${matchStatus.mdAwayNum})">수락</button>
		<button class="btn btn-white" onclick="doCancleCheck('${matchStatus.taName}',${matchStatus.mdNum})">거절</button></td>`;
			html += `<tr>`;
		}
	}

	document.querySelector('#table-body').innerHTML = html;
}

function doAcceptCheck(mdAwayName, mdNum, mdHomeNum, mdAwayNum) {
	if (confirm(`${mdAwayName}과의 매칭을 수락 하시겠습니까?`) == true) {
		doMatchAccept(mdNum, mdHomeNum, mdAwayNum);
	}
}

function doCancleCheck(mdAwayName, mdNum) {
	if (confirm(`${mdAwayName}과의 매칭을 거절 하시겠습니까?`) == true) {
		doMatchDealUpdate(mdNum, '2');
	}
}

async function doMatchAccept(mdNum, mdHomeNum, mdAwayNum) {
	const body = {
		mdNum: mdNum,
		taHomeNum: mdHomeNum,
		taAwayNum: mdAwayNum,
		mrRequestStatus: '0'
	}
	const res = await fetch(`/match-result-infos`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body)
	});
	const result = await res.json();
	if (res.ok) {
		doMatchDealUpdate(mdNum, '1')
	}
	alert(result.resultMsg)
	location.reload();
}

async function doMatchDealUpdate(mdNum, mdMatchStatus) {
	const body = {
		mdNum: mdNum,
		mdMatchStatus: mdMatchStatus
	}
	const res = await fetch(`/match-result-infos`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body)
	});
	const result = await res.json();
	console.log(result);
	if (mdMatchStatus == '2') {
		alert(result.resultMsg);
		location.reload();
	}

}

window.addEventListener('load', getHomeAjaxList());



