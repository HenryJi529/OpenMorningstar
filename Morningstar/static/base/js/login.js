const imageCode = document.querySelector('#image_code')
const identityInput = document.querySelector('#id_identity')
const imageCaptchaInput = document.querySelector('#id_image_captcha')


document.querySelector('#change_password_button').addEventListener('click', (e) => {
	if (identityInput.value && imageCaptchaInput.value) {
		e.target.setAttribute('disabled', 'disabled')
		setTimeout(() => {
			e.target.removeAttribute('disabled')
		}, 3000)
		fetch(changePasswordUrl + `?identity=${identityInput.value}&image_captcha=${imageCaptchaInput.value}`,
			{
				method: 'GET',
			}).then(res => res.json())
			.then(data => {
				document.querySelector('#image_captcha_check').innerText = data.message;
				setTimeout(() => {
					document.querySelector('#image_captcha_check').innerText = "";
				}, 2000)
			})
	} else {
		e.target.setAttribute('disabled', 'disabled')
		setTimeout(() => {
			e.target.removeAttribute('disabled')
		}, 2000)
	}
})


// 图片验证码刷新
imageCode.addEventListener('click', (e) => {
	let oldSrc = e.target.getAttribute('src');
	e.target.setAttribute('src', oldSrc + "?");
})
setInterval(() => {
	let oldSrc = imageCode.getAttribute('src');
	imageCode.setAttribute('src', oldSrc + "?");
}, 60 * 1000)
