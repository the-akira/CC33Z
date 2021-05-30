import cv2

image = cv2.imread('imagens/pixels_colors.png', cv2.IMREAD_COLOR)

# Imprimir a matriz de intensidade de pixels
# Imagens coloridas: cada pixel tipicamente consiste de:
# 24 bits (3 bytes) de componentes RGB (Red-Green-Blue)
print(image)

# Dimensões da imagem
# Imagens coloridas possuem 3 dimensões
(h, w, d) = image.shape
print("width={}, height={}, depth={}".format(w, h, d))

# Apresentar a imagem
cv2.imshow('Computer Vision', image)
cv2.waitKey(0)
cv2.destroyAllWindows()