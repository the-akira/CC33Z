import numpy as np 
import cv2

def stack_images(scale,img_array):
    rows = len(img_array)
    cols = len(img_array[0])
    rows_available = isinstance(img_array[0], list)
    width = img_array[0][0].shape[1]
    height = img_array[0][0].shape[0]
    if rows_available:
        for x in range ( 0, rows):
            for y in range(0, cols):
                if img_array[x][y].shape[:2] == img_array[0][0].shape [:2]:
                    img_array[x][y] = cv2.resize(img_array[x][y], (0, 0), None, scale, scale)
                else:
                    img_array[x][y] = cv2.resize(img_array[x][y], (img_array[0][0].shape[1], img_array[0][0].shape[0]), None, scale, scale)
                if len(img_array[x][y].shape) == 2: img_array[x][y]= cv2.cvtColor( img_array[x][y], cv2.COLOR_GRAY2BGR)
        image_blank = np.zeros((height, width, 3), np.uint8)
        hor = [image_blank]*rows
        hor_con = [image_blank]*rows
        for x in range(0, rows):
            hor[x] = np.hstack(img_array[x])
        ver = np.vstack(hor)
    else:
        for x in range(0, rows):
            if img_array[x].shape[:2] == img_array[0].shape[:2]:
                img_array[x] = cv2.resize(img_array[x], (0, 0), None, scale, scale)
            else:
                img_array[x] = cv2.resize(img_array[x], (img_array[0].shape[1], img_array[0].shape[0]), None,scale, scale)
            if len(img_array[x].shape) == 2: img_array[x] = cv2.cvtColor(img_array[x], cv2.COLOR_GRAY2BGR)
        hor= np.hstack(img_array)
        ver = hor
    return ver 

img = cv2.imread('imagens/Lenna.png')
img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

img_stack = stack_images(0.5,([img,img,img],[img_gray,img_gray,img_gray]))
img_hor = np.hstack((img,img))
img_ver = np.vstack((img,img))

cv2.imshow('Horizontal',img_hor)
cv2.imshow('Vertical',img_ver)
cv2.imshow('Stacked',img_stack)
cv2.waitKey(0)