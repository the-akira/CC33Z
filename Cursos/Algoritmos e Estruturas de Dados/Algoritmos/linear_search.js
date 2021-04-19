function linearSearch(array, item) {
	for(const [i, element] of array.entries()) {
		if (element === item) {
	  		return i
		}
	}
	return -1
}

let i = linearSearch([99, 50, 3, 77, 1, 13, 17], 17)
console.log("Elemento se encontra no índice: " + i) 