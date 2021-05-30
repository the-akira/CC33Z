import cv2

# Caminho da imagem
image_path = 'imagens/supercvIV.jpg'

# Carregando a imagem
image = cv2.imread(image_path)

# Convertendo a imagem para escala de cinza
gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Salvando a imagem
cv2.imwrite('imagens/supercvIV_gray.jpg',gray_image)
print('Nova imagem salva com sucesso!')