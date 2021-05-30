import numpy as np 
import cv2

# Definindo a imagem preta
img = np.zeros((512,512,3),np.uint8)

# Mudando a cor da imagem para cinza
img[:] = 50,50,50

# Desenhando linhas
# Imagem, ponto inicial, ponto final, cor, expessura
cv2.line(img, (0,0), (512, 512), (0,255,0), 5)
cv2.line(img, (0,512), (512, 0), (0,255,0), 5)

# Desenhando um retângulo
# Imagem, ponoto inicial, ponto final, cor, expessura
cv2.rectangle(img, (80,180), (420,300), (30,30,200), cv2.FILLED)

# Desenhando um círculo
# Imagem, ponto central, raio, cor, expessura
cv2.circle(img, (256,90), 30, (255,200,0), 4)

# Colocando Texto na Imagem
# Imagem, texto a ser apresentado, ponto de origem, Fonte, escala, cor, expessura
cv2.putText(img, 'OpenCV', (165,250), cv2.FONT_HERSHEY_COMPLEX, 1.4, (240,240,240), 3)

# Apresentamos a imagem
cv2.imshow('Imagem',img)
cv2.waitKey(0)