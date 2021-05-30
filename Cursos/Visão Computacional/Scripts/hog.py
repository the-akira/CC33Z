from skimage import data, feature
import matplotlib.pyplot as plt 

"""
hog = histogram of oriented gradients
"""

# buscamos a imagem de um astronauta
image = data.astronaut()
# imprimimos a dimensão da imagem
print(image.shape)

hog_vector, hog_image = feature.hog(image,orientations=9, pixels_per_cell=(8,8),
	cells_per_block=(2,2),block_norm='L2',visualize=True)

figure, axes = plt.subplots(1,2, figsize=(12,6), subplot_kw=dict(xticks=[], yticks=[]))

# Plotamos a primeira imagem
axes[0].imshow(image)
axes[0].set_title('Original Image')

# Mostramos o HOG da imagem relacionado
axes[1].imshow(hog_image)
axes[1].set_title('HOG Image')
plt.show()