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

def get_contours(img):
    contours, hierarchy = cv2.findContours(img,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE)
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area > 500:
            cv2.drawContours(img_contour,cnt,-1,(255,0,0),3)
            perimeter = cv2.arcLength(cnt,True)
            approx = cv2.approxPolyDP(cnt,0.02*perimeter,True)
            obj_cor = len(approx)
            x, y, w, h = cv2.boundingRect(approx)
            if obj_cor == 3:
                object_type = 'Tri'
            elif obj_cor == 4:
                aspect_ratio = w/float(h)
                if aspect_ratio > 0.95 and aspect_ratio < 1.05:
                    object_type = 'Square'
                else:
                    object_type = 'Rect'
            elif obj_cor > 4:
                object_type = 'Circle'
            else:
                object_type = None
            cv2.rectangle(img_contour, (x,y), (x+w,y+h), (0,255,0), 2)
            cv2.putText(img_contour, object_type,
                (x+(w//2)-45, y+(h//2)-10), cv2.FONT_HERSHEY_COMPLEX, 0.9, (0,0,0),3)	

path = 'imagens/shapes.png'
img = cv2.imread(path)
img_contour = img.copy()
img_gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
img_blur = cv2.GaussianBlur(img_gray,(7,7),1)
img_canny = cv2.Canny(img_blur,50,50)
img_blank = np.zeros_like(img)

get_contours(img_canny)

img_stack = stack_images(0.6,([img, img_gray, img_blur],
    [img_canny, img_contour, img_blank]))

cv2.imshow('Stacked Images',img_stack)
cv2.waitKey(0)