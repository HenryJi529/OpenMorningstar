// const endpoint = "http://127.0.0.1:8000/joke/api/?n=1"
const endpoint = "https://morningstar369.com/joke/api/?n=1"

const maxHeight = 600

fetch(endpoint)
    .then(response => response.json())
    .then(data => data.links[0])
    .then(link => {
        const imgElement = document.createElement('img')
        imgElement.src = link
        imgElement.onload = () => {
            if (imgElement.naturalHeight < maxHeight) {
                document.body.style.height = `${imgElement.naturalHeight}px`;
                document.body.style.width = `${imgElement.naturalWidth}px`;
            } else {
                document.body.style.height = `${maxHeight}px`;
                document.body.style.width = `${600 * imgElement.naturalWidth / imgElement.naturalHeight}px`;
            }
            document.body.appendChild(imgElement)
        }
    })