
let matchData;
let mrNum;
let mrRequestStatus;
let stayStatus;
let doneStatus;
const urlParams = new URLSearchParams(window.location.search);
const taNum = urlParams.get('taNum');


//홈 어웨이 셀렉트 박스 값 변할 때 밸류 갑 가져오기
function getSelectChangeListener(obj) {
	if (obj.value == 'home') {
		doneStatus = obj.value;
		getAjaxList(undefined, undefined, 'home');
	} else if (obj.value == 'away') {
		doneStatus = obj.value;
		getAjaxList(undefined, undefined, 'away');
	} else {
		doneStatus = obj.value;
		getAjaxList(undefined, undefined, 'all');
	}
}

function getSelectChangeListenerStay(obj) {
	if (obj.value == 'home') {
		stayStatus = obj.value;
		getAjaxListStay(undefined, undefined, 'home');
	} else if (obj.value == 'away') {
		stayStatus = obj.value;
		getAjaxListStay(undefined, undefined, 'away');
	} else {
		stayStatus = obj.value;
		getAjaxListStay(undefined, undefined, 'all');
	}
}

async function getAjaxListStay(evt, page, mrSearchType) {
	let total = 0;
	let pageSize = 10;
	const blockSize = 5;
	if (!mrSearchType) {
		mrSearchType = 'all';
	}

	if (!page) {
		page = 1;
	}
	//match
	let url = `/auth/match-result-infos/stay?page=${page}&pageSize=${pageSize}&taNum=${taNum}&mrSearchType=${mrSearchType}`;
	const res = await fetch(url);
	const pageInfos = await res.json();
	const totalCnt = pageInfos.total;
	const pageBlock = Math.ceil(totalCnt / pageSize);

	const startBlock = (Math.ceil(page / blockSize) - 1) * blockSize + 1;
	let endBlock = startBlock + blockSize - 1;
	let pageHtml = '';
	

	console.log("대기중 전적",pageInfos);

	if (endBlock > pageBlock) {
		endBlock = pageBlock;
	}

	if (startBlock != 1) {
		pageHtml += `<li class="page-item"><a class="page-link" aria-label="Previous" href="javascript:void(0)" onclick="getAjaxListStay(event,${startBlock - 1},"${mrSearchType}")"><span aria-hidden="true">&laquo;</span></a></li>`;
	}

	for (let i = startBlock; i <= endBlock; i++) {
		pageHtml += `<li class="page-item"><a class="page-link" href="javascript:void(0)" onclick="getAjaxListStay(event,${i},"${mrSearchType},"${mrSearchType}")"),">${i}</a></li>`;
	}

	if (endBlock < pageBlock) {
		pageHtml += `<li class="page-item"><a  class="page-link" aria-label="Next" href="javascript:void(0)" onclick="getAjaxListStay(event,${endBlock + 1},"${mrSearchType}")"><span aria-hidden="true">&raquo;</span></a></li>`;
	}


	document.querySelector('#page-div-stay').innerHTML = pageHtml;

	let html = '';
	if (pageInfos.list.length == 0) {
		html += '<tr><td colspan="5" style="text-align: center;">비어있는 리스트 입니다.</td></tr>';
	} else {
		for (let matchStatus of pageInfos.list) {
			if (matchStatus.taHomeNum == taNum) {
				if (matchStatus.mrRequestStatus == 0) {
					html += `<tr>`
					html += `<td class="border-bottom-0">`
					html += `<h6 class="fw-semibold mb-0">${matchStatus.mdAddress}</h6>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<h6 class="fw-semibold mb-1">${matchStatus.mdDate}</h6>
							 <span class="fw-normal">${matchStatus.mdTime}</span>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">Home</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">${matchStatus.taName}</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">0 : 0</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `
							 <span style="cursor: pointer" class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#scoreModal" onclick="saveMrNumAndMrRequestStatus(${matchStatus.mrNum}, 1)">경기종료</span>
							 `
					html += `</td>`
					html += `</tr>`
				} else if (matchStatus.mrRequestStatus == 1) {
					html += `<tr>`
					html += `<td class="border-bottom-0">`
					html += `<h6 class="fw-semibold mb-0">${matchStatus.mdAddress}</h6>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<h6 class="fw-semibold mb-1">${matchStatus.mdDate}</h6>
							 <span class="fw-normal">${matchStatus.mdTime}</span>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">Home</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">${matchStatus.taName}</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">${matchStatus.mrHomeScore} : ${matchStatus.mrAwayScore}</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `
							 <span class="badge bg-primary rounded-3 fw-semibold">수락 대기중</span>
						`
					html += `</td>`
					html += `</tr>`
				} else {
					html += `<tr>`
					html += `<td class="border-bottom-0">`
					html += `<h6 class="fw-semibold mb-0">${matchStatus.mdAddress}</h6>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<h6 class="fw-semibold mb-1">${matchStatus.mdDate}</h6>
							 <span class="fw-normal">${matchStatus.mdTime}</span>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">Home</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">${matchStatus.taName}</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">${matchStatus.mrHomeScore} : ${matchStatus.mrAwayScore}</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `
							 <span style="cursor: pointer" class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#scoreModal" onclick="saveMrNumAndMrRequestStatus(${matchStatus.mrNum},1)">거절(다시입력)</span>
							 `
					html += `</td>`
					html += `</tr>`
				}
			} else {
				if (matchStatus.mrRequestStatus == '0') {
					// 상태: 대기중
					html += `<tr>`
					html += `<td class="border-bottom-0">`
					html += `<h6 class="fw-semibold mb-0">${matchStatus.mdAddress}</h6>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<h6 class="fw-semibold mb-1">${matchStatus.mdDate}</h6>
							 <span class="fw-normal">${matchStatus.mdTime}</span>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">Away</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">${matchStatus.taName}</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">0 : 0</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<div class="align-items-center">
							 <span class="badge bg-primary rounded-3 fw-semibold">입력 대기중</span>
							 </div>`
					html += `</td>`
					html += `</tr>`
				} else if (matchStatus.mrRequestStatus == '1') {
					// 상태: 수락

					html += `<tr>`
					html += `<td class="border-bottom-0">`
					html += `<h6 class="fw-semibold mb-0">${matchStatus.mdAddress}</h6>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<h6 class="fw-semibold mb-1">${matchStatus.mdDate}</h6>
							 <span class="fw-normal">${matchStatus.mdTime}</span>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">Away</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">${matchStatus.taName}</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">${matchStatus.mrHomeScore} : ${matchStatus.mrAwayScore}</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<div>
							 <button class="btn btn-secondary m-1" id="accept-button" data-bs-toggle="modal" data-bs-target="#mannerModal" onclick="saveMrNumAndMrRequestStatus(${matchStatus.mrNum},3)">수락</button>
							 <button class="btn btn-danger m-1" onclick="saveMrNumAndMrRequestStatus(${matchStatus.mrNum},2,1)">거절</button>
							 </div>`
					html += `</td>`
					html += `</tr>`

				} else if (matchStatus.mrRequestStatus == '2') {
					html += `<tr>`
					html += `<td class="border-bottom-0">`
					html += `<h6 class="fw-semibold mb-0">${matchStatus.mdAddress}</h6>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<h6 class="fw-semibold mb-1">${matchStatus.mdDate}</h6>
							 <span class="fw-normal">${matchStatus.mdTime}</span>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">Away</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">${matchStatus.taName}</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">0 : 0</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<div class="align-items-center gap-2">
							 <span class="badge rounded-pill text-bg-secondary">재입력 대기중</span>
							 </div>`
					html += `</td>`
					html += `</tr>`
				}

			}
		}
	}
	document.querySelector('#match-record-tbody-stay').innerHTML = html;
}



async function getAjaxList(evt, page, mrSearchType) {
	let total = 0;
	const pageSize = 5;
	const blockSize = 5;

	if (!mrSearchType) {
		mrSearchType = 'all';
	}

	if (!page) {
		page = 1;
	}
	//match
	let url = `/auth/match-result-infos?page=${page}&pageSize=${pageSize}&taNum=${taNum}&mrSearchType=${mrSearchType}`;
	const res = await fetch(url);
	const pageInfos = await res.json();
	const totalCnt = pageInfos.total;
	const pageBlock = Math.ceil(totalCnt / pageSize);

	const startBlock = (Math.ceil(page / blockSize) - 1) * blockSize + 1;
	let endBlock = startBlock + blockSize - 1;
	let pageHtml = '';

	console.log("완료된 전적",pageInfos);

	if (endBlock > pageBlock) {
		endBlock = pageBlock;
	}

	if (startBlock != 1) {
		pageHtml += `<li class="page-item"><a class="page-link" aria-label="Previous" href="javascript:void(0)" onclick="getAjaxList(event,${startBlock - 1},"${mrSearchType}")"><span aria-hidden="true">&laquo;</span></a></li>`;
	}

	for (let i = startBlock; i <= endBlock; i++) {
		pageHtml += `<li class="page-item"><a class="page-link" href="javascript:void(0)" onclick="getAjaxList(event,${i},'${mrSearchType}')">${i}</a></li>`;
	}

	if (endBlock < pageBlock) {
		pageHtml += `<li class="page-item"><a  class="page-link" aria-label="Next" href="javascript:void(0)" onclick="getAjaxList(event,${endBlock + 1},"${mrSearchType}")"><span aria-hidden="true">&raquo;</span></a></li>`;
	}


	document.querySelector('#pageDiv').innerHTML = pageHtml;

	//여기서 상태별로 화면에 다르게 보여야함

	let html = '';
	if (pageInfos.list.length == 0) {
		html += '<tr><td colspan="5" style="text-align: center;">비어있는 리스트 입니다.</td></tr>';
	} else {
		for (let matchStatus of pageInfos.list) {
			if (matchStatus.taHomeNum == taNum) {
				html += `<tr>`
				html += `<td class="border-bottom-0">`
				html += `<h6 class="fw-semibold mb-0">${matchStatus.mdAddress}</h6>`
				html += `</td>`
				html += `<td class="border-bottom-0">`
				html += `<h6 class="fw-semibold mb-1">${matchStatus.mdDate}</h6>
							 <span class="fw-normal">${matchStatus.mdTime}</span>`
				html += `</td>`
				html += `<td class="border-bottom-0">`
				html += `<p class="mb-0 fw-normal">Home</p>`
				html += `</td>`
				html += `<td class="border-bottom-0">`
				html += `<p class="mb-0 fw-normal">${matchStatus.taName}</p>`
				html += `</td>`
				html += `<td class="border-bottom-0">`
				html += `<p class="mb-0 fw-normal">${matchStatus.mrHomeScore} : ${matchStatus.mrAwayScore}</p>`
				html += `</td>`
				html += `<td class="border-bottom-0">`
				html += `<div class="align-items-center">`
				if (matchStatus.mrHomeResult == 'w') {
					html += `<span class="badge bg-primary rounded-3 fw-semibold">Win</span>`
				} else if (matchStatus.mrHomeResult == 'l') {
					html += `<span class="badge bg-danger rounded-3 fw-semibold">Lose</span>
								  </div>`
				} else {
					html += `<span class="badge bg-success rounded-3 fw-semibold">Draw</span>
								  </div>`
				}
				html += `</td>`
				html += `</tr>`
				//상태 검사

			} else {
				//상태 검사
				html += `<tr>`
				html += `<td class="border-bottom-0">`
				html += `<h6 class="fw-semibold mb-0">${matchStatus.mdAddress}</h6>`
				html += `</td>`
				html += `<td class="border-bottom-0">`
				html += `<h6 class="fw-semibold mb-1">${matchStatus.mdDate}</h6>
							 <span class="fw-normal">${matchStatus.mdTime}</span>`
				html += `</td>`
				html += `<td class="border-bottom-0">`
				html += `<p class="mb-0 fw-normal">Away</p>`
				html += `</td>`
				html += `<td class="border-bottom-0">`
				html += `<p class="mb-0 fw-normal">${matchStatus.taName}</p>`
				html += `</td>`
				html += `<td class="border-bottom-0">`
				html += `<p class="mb-0 fw-normal">${matchStatus.mrHomeScore} : ${matchStatus.mrAwayScore}</p>`
				html += `</td>`
				html += `<td class="border-bottom-0">`
				html += `<div class="align-items-center gap-2">`
				if (matchStatus.mrAwayResult == 'w') {
					html += `<span class="badge bg-primary rounded-3 fw-semibold">Win</span>
								  </div>`
				} else if (matchStatus.mrAwayResult == 'l') {
					html += `<span class="badge bg-danger rounded-3 fw-semibold">Lose</span>
								  </div>`
				} else {
					html += `<span class="badge bg-success rounded-3 fw-semibold">Draw</span>
								  </div>`
				}
				html += `</td>`
				html += `</tr>`
			}
		}
	}

	document.querySelector('#match-record-tbody').innerHTML = html;
}


function saveMrNumAndMrRequestStatus(mrNum, mrRequestStatus, check) {
	this.mrNum = mrNum;
	this.mrRequestStatus = mrRequestStatus;
	if(check){
		updateFirstMatchResult();
	}
	console.log(mrNum);
}

async function updateFirstMatchResult() {
	let homeScore = document.querySelector('#homeScoreInput').value;
	let awayScore = document.querySelector('#awayScoreInput').value;
	let awayMannerPoint = document.querySelector('#mannerPointInput').value;
	let homeMannerPoint = document.querySelector('#mannerPointInput2').value;
	let mrNum = this.mrNum;
	let mrRequestStatus = this.mrRequestStatus;

	const body = {
		mrNum: mrNum,
		mrHomeScore: homeScore,
		mrAwayScore: awayScore,
		mrAwayMannerPoint: awayMannerPoint,
		mrHomeMannerPoint: homeMannerPoint,
		mrRequestStatus: mrRequestStatus
	
	};
	const res = await fetch(`/match-result-infos`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body)
	});
	const result = await res.json();
	alert(result.resultMsg)

	$('#scoreModal').modal('hide').data('bs.modal', null);

	document.querySelector('#modal-fade').style.display = 'none';

	getAjaxList(undefined, undefined, doneStatus);
	getAjaxListStay(undefined, undefined, stayStatus);

}

window.addEventListener('load', async function() {
	getAjaxList();
	getAjaxListStay();
});
