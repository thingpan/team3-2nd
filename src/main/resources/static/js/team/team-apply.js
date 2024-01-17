// 가입 수락 처리를 담당하는 함수
const urlParams = new URL(location.href).searchParams;
const taNum = urlParams.get('taNum');
async function acceptMembership(tsuNum, uiName, uiNum) {
	if (confirm(`사용자 ${uiName}의 가입을 수락합니다.`) == true) {
		const body = {
			tsuNum: tsuNum,
			uiNum: uiNum,
			taNum: taNum
		}
		const res = await fetch('/auth/team-user-infos', {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json;charset=UTF-8'
			}
		});
		const result = await res.json();
		if (result) {
			alert('수락 성공');
			getTeamSignUserInfoList();
		} else {
			alert('수락 실패 다시 시도해 주세요');
			getTeamSignUserInfoList();
		}
	} else {
		return false;
	}
}

// 가입 거절 처리를 담당하는 함수
async function rejectMembership(tsuNum, uiName) {
	if (confirm(`사용자 ${uiName}의 가입을 거절합니다.`) == true) {
		const body = {
			tsuNum: tsuNum
		}
		const res = await fetch('/auth/team-sign-infos', {
			method: 'DELETE',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json;charset=UTF-8'
			}
		});
		const result = await res.json();
		if (result) {
			alert('거절 성공');
			getTeamSignUserInfoList();
		} else {
			alert('거절 실패 다시 시도해 주세요');
			getTeamSignUserInfoList();
		}
	} else {
		return false;
	}

}

let total = 0;
let pageSize = 5;
const blockSize = 5;


const getTeamSignUserInfoList = async function(evt, page) {


	if (!page) {
		page = 1;
	}
	let url = `/auth/team-sign-infos/helper?page=${page}&pageSize=${pageSize}&taNum=${taNum}`;
	const res = await fetch(url);
	const pageInfos = await res.json();
	const totalCnt = pageInfos.total;
	const pageBlock = Math.ceil(totalCnt / pageSize);

	const startBlock = (Math.ceil(page / blockSize) - 1) * blockSize + 1;
	let endBlock = startBlock + blockSize - 1;
	let pageHtml = '';


	if (endBlock > pageBlock) {
		endBlock = pageBlock;
	}

	if (startBlock != 1) {
		pageHtml += `<li class="page-item"><a class="page-link" aria-label="Previous" href="javascript:void(0)" onclick="getTeamSignUserInfoList(event,${startBlock - 1})"><span aria-hidden="true">&laquo;</span></a></li>`;
	}

	for (let i = startBlock; i <= endBlock; i++) {
		pageHtml += `<li class="page-item"><a class="page-link" href="javascript:void(0)" onclick="getTeamSignUserInfoList(event,${i})">${i}</a></li>`;
	}

	if (endBlock < pageBlock) {
		pageHtml += `<li class="page-item"><a  class="page-link" aria-label="Next" href="javascript:void(0)" onclick="getTeamSignUserInfoList(event,${endBlock + 1})"><span aria-hidden="true">&raquo;</span></a></li>`;
	}
	document.querySelector('#pageDiv').innerHTML = pageHtml;
	let html = '';
	if (pageInfos === null || pageInfos.list.length === 0) {
		html += '<tr><td colspan="5" style="text-align: center;">비어있는 리스트 입니다.</td></tr>';
	}
	else {
		for (let request of pageInfos.list) {
			html += '<tr>';
			html += `<td>${request.uiName}</td>`;
			html += `<td>${request.uiAddress}</td>`;
			html += `<td>${request.uiPhoneNum}</td>`;
			html += `<td><button class="btn btn-success" onclick="acceptMembership(${request.tsuNum},'${request.uiName}',${request.uiNum})">수락</button></td>`;
			html += `<td><button class="btn btn-danger" onclick="rejectMembership(${request.tsuNum},'${request.uiName}','${request.uiNum}')">거절</button></td>`;
			html += '</tr>';
		}
	}
	document.querySelector('#membership-requests-info').innerHTML = html;
}
window.addEventListener('load', getTeamSignUserInfoList);