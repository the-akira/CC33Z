function maxHeap(arr, i) {
    const left = 2 * i + 1
    const right = 2 * i + 2
    let max = i

    if (left < arrLength && arr[left] > arr[max]) {
        max = left
    }

    if (right < arrLength && arr[right] > arr[max])     {
        max = right
    }

    if (max != i) {
        swap(arr, i, max)
        maxHeap(arr, max)
    }
}

function swap(arr, indexA, indexB) {
    const temp = arr[indexA]
    arr[indexA] = arr[indexB]
    arr[indexB] = temp
}

function heapSort(arr) {   
    arrLength = arr.length

    for (let i = Math.floor(arrLength / 2); i >= 0; i -= 1)      {
        maxHeap(arr, i)
      }

    for (i = arr.length - 1; i > 0; i--) {
        swap(arr, 0, i)
        arrLength--
        maxHeap(arr, 0)
    }
    return
}

let arrLength
const array = [11, 2, 9, 13, 57, 25, 17, 1, 90, 3]
heapSort(array)
console.log(array)