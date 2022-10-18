let bookList = [];
fetch(endpoint)
	.then(blob => blob.json())
	.then(data => bookList = data)

function findMatches(wordToMatch, bookList) {
	let filteredList = [];
	const regex = new RegExp(wordToMatch, 'gi');
	for (let i = 0; i < bookList.length; i++) {
		if (bookList[i].book_name.match(regex) || bookList[i].author_name.match(regex)) {
			filteredList.push(bookList[i]);
		}
	}
	return filteredList;
}

function displayMatches() {
	const matchArray = findMatches(this.value, bookList);
	const isMobile = /Android|iPhone/i.test(navigator.userAgent) ? true : false;
	const maxNum = isMobile ? 8 : 10;
	const html = matchArray.map((book, index, array) => {
		const regex = new RegExp(this.value, 'gi');
		const bookName = book.book_name.replace(regex, `<span class="text-orange-500">${this.value}</span>`);
		const bookAuthor = book.author_name.replace(regex, `<span class="text-orange-500">${this.value.toUpperCase()}</span>`);
		const normal = `<li class="flex justify-between items-center p-4 bg-gradient-to-r from-white to-slate-200 text-sm md:text-base">
			<span class="font-bold">
				<a href="${book.uri}"><i class="fa-solid fa-download"> </i></a>
				${bookName}
			</span>
			<span class="font-bold">${bookAuthor}</span>
		</li>`
		const abnormal = `<li class="flex justify-center items-center p-4 bg-gradient-to-r from-white to-slate-200 text-sm md:text-base">
			<span class="font-bold">. . .</span>
		</li>`;
		if (array.length <= maxNum) {
			return normal;
		} else {
			if (index === maxNum / 2 + 1) {
				return abnormal;
			} else if (index < maxNum / 2 || index > array.length - maxNum / 2 - 1) {
				return normal;
			} else {
				return null;
			}
		}
	}).join('');
	suggestionList.innerHTML = html;
}

const searchInput = document.querySelector('#searchInput');
const suggestionList = document.querySelector('#suggestionList');

searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', displayMatches);