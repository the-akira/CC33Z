import numpy as np 
import cv2 

imagem = cv2.imread('imagens/Lenna.png')
kernel = np.ones((5,5),np.uint8)

# Converter para escala de cinza
img_gray = cv2.cvtColor(imagem, cv2.COLOR_BGR2GRAY)

# Aplicar Blur
img_blur = cv2.GaussianBlur(img_gray, (11,11), 0)

# Detecção de edges (bordas)
img_canny = cv2.Canny(imagem, 150, 200)

# Dilatação
img_dilated = cv2.dilate(img_canny, kernel, iterations=1)

# Erosão
img_eroded = cv2.erode(img_dilated, kernel, iterations=1)

# Apresentando as imagens
cv2.imshow('Gray Image', img_gray)
cv2.imshow('Blur Image', img_blur)
cv2.imshow('Canny Image', img_canny)
cv2.imshow('Dilation Image', img_dilated)
cv2.imshow('Eroded Image', img_eroded)
cv2.waitKey(0)