let bookList = {}
fetch(endpoint)
	.then(blob => blob.json())
	.then(data => bookList = data.categories)

function findMatches(wordToMatch, bookList) {
	let filteredList = [];
	const regex = new RegExp(wordToMatch, 'gi');
	for (let i = 0; i < bookList.length; i++) {
		for (let j = 0; j < bookList[i].books.length; j++) {
			if (bookList[i].books[j].name.match(regex) || bookList[i].books[j].author.match(regex)) {
				filteredList.push(bookList[i].books[j]);
			}
		}
	}
	return filteredList;
}

function displayMatches() {
	const matchArray = findMatches(this.value, bookList);
	const html = matchArray.map(book => {
		const regex = new RegExp(this.value, 'gi');
		const bookName = book.name.replace(regex, `<span class="hl">${this.value}</span>`);
		const bookAuthor = book.author.replace(regex, `<span class="hl">${this.value.toUpperCase()}</span>`);
		return `
	<li>
		<span class="name"><a href="${book.url}"><i class="fa-solid fa-download space"></i></a> ${bookName}</span>
		<span class="author">${bookAuthor}</span>
	</li>
	`;
	}).join('');
	suggestions.innerHTML = html;
}

const searchInput = document.querySelector('.search');
const suggestions = document.querySelector('.suggestions');

searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', displayMatches);