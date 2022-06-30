const submitButton = document.querySelector('#submit_button');

function processData(data) {
	if (data.status === "success") {
		location.reload();
	} else {
		if (data.status === "success") {
			location.reload();
		} else {
			setTimeout(() => {
				submitButton.removeAttribute('disabled');
			}, 1000);
			for (let key in data.message) {
				document.querySelector(`#${key}_check`).innerText = data.message[key][0];
				setTimeout(() => {
					document.querySelector(`#${key}_check`).innerText = "";
				}, 2000)
			}
		}
	}
}
//提交功能实现
(function submitFunc() {
	submitButton.addEventListener("click", () => {
		submitButton.setAttribute('disabled', 'disabled');
		fetch('', {
			"method": "POST",
			"headers": {
				"X-CSRFToken": csrfToken,
				"content-type": "application/json",
			},
			"body": JSON.stringify({
				"csrfmiddlewaretoken": csrfToken,
				"username": document.querySelector("#id_username").value,
				"email": document.querySelector("#id_email").value,
				"password": document.querySelector("#id_password").value,
				"confirm_password": document.querySelector("#id_confirm_password").value,
				"g-recaptcha-response": document.querySelector("#g-recaptcha-response").value,
				"next": document.querySelector("#next").value,
			})
		}).then(res => res.json()).then(data => processData(data))
	})
})();
