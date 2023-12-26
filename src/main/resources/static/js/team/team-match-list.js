/**
 * 
 */

const urlParams = new URLSearchParams(window.location.search);
const taNum = urlParams.get('taNum');

async function getTeamMatchList(evt, page) {
	if (!page) {
		page = 1;
	}
	let total = 0;
	let pageSize = 5;
	const blockSize = 5;
	const res = await fetch(`/match-infos?page=${page}&pageSize=${pageSize}&taNum=${taNum}`);
	const pageInfos = await res.json();
	console.log(pageInfos);

	const totalCnt = pageInfos.total;
	const pageBlock = Math.ceil(totalCnt / pageSize);
	const startBlock = (Math.ceil(page / blockSize) - 1) * blockSize + 1;
	let endBlock = startBlock + blockSize - 1;
	let pageHtml = '';


	if (endBlock > pageBlock) {
		endBlock = pageBlock;
	}

	if (startBlock != 1) {
		pageHtml += `<li class="page-item"><a class="page-link" aria-label="Previous" href="javascript:void(0)" onclick="getTeamMatchList(event,${startBlock - 1})"><span aria-hidden="true">&laquo;</span></a></li>`;
	}

	for (let i = startBlock; i <= endBlock; i++) {
		pageHtml += `<li class="page-item"><a class="page-link" href="javascript:void(0)" onclick="getTeamMatchList(event,${i})">${i}</a></li>`;
	}

	if (endBlock < pageBlock) {
		pageHtml += `<li class="page-item"><a  class="page-link" aria-label="Next" href="javascript:void(0)" onclick="getTeamMatchList(event,${endBlock + 1})"><span aria-hidden="true">&raquo;</span></a></li>`;
	}
	document.querySelector('#pageDiv').innerHTML = pageHtml;
	let html = '';
	for (let matchinfo of pageInfos.list) {
		if (matchinfo.activityStatus != '1') {
			let mbCredat = matchinfo.mbCredat;
			var mbCredatParsing = [mbCredat.slice(0, 4), "-", mbCredat.slice(4, 6), "-", mbCredat.slice(6, 8)].join('')

			html += `<tr onclick="doGoMatchViewPage(${matchinfo.mbNum})">`;
			html += `<td>${matchinfo.mbAddressDetail}</td>`;
			html += `<td>${matchinfo.mbDate} | ${matchinfo.mbTime}</td>`;
			html += `<td>${mbCredatParsing}</td>`;
			html += `<td>${matchinfo.mbAddress}</td>`;
			if(matchinfo.mbStatus == 1){
				html += `<td>신청마감</td>`;
			}else{
				html += `<td>모집중</td>`;
			}
			
			html += '</tr>';
		}
	}
	document.querySelector('#team-user-list-info').innerHTML = html;

}

function doGoMatchViewPage(mbNum) {
	location.href = `/page/match/match-view?mbNum=${mbNum}`;
}

window.addEventListener('load', getTeamMatchList());