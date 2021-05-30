import cv2

image = cv2.imread('imagens/pixels.png', cv2.IMREAD_GRAYSCALE)

# Imprimir a matriz de intensidade de pixels
# Valores próximos a 0: pixels escuros
# Valores próximos a 255: pixels claros
print(image)

# Dimensões da imagem
print(image.shape)

# Apresentar a imagem
cv2.imshow('Computer Vision', image)
cv2.waitKey(0)
cv2.destroyAllWindows()