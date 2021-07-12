import cv2
import numpy as np

def empty(e):
    pass

cv2.namedWindow('Trackbars')
cv2.resizeWindow('Trackbars',640,240)
cv2.createTrackbar('Hue Min','Trackbars',25,179,empty)
cv2.createTrackbar('Hue Max','Trackbars',179,179,empty)
cv2.createTrackbar('Sat Min','Trackbars',22,255,empty)
cv2.createTrackbar('Sat Max','Trackbars',98,255,empty)
cv2.createTrackbar('Val Min','Trackbars',137,255,empty)
cv2.createTrackbar('Val Max','Trackbars',255,255,empty)

path = 'imagens/Inuyasha.jpg'

while True:
    img = cv2.imread(path)
    img_hsv = cv2.cvtColor(img,cv2.COLOR_BGR2HSV)
	
    h_min = cv2.getTrackbarPos('Hue Min','Trackbars')
    h_max = cv2.getTrackbarPos('Hue Max','Trackbars')
    s_min = cv2.getTrackbarPos('Sat Min','Trackbars')
    s_max = cv2.getTrackbarPos('Sat Max','Trackbars')
    v_min = cv2.getTrackbarPos('Val Min','Trackbars')
    v_max = cv2.getTrackbarPos('Val Max','Trackbars')

    lower = np.array([h_min,s_min,v_min])
    upper = np.array([h_max,s_max,v_max])
    mask = cv2.inRange(img_hsv,lower,upper)
    img_result = cv2.bitwise_and(img,img,mask=mask)

    cv2.imshow('Original',img)
    cv2.imshow('HSV',img_hsv)
    cv2.imshow('Mask',mask)
    cv2.imshow('Result',img_result)

    ch = cv2.waitKey(1)
    # Tecla 'esc' para sair
    if ch == 27:
        break
    cv2.waitKey(100)

cv2.destroyAllWindows()
cv2.waitKey(1)