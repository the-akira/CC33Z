function partition(arr, p, r){
    const pivot = arr[r];
    let i = p; 
    for (let j = p; j < r; j++) {
        if (arr[j] < pivot) {
            [arr[j], arr[i]] = [arr[i], arr[j]];
            i++;
        }
    }
    [arr[i], arr[r]] = [arr[r], arr[i]] 
    return i;
};

function quickSort(arr, p, r) {
    if (p >= r) {
        return;
    }
    
    let i = partition(arr, p, r);
    
    quickSort(arr, p, i - 1);
    quickSort(arr, i + 1, r);
}

array = [2, 8, 7, 1, 3, 5, 6, 4]
quickSort(array, 0, array.length - 1)
console.log(array)