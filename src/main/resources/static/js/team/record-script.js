let matchData;
let mrNum;
const urlParams = new URLSearchParams(window.location.search);
const taNum = urlParams.get('taNum');




//홈 어웨이 셀렉트 박스 값 변할 때 밸류 갑 가져오기
function getSelectChangeListener(obj) {
	if (obj.value == 'home') {
		getHomeAjaxList();
	} else if (obj.value == 'away') {
		getAwayAjaxList();
	} else {
		getAjaxList();
	}
}

async function getAjaxList(evt, page) {
	let total = 0;
	let pageSize = 5;
	const blockSize = 5;

	if (!page) {
		page = 1;
	}

	let url = `/match-result-infos?page=${page}&pageSize=${pageSize}&taHomeNum=${taNum}&taAwayNum=${taNum}`;
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
		pageHtml += `<li class="page-item"><a class="page-link" aria-label="Previous" href="javascript:void(0)" onclick="getAjaxList(event,${startBlock - 1})"><span aria-hidden="true">&laquo;</span></a></li>`;
	}

	for (let i = startBlock; i <= endBlock; i++) {
		pageHtml += `<li class="page-item"><a class="page-link" href="javascript:void(0)" onclick="getAjaxList(event,${i})">${i}</a></li>`;
	}

	if (endBlock < pageBlock) {
		pageHtml += `<li class="page-item"><a  class="page-link" aria-label="Next" href="javascript:void(0)" onclick="getAjaxList(event,${endBlock + 1})"><span aria-hidden="true">&raquo;</span></a></li>`;
	}


	document.querySelector('#pageDiv').innerHTML = pageHtml;

	//여기서 상태별로 화면에 다르게 보여야함

	let html = '';
	if (pageInfos.list.length == 0) {
		html += '<tr><td colspan="5">비어있는 리스트 입니다.</td></tr>';
	} else {
		for (let matchStatus of pageInfos.list) {
			let height;
			let backgroundColor;
			let borderRadius;

			if (matchStatus.taHomeNum == taNum) {
				if (matchStatus.mrRequestStatus == '0') {
					html += `<tr>`
					html += `<td class="border-bottom-0">`
					html += `<h6 class="fw-semibold mb-0">${matchStatus.mdAddress}</h6>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<h6 class="fw-semibold mb-1">${matchStatus.mdDate}</h6>
							 <span class="fw-normal">${matchStatus.mdTime}</span>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">${matchStatus.taName}</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">0 : 0</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<div class="d-flex align-items-center gap-2">
							 <span class="badge bg-primary rounded-3 fw-semibold" data-bs-toggle="modal" data-bs-target="#scoreModal" onclick="saveMrNum(${matchStatus.mrNum})">경기종료</span>
							 </div>`
					html += `</td>`
					html += `</tr>`
					/*html += `<span>${matchStatus.mdDate}<br>${matchStatus.mdTime}</span>`;
					html += `<span>${matchStatus.mdAddress} | ${matchStatus.taName}</span>`;
					html += `<span><button type="button" class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#scoreModal" onclick="saveMrNum(${matchStatus.mrNum})">
							경기종료
						</button></span>`;*/
				}
				if (matchStatus.mrRequestStatus == '1') {
					html += `<tr>`
					html += `<td class="border-bottom-0">`
					html += `<h6 class="fw-semibold mb-0">${matchStatus.mdAddress}</h6>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<h6 class="fw-semibold mb-1">${matchStatus.mdDate}</h6>
							 <span class="fw-normal">${matchStatus.mdTime}</span>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">${matchStatus.taName}</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">${matchStatus.mrHomeScore} : ${matchStatus.mrAwayScore}</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<div class="d-flex align-items-center gap-2">
							 <span class="badge bg-primary rounded-3 fw-semibold">수락 대기중</span>
							 </div>`
					html += `</td>`
					html += `</tr>`
				}
				if (matchStatus.mrRequestStatus == '2') {
					html += `<tr>`
					html += `<td class="border-bottom-0">`
					html += `<h6 class="fw-semibold mb-0">${matchStatus.mdAddress}</h6>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<h6 class="fw-semibold mb-1">${matchStatus.mdDate}</h6>
							 <span class="fw-normal">${matchStatus.mdTime}</span>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">${matchStatus.taName}</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">${matchStatus.mrHomeScore} : ${matchStatus.mrAwayScore}</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<div class="d-flex align-items-center gap-2">
							 <span class="badge bg-primary rounded-3 fw-semibold" data-bs-toggle="modal" data-bs-target="#scoreModal" onclick="saveMrNum(${matchStatus.mrNum})">거절(다시입력)</span>
							 </div>`
					html += `</td>`
					html += `</tr>`
				}
				if (matchStatus.mrRequestStatus == '3') {
					html += `<tr>`
					html += `<td class="border-bottom-0">`
					html += `<h6 class="fw-semibold mb-0">${matchStatus.mdAddress}</h6>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<h6 class="fw-semibold mb-1">${matchStatus.mdDate}</h6>
							 <span class="fw-normal">${matchStatus.mdTime}</span>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">${matchStatus.taName}</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">${matchStatus.mrHomeScore} : ${matchStatus.mrAwayScore}</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<div class="d-flex align-items-center gap-2">`
					if (matchStatus.mrWinLoose == '승리') {
						html += `<span class="badge bg-primary rounded-3 fw-semibold">Win</span>
							 	</div>`
					} else if (matchStatus.mrWinLoose == '패배') {
						html += `<span class="badge bg-danger rounded-3 fw-semibold">Lose</span>
							 	</div>`
					} else {
						html += `<span class="badge bg-success rounded-3 fw-semibold">draw</span>
							 	</div>`
					}
					html += `</td>`
					html += `</tr>`
					//상태 검사


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
					html += `<p class="mb-0 fw-normal">${matchStatus.taName}</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">0 : 0</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<div class="d-flex align-items-center gap-2">
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
					html += `<p class="mb-0 fw-normal">${matchStatus.taName}</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">${matchStatus.mrHomeScore} : ${matchStatus.mrAwayScore}</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<div style="text-align: -webkit-center";>
							 <button class="btn btn-secondary m-1" id="accept-button" data-bs-toggle="modal" data-bs-target="#mannerModal" onclick="saveMrNum(${matchStatus.mrNum})">수락</button>
							 <button class="btn btn-danger m-1" onclick="saveMrNum(${matchStatus.mrNum},1)">거절</button>
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
					html += `<p class="mb-0 fw-normal">${matchStatus.taName}</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">0 : 0</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<div class="d-flex align-items-center gap-2">
							 <span class="badge rounded-pill text-bg-secondary">재입력 대기중</span>
							 </div>`
					html += `</td>`
					html += `</tr>`
				} else if (matchStatus.mrRequestStatus == '3') {
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
					html += `<p class="mb-0 fw-normal">${matchStatus.taName}</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">${matchStatus.mrHomeScore} : ${matchStatus.mrAwayScore}</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<div class="d-flex align-items-center gap-2">`
					if (matchStatus.mrWinLoose == '승리') {
						html += `<span class="badge bg-primary rounded-3 fw-semibold">Win</span>
							 	</div>`
					} else if (matchStatus.mrWinLoose == '패배') {
						html += `<span class="badge bg-danger rounded-3 fw-semibold">Loose</span>
							 	</div>`
					} else {
						html += `<span class="badge bg-success rounded-3 fw-semibold">draw</span>
							 	</div>`
					}
					html += `</td>`
					html += `</tr>`

				}
			}
		}
	}

	document.querySelector('#match-record-tbody').innerHTML = html;
}

async function getHomeAjaxList(evt, page) {
	let total = 0;
	let pageSize = 5;
	const blockSize = 5;

	if (!page) {
		page = 1;
	}

	let url = `/match-result-home-infos?page=${page}&pageSize=${pageSize}&taHomeNum=${taNum}`;
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
		pageHtml += `<li class="page-item"><a class="page-link" aria-label="Previous" href="javascript:void(0)" onclick="getHomeAjaxList(event,${startBlock - 1})"><span aria-hidden="true">&laquo;</span></a></li>`;
	}

	for (let i = startBlock; i <= endBlock; i++) {
		pageHtml += `<li class="page-item"><a class="page-link" href="javascript:void(0)" onclick="getHomeAjaxList(event,${i})">${i}</a></li>`;
	}

	if (endBlock < pageBlock) {
		pageHtml += `<li class="page-item"><a  class="page-link" aria-label="Next" href="javascript:void(0)" onclick="getHomeAjaxList(event,${endBlock + 1})"><span aria-hidden="true">&raquo;</span></a></li>`;
	}


	document.querySelector('#pageDiv').innerHTML = pageHtml;

	//여기서 상태별로 화면에 다르게 보여야함

	let html = '';
	if (pageInfos.list.length == 0) {
		html += '<tr><td colspan="5">비어있는 리스트 입니다.</td></tr>';
	} else {
		for (let matchStatus of pageInfos.list) {
			let height;
			let backgroundColor;
			let borderRadius;

			if (matchStatus.taHomeNum == taNum) {
				if (matchStatus.mrRequestStatus == '0') {
					html += `<tr>`
					html += `<td class="border-bottom-0">`
					html += `<h6 class="fw-semibold mb-0">${matchStatus.mdAddress}</h6>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<h6 class="fw-semibold mb-1">${matchStatus.mdDate}</h6>
							 <span class="fw-normal">${matchStatus.mdTime}</span>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">${matchStatus.taName}</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">0 : 0</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<div class="d-flex align-items-center gap-2">
							 <span class="badge bg-primary rounded-3 fw-semibold" data-bs-toggle="modal" data-bs-target="#scoreModal" onclick="saveMrNum(${matchStatus.mrNum})>경기종료</span>
							 </div>`
					html += `</td>`
					html += `</tr>`
					/*html += `<span>${matchStatus.mdDate}<br>${matchStatus.mdTime}</span>`;
					html += `<span>${matchStatus.mdAddress} | ${matchStatus.taName}</span>`;
					html += `<span><button type="button" class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#scoreModal" onclick="saveMrNum(${matchStatus.mrNum})">
							경기종료
						</button></span>`;*/
				}
				if (matchStatus.mrRequestStatus == '1') {
					html += `<tr>`
					html += `<td class="border-bottom-0">`
					html += `<h6 class="fw-semibold mb-0">${matchStatus.mdAddress}</h6>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<h6 class="fw-semibold mb-1">${matchStatus.mdDate}</h6>
							 <span class="fw-normal">${matchStatus.mdTime}</span>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">${matchStatus.taName}</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">${matchStatus.mrHomeScore} : ${matchStatus.mrAwayScore}</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<div class="d-flex align-items-center gap-2">
							 <span class="badge bg-primary rounded-3 fw-semibold">수락 대기중</span>
							 </div>`
					html += `</td>`
					html += `</tr>`
				}
				if (matchStatus.mrRequestStatus == '2') {
					html += `<tr>`
					html += `<td class="border-bottom-0">`
					html += `<h6 class="fw-semibold mb-0">${matchStatus.mdAddress}</h6>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<h6 class="fw-semibold mb-1">${matchStatus.mdDate}</h6>
							 <span class="fw-normal">${matchStatus.mdTime}</span>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">${matchStatus.taName}</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">${matchStatus.mrHomeScore} : ${matchStatus.mrAwayScore}</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<div class="d-flex align-items-center gap-2">
							 <span class="badge bg-primary rounded-3 fw-semibold" data-bs-toggle="modal" data-bs-target="#scoreModal" onclick="saveMrNum(${matchStatus.mrNum})">거절(다시입력)</span>
							 </div>`
					html += `</td>`
					html += `</tr>`
				}
				if (matchStatus.mrRequestStatus == '3') {
					html += `<tr>`
					html += `<td class="border-bottom-0">`
					html += `<h6 class="fw-semibold mb-0">${matchStatus.mdAddress}</h6>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<h6 class="fw-semibold mb-1">${matchStatus.mdDate}</h6>
							 <span class="fw-normal">${matchStatus.mdTime}</span>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">${matchStatus.taName}</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<p class="mb-0 fw-normal">${matchStatus.mrHomeScore} : ${matchStatus.mrAwayScore}</p>`
					html += `</td>`
					html += `<td class="border-bottom-0">`
					html += `<div class="d-flex align-items-center gap-2">`
					if (matchStatus.mrWinLoose == '승리') {
						html += `<span class="badge bg-primary rounded-3 fw-semibold">Win</span>
							 	</div>`
					} else if (matchStatus.mrWinLoose == '패배') {
						html += `<span class="badge bg-danger rounded-3 fw-semibold">Loose</span>
							 	</div>`
					} else {
						html += `<span class="badge bg-success rounded-3 fw-semibold">draw</span>
							 	</div>`
					}
					html += `</td>`
					html += `</tr>`
					//상태 검사


				}
			}
		}

		document.querySelector('#match-record-tbody').innerHTML = html;

	}
}

async function getAwayAjaxList(evt, page) {
	let total = 0;
	let pageSize = 5;
	const blockSize = 5;

	if (!page) {
		page = 1;
	}

	let url = `/match-result-away-infos?page=${page}&pageSize=${pageSize}&taAwayNum=${taNum}`;
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
		pageHtml += `<li class="page-item"><a class="page-link" aria-label="Previous" href="javascript:void(0)" onclick="getAwayAjaxList(event,${startBlock - 1})"><span aria-hidden="true">&laquo;</span></a></li>`;
	}

	for (let i = startBlock; i <= endBlock; i++) {
		pageHtml += `<li class="page-item"><a class="page-link" href="javascript:void(0)" onclick="getAwayAjaxList(event,${i})">${i}</a></li>`;
	}

	if (endBlock < pageBlock) {
		pageHtml += `<li class="page-item"><a  class="page-link" aria-label="Next" href="javascript:void(0)" onclick="getAwayAjaxList(event,${endBlock + 1})"><span aria-hidden="true">&raquo;</span></a></li>`;
	}

	document.querySelector('#pageDiv').innerHTML = pageHtml;

	// away
	let html = '';
	if (pageInfos.list.length == 0) {
		html += '<tr><td colspan="5">비어있는 리스트 입니다.</td></tr>';
	} else {
		for (let matchStatus of pageInfos.list) {
			let height;
			let backgroundColor;
			let borderRadius;

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
				html += `<p class="mb-0 fw-normal">${matchStatus.taName}</p>`
				html += `</td>`
				html += `<td class="border-bottom-0">`
				html += `<p class="mb-0 fw-normal">0 : 0</p>`
				html += `</td>`
				html += `<td class="border-bottom-0">`
				html += `<div class="d-flex align-items-center gap-2">
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
				html += `<p class="mb-0 fw-normal">${matchStatus.taName}</p>`
				html += `</td>`
				html += `<td class="border-bottom-0">`
				html += `<p class="mb-0 fw-normal">${matchStatus.mrHomeScore} : ${matchStatus.mrAwayScore}</p>`
				html += `</td>`
				html += `<td class="border-bottom-0">`
				html += `<div class="d-flex align-items-center gap-2">
							 <button class="btn btn-secondary m-1" id="accept-button" data-bs-toggle="modal" data-bs-target="#mannerModal" onclick="saveMrNum(${matchStatus.mrNum})">수락</button>
							 </div>`
				html += `<div class="d-flex align-items-center gap-2">
							 <button class="btn btn-danger m-1" onclick="saveMrNum(${matchStatus.mrNum},1)">거절</button>
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
				html += `<p class="mb-0 fw-normal">${matchStatus.taName}</p>`
				html += `</td>`
				html += `<td class="border-bottom-0">`
				html += `<p class="mb-0 fw-normal">0 : 0</p>`
				html += `</td>`
				html += `<td class="border-bottom-0">`
				html += `<div class="d-flex align-items-center gap-2">
							 <span class="badge rounded-pill text-bg-secondary">재입력 대기중</span>
							 </div>`
				html += `</td>`
				html += `</tr>`
			} else if (matchStatus.mrRequestStatus == '3') {
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
				html += `<p class="mb-0 fw-normal">${matchStatus.taName}</p>`
				html += `</td>`
				html += `<td class="border-bottom-0">`
				html += `<p class="mb-0 fw-normal">${matchStatus.mrHomeScore} : ${matchStatus.mrAwayScore}</p>`
				html += `</td>`
				html += `<td class="border-bottom-0">`
				html += `<div class="d-flex align-items-center gap-2">`
				if (matchStatus.mrWinLoose == '승리') {
					html += `<span class="badge bg-primary rounded-3 fw-semibold">Win</span>
							 	</div>`
				} else if (matchStatus.mrWinLoose == '패배') {
					html += `<span class="badge bg-danger rounded-3 fw-semibold">Loose</span>
							 	</div>`
				} else {
					html += `<span class="badge bg-success rounded-3 fw-semibold">draw</span>
							 	</div>`
				}
				html += `</td>`
				html += `</tr>`

			}
		}


		document.querySelector('#match-record-tbody').innerHTML = html;
	}

}

function saveMrNum(mrNum, check) {
	this.mrNum = mrNum;
	console.log(mrNum);
	if (check != null || check != undefined) {
		updateMatchResultCancle();
	}
}

async function updateMatchResultCancle() {
	let mrNum = this.mrNum;
	const body = {
		mrNum: mrNum,
		mrRequestStatus: '2'
	};
	const res = await fetch(`/match-result-infos`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body)
	});
	const result = await res.json();
	if (result.resultMsg == "결과 입력 완료") {
		alert("거절 완료")
	} else {

		alert(result.resultMsg)
	}
	getAwayAjaxList();

	$('#mannerModal').modal('hide').data('bs.modal', null);
}

async function updateMatchResultAccept() {
	let mrNum = this.mrNum;
	let homeMannerPoint = document.querySelector('#mannerPointInput2').value;
	console.log(homeMannerPoint);
	const body = {
		mrNum: mrNum,
		mrHomeMannerPoint: homeMannerPoint,
		mrRequestStatus: '3'
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
	getAwayAjaxList();

	$('#mannerModal').modal('hide').data('bs.modal', null);
}

async function updateFirstMatchResult() {
	let homeScore = document.querySelector('#homeScoreInput').value;
	let awayScore = document.querySelector('#awayScoreInput').value;
	let awayMannerPoint = document.querySelector('#mannerPointInput').value;
	let mrNum = this.mrNum;

	const body = {
		mrNum: mrNum,
		mrHomeScore: homeScore,
		mrAwayScore: awayScore,
		mrAwayMannerPoint: awayMannerPoint,
		mrRequestStatus: '1'
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
	getHomeAjaxList();

	$('#scoreModal').modal('hide').data('bs.modal', null);
}

window.addEventListener('load', getAjaxList);