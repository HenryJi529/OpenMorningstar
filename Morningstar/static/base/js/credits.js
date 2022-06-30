
let homepageNodes = document.querySelectorAll(".homepage");
let licenseNodes = document.querySelectorAll(".license");

homepageNodes.forEach(homepageNode => {
	homepageNode.addEventListener("click", () => {
		homepageUrl = homepageNode.getAttribute("data-homepage-url");
		window.open(homepageUrl);
	});
})

licenseNodes.forEach(licenseNode => {
	licenseNode.addEventListener("click", () => {
		licenseUrl = licenseNode.getAttribute("data-license-url");
		licenseTextNode = licenseNode.parentNode.parentNode.parentNode.querySelector(".license-text")
		if (licenseNode.getAttribute("data-text-hide") === "true") {
			licenseNode.setAttribute("data-text-hide", "false");
			licenseNode.innerText = "hide license";
			fetch(licenseUrl).then(blob => blob.text()).then(text => {
				licenseTextNode.innerText = text;
			});
		} else {
			licenseNode.setAttribute("data-text-hide", "true");
			licenseNode.innerText = "show license";
			licenseTextNode.innerText = "";
		}

	});
});


