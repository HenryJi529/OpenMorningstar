const isMobile = /Android|iPhone/i.test(navigator.userAgent) ? true : false;
if (isMobile) {
	setInterval(() => {
		if (document.documentElement.scrollTop > 90) {
			document.querySelector('#headBar .title').style.display = 'none';
			document.querySelector('#headBar .nav').style.marginTop = "10px";
		} else {
			document.querySelector('#headBar .title').style.display = 'block';
			document.querySelector('#headBar .nav').style.marginTop = "0";
		}
	}, 500);

} 