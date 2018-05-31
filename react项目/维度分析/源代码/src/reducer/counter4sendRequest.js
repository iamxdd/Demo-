let now = new Date();
let defaultState = {
	startTime: now.getTime(),
	endTimme: now.getTime() + 15 * 60 * 1000
}
const conter4sendRequests = (state = defaultState, action) => {
	return Object.assign({}, state);
}

export default conter4sendRequests;