const answerNumElements = document.querySelector('.List-headerText span');
const answerNum = answerNumElements.textContent.substring(0, answerNumElements.textContent.indexOf('个'));

setInterval(() => {
    let articles = document.querySelectorAll(".RichContent");
    let badge = document.createElement("p");
    badge.textContent = articles.length;

    answerNumElements.textContent = `${answerNum}个回答，已显示${articles.length}个`;
}, 2000);



