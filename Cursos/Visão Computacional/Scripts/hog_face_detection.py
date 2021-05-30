from skimage import data, feature, transform
from skimage.io import imread
import matplotlib.pyplot as plt 
from sklearn.svm import SVC
from itertools import chain 
from sklearn.datasets import fetch_lfw_people
from sklearn.feature_extraction.image import PatchExtractor
import numpy as np

# Carregamos um conjunto de dados de faces humanas
human_faces = fetch_lfw_people()
positive_images = human_faces.images[:10000]

# Carregamos um conjunto de dados sem faces
non_face_topics = ['moon', 'text', 'coins']
negative_samples = [(getattr(data, name)()) for name in non_face_topics]

# Usaremos PatchExtractor para gerar diversas variantes dessas imagens
def generate_random_samples(image, num_of_gen_images=100, patch_size=positive_images[0].shape):
    extractor = PatchExtractor(patch_size=patch_size, max_patches=num_of_gen_images, random_state=42)
    patches = extractor.transform((image[np.newaxis]))
    return patches

# Vamos gerar 3000 amostras (exemplos negativos sem face humana)
negative_images = np.vstack([generate_random_samples(im, 1000) for im in negative_samples])

# Construímos o conjunto de treinamento com as variáveis de output (labels)
# Também devemos construir os HOG features
X_train = np.array([feature.hog(image) for image in chain(positive_images, negative_images)])
# labels -> 0 & 1 (1: face, 0: não-face)
y_train = np.zeros(X_train.shape[0])
y_train[:positive_images.shape[0]] = 1

# Construímos o modelo SVM
svm = SVC(C=100.0,gamma=0.001)
# Aqui é onde o SVM aprende os parâmetros para o modelo baseado no dataset
svm.fit(X_train, y_train)

# Lemos a imagem de teste
test_image = imread(fname='imagens/Bruce_Lee.jpg')
test_image = transform.resize(test_image, positive_images[0].shape)
test_image_hog = np.array([feature.hog(test_image)])

# Fazemos a previsão
prediction = svm.predict(test_image_hog)
print(f'Previsão feita por SVM: {prediction[0]}')

# Plotamos a imagem
plt.title(f'Previsão = {prediction[0]}')
plt.imshow(test_image, cmap='gray')
plt.show()