async function generateIncrement(maxx, fail) {
	var numx = maxx+1
	console.log(numx)
	console.log(fail)
	console.log(fail.includes(numx))
	if(fail.includes(numx)){
		console.log("Recursive call")
		console.log(numx)
		return generateIncrement(numx,fail)
	}else{
		return numx
	}
}


generateIncrement(0,[0,1,2,3]);
