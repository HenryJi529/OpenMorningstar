/*
子节点排序：左上A, 左下B, 右上C, 右下D
*/


// 转换颜色格式
function transformColorHex2Dec(hexColor) {
	// 16进制颜色值的正则
	let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
	// 把颜色值变成小写
	let color = hexColor.toLowerCase();
	if (reg.test(color)) {
		// 如果只有三位的值，需变成六位，如：#fff => #ffffff
		if (color.length === 4) {
			let colorNew = "#";
			for (let i = 1; i < 4; i += 1) {
				colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
			}
			color = colorNew;
		}
		// 处理六位的颜色值，转为RGB
		let colorChange = [];
		for (let i = 1; i < 7; i += 2) {
			colorChange.push(parseInt("0x" + color.slice(i, i + 2)));
		}
		return "RGB(" + colorChange.join(",") + ")";
	} else {
		return color;
	}
}


function transformColorDec2Hex(decColor) {
	// RGB颜色值的正则
	let reg = /^(rgb|RGB)/;
	let color = decColor;
	if (reg.test(color)) {
		let strHex = "#";
		// 把RGB的3个数值变成数组
		let colorArr = color.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
		// 转成16进制
		for (let i = 0; i < colorArr.length; i++) {
			let hex = Number(colorArr[i]).toString(16);
			if (hex === "0") {
				hex += hex;
			}
			hex = hex.length == 1 ? '0' + hex : hex;
			strHex += hex;
		}
		return strHex;
	} else {
		return String(color);
	}
}


// 获取平均颜色
function getAverageColor(fills) {
	function getListFromString(color) {
		return color.substring(4, color.length - 1).split(",").map(item => parseInt(item))
	}
	let lists = fills.map(item => getListFromString(item));
	let r = Math.floor(lists.reduce((pre, cur) => pre + cur[0], 0) / lists.length);
	let g = Math.floor(lists.reduce((pre, cur) => pre + cur[1], 0) / lists.length);
	let b = Math.floor(lists.reduce((pre, cur) => pre + cur[2], 0) / lists.length);
	return "RGB(" + r + "," + g + "," + b + ")";
}


function getCurrentFill(currentCx, currentCy, currentLevel) {
	let i, j, ind;
	if (currentLevel == 0) {
		i = Math.floor(currentCx / 3);
		j = Math.floor(currentCy / 4);
		ind = j * 2 ** maxLevel + i;
		return fills[ind];
	} else {
		let level = 0;
		// 获取左上角的填充
		let cxA = currentCx - 1.5;
		let cyA = currentCy - 2;
		let fillA = getCurrentFill(cxA, cyA, level);
		// 获取左下角的填充
		let cxB = currentCx - 1.5;
		let cyB = currentCy + 2;
		let fillB = getCurrentFill(cxB, cyB, level);
		// 获取右上角的填充
		let cxC = currentCx + 1.5;
		let cyC = currentCy - 2;
		let fillC = getCurrentFill(cxC, cyC, level);
		// 获取右下角的填充
		let cxD = currentCx + 1.5;
		let cyD = currentCy + 2;
		let fillD = getCurrentFill(cxD, cyD, level);
		return getAverageColor([fillA, fillB, fillC, fillD]);
	}
}


function getCurrentRx(currentLevel) {
	return 2 ** currentLevel / 2 * 3;
}


function getCurrentRy(currentLevel) {
	return 2 ** currentLevel / 2 * 4;
}


function getNextLevel(currentLevel) {
	return currentLevel - 1;
}


function getNextCxList(currentCx, currentLevel) {
	return [
		currentCx - getCurrentRx(currentLevel) / 2,
		currentCx - getCurrentRx(currentLevel) / 2,
		currentCx + getCurrentRx(currentLevel) / 2,
		currentCx + getCurrentRx(currentLevel) / 2,
	]
}


function getNextCyList(currentCy, currentLevel) {
	return [
		currentCy - getCurrentRy(currentLevel) / 2,
		currentCy + getCurrentRy(currentLevel) / 2,
		currentCy - getCurrentRy(currentLevel) / 2,
		currentCy + getCurrentRy(currentLevel) / 2,
	]
}


function createEllipse(currentCx, currentCy, currentRx, currentRy, currentFill, currentLevel) {
	let ellipse = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
	ellipse.setAttribute("cx", currentCx);
	ellipse.setAttribute("cy", currentCy);
	ellipse.setAttribute("rx", currentRx);
	ellipse.setAttribute("ry", currentRy);
	ellipse.setAttribute("fill", currentFill);
	ellipse.setAttribute("data-level", currentLevel);
	svg.appendChild(ellipse);


	setTimeout(() => {
		ellipse.addEventListener(trigger, (e) => {
			if (currentLevel > 1) {
				svg.removeChild(e.target)
				let nextLevel = getNextLevel(currentLevel);
				let nextCxList = getNextCxList(currentCx, currentLevel);
				let nextCyList = getNextCyList(currentCy, currentLevel);

				let nextRx = getCurrentRx(nextLevel);
				let nextRy = getCurrentRy(nextLevel);

				for (let i = 0; i < 4; i++) {
					createEllipse(nextCxList[i], nextCyList[i], nextRx, nextRy, getCurrentFill(nextCxList[i], nextCyList[i], nextLevel), nextLevel);
				}
			}
		}, { once: true });
	}, 500);


	return ellipse;
}


function autoFinish() {
	for (let level = maxLevel - 1; level > 0; level--) {
		svg.querySelectorAll(`ellipse[data-level="${level}"]`).forEach(item => {
			let nextLevel = getNextLevel(Number(item.getAttribute("data-level")));
			let nextCxList = getNextCxList(Number(item.getAttribute("cx")), Number(item.getAttribute("data-level")));
			let nextCyList = getNextCyList(Number(item.getAttribute("cy")), Number(item.getAttribute("data-level")));

			let nextRx = getCurrentRx(nextLevel);
			let nextRy = getCurrentRy(nextLevel);

			let ellipses = [];
			for (let i = 0; i < 4; i++) {
				ellipses.push(document.createElementNS("http://www.w3.org/2000/svg", "ellipse"))
			}
			for (let i = 0; i < 4; i++) {
				ellipses[i].setAttribute("cx", nextCxList[i]);
				ellipses[i].setAttribute("cy", nextCyList[i]);
				ellipses[i].setAttribute("rx", nextRx);
				ellipses[i].setAttribute("ry", nextRy);
				ellipses[i].setAttribute("fill", getCurrentFill(nextCxList[i], nextCyList[i], nextLevel));
				ellipses[i].setAttribute("data-level", nextLevel);
			}
			svg.removeChild(item);
			for (let i = 0; i < 4; i++) {
				svg.appendChild(ellipses[i]);
			}
		})
	}

}