export default function counter(state=0,action){
	switch(action.type){
		case "add" :
			return state += 10;
		case "remove" :
			return state -= 10;
		default :
			return state;
	}
} 