def binary_search(arr,item):
    first = 0
    last = len(arr) - 1
    found = False
    while first <= last and not found:
        mid = (first + last)//2
        if arr[mid] == item:
            found = True
        else:
            if item < arr[mid]:
                last = mid - 1
            else:
                first = mid + 1	
    return item, found

if __name__ == '__main__':
    print(binary_search([6,12,17,23,38,45,77,84,90],45))
    print(binary_search([6,12,17,23,38,45,77,84,90],1))