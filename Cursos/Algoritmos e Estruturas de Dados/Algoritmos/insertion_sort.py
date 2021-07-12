def insertion_sort(array):
    for j in range(1, len(array)):
        key = array[j]
        i = j

        while i > 0 and array[i - 1] > key:
            array[i] = array[i -1]
            i = i - 1

        array[i] = key

if __name__ == '__main__':
    array = [5, 2, 4, 6, 1, 3]
    insertion_sort(array)
    print(f'Array ordenado: {array}')