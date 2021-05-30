import numpy as np 
import cv2 

img = cv2.imread('imagens/cards.jpg')

width, height = 250,350

# Pontos da carta K (Rei)
pts1 = np.float32([[111,219],[287,188],[154,482],[352,440]])
pts2 = np.float32([[0,0],[width,0],[0,height],[width,height]])
matrix = cv2.getPerspectiveTransform(pts1,pts2)
img_output = cv2.warpPerspective(img,matrix,(width,height))

cv2.imshow('Cards',img)
cv2.imshow('Output',img_output)
cv2.waitKey(0)