
window.addEventListener('load', async function() {
	try {
		const urlParams = new URL(location.href).searchParams;
		const taNum = urlParams.get('taNum');
		const res = await fetch(`/get-user-role?taNum=${taNum}`);
		const userRole = await res.json();
		console.log('uiRole', userRole);
		if (userRole && userRole.tuRole === "USER") {
			document.querySelector('#applyBar').style.display = 'none';
			document.querySelector('#recordBar').style.display = 'none';
			document.querySelector('#matchStatusBar').style.display = 'none';
			document.querySelector('#settingBar').style.display = 'none';
			
			return userRole.tuRole
		} else if (userRole && userRole.tuRole === "ADMIN") {
			return userRole.tuRole
		}
		else if (userRole === null) {
			document.querySelector('#applyBar').style.display = 'none';
			document.querySelector('#recordBar').style.display = 'none';
			document.querySelector('#matchStatusBar').style.display = 'none';
			document.querySelector('#settingBar').style.display = 'none';
		}
	} catch (error) {
		document.querySelector('#applyBar').style.display = 'none';
			document.querySelector('#recordBar').style.display = 'none';
			document.querySelector('#matchStatusBar').style.display = 'none';
			document.querySelector('#settingBar').style.display = 'none';
	}
});