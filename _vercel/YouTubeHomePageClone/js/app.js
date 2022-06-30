const endpoint = "https://youtube-homepage-clone.vercel.app/js/data.json"
let videoList;
let content = document.querySelector(".content")
let template = document.querySelector("#video-template")

fetch(endpoint)
	.then(blob => blob.json())
	.then(data => {
		videoList = data.items
		console.log(content)
		videoList.forEach(video => {
			console.log(video)
			const instance = document.importNode(template.content, true);
			// 跳转链接
			instance.querySelector(".video").setAttribute("onclick", `window.location.href='${video.url}'`)
			// 大图
			instance.querySelector(".thumbnail").src = video.img;
			// 时长
			instance.querySelector(".video-length").innerText = video.length;
			// 频道头像
			instance.querySelector(".channel-picture").querySelector('img').src = video.avatar;
			// 视频标题
			if (video.title.length > 30) {
				video.title = video.title.substring(0, 29) + "...";
			}
			instance.querySelector(".video-title").innerText = video.title;
			// 频道名
			instance.querySelector(".video-channel").innerText = video.channel;
			// 视频观看次数
			instance.querySelector(".views").innerText = video.views;
			// 视频上传时间
			instance.querySelector(".created").innerText = video.created;


			content.appendChild(instance)

		});
		console.log(content)
	})
