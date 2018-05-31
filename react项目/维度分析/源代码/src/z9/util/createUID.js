const createUID = (length)=>{
		var string = "abcdefghijklmnopqrstuvwxyzABCDEFJHIJKLMNOPQRSTUVWXYZ1234567890_";
		var strings = string.split("");
		strings.sort(function() {
			return Math.random() > 0.5
		});
		strings.length = length || 5;
		return strings.join("");
}
export default createUID;