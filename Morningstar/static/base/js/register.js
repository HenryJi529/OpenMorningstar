const submitButton = document.querySelector('#submit_button');

//提交功能实现
(function submitFunc() {
	submitButton.addEventListener("click", () => {
		submitButton.setAttribute('disabled', 'disabled');
		$.ajax({
			url: '',
			type: 'POST',
			data: $("#register_form").serialize(),
			dataType: "JSON",
			success: (data) => {
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
		})
	})
})();