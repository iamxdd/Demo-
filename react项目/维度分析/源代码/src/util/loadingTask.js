const commonHandle = window.commonHandle;

export function addLoadingTask(uid) {
	document.querySelector("#loadMask").style.zIndex = 100000;
	
	document.querySelector("#left").style.filter = "blur(3px)";
	document.querySelector("#left").style["-webkit-filter"] = "blur(3px)";
	document.querySelector("#right").style.filter = "blur(3px)";
	document.querySelector("#right").style["-webkit-filter"] = "blur(3px)";
	document.querySelector("#mask").style.filter = "blur(3px)";
	document.querySelector("#mask").style["-webkit-filter"] = "blur(3px)";
	window.loadTask[uid] = true;
	commonHandle.fire("setLoading", true);
};
export function deleteLoadingTask(uid) {
	delete(window.loadTask[uid]);
	var loadStates = Object.keys(window.loadTask);
	if (loadStates.length === 0) {
		commonHandle.fire("setLoading", false);
		document.querySelector("#loadMask").style.zIndex = -100000;
		
		document.querySelector("#left").style.filter = "";
		document.querySelector("#left").style["-webkit-filter"] = "";
		document.querySelector("#right").style.filter = "";
		document.querySelector("#right").style["-webkit-filter"] = "";
		document.querySelector("#mask").style.filter = "";
		document.querySelector("#mask").style["-webkit-filter"] = "";
	}
};