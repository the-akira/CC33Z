import cv2

# Carregando a imagem
img = cv2.imread('imagens/goku.png')

# Obtendo a dimensão da imagem
altura, largura, canais = img.shape
print(f'Altura: {altura} | Largura: {largura} | Canais: {canais}')

# Cortando a imagem
# altura_inicial:altura_final, largura_inicial:largura_final
img_cropped = img[0:150,30:470]

cv2.imshow('Imagem', img)
cv2.imshow('Cropped Image', img_cropped)
cv2.waitKey(0)