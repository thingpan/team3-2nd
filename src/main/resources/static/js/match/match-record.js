const urlParams = new URLSearchParams(window.location.search);
const taNum = urlParams.get('taNum');

async function getTeamInfo() {
	
	const res = await fetch(`/team-info?taNum=${taNum}`);
	const teamInfo = await res.json();
	console.log(teamInfo);

	document.querySelector('#taName').innerHTML = teamInfo.taName;
	document.querySelector('#taDesc').innerHTML = teamInfo.taDesc;

	if (teamInfo.taType == '농구') {
		type = 'basketball';
	} else if (teamInfo.taType == '야구') {
		type = 'baseball';
	} else if (teamInfo.taType == '축구') {
		type = 'soccerball';
	}

	if (teamInfo.taFilePath == null) {
		document.querySelector('#teamImg').src = `/imgs/${type}.png`
	} else {
		try {
			document.querySelector('#teamImg').src = teamInfo.taFilePath;
		} catch {
			document.querySelector('#teamImg').src = `/imgs/${type}.png`
		}

	}



}

window.addEventListener('load', getTeamInfo);