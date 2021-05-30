from matplotlib import pyplot as plt 
from sklearn.cluster import KMeans
from numpy import linalg as LA
import numpy as np
import skimage
import cv2

"""
Referência: https://jrtechs.net
"""

def print_img(img):
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    plt.figure(figsize=(10,7))
    plt.imshow(rgb)
    plt.axis('off')
    plt.show()

def print_image(i1, i2):
    fig = plt.figure()
    ax1 = fig.add_subplot(1,2,1)
    ax1.imshow(cv2.cvtColor(i1, cv2.COLOR_BGR2RGB))
    ax2 = fig.add_subplot(1,2,2)
    ax2.imshow(cv2.cvtColor(i2, cv2.COLOR_BGR2RGB))
    plt.show()

def pixelate(img, w, h):
    height, width = img.shape[:2]
    temp = cv2.resize(img, (w, h), interpolation=cv2.INTER_LINEAR)
    return cv2.resize(temp, (width, height), interpolation=cv2.INTER_NEAREST)

def color_clustering(idx, img, k):
    cluster_values = []
    for _ in range(0, k):
        cluster_values.append([])
    
    for r in range(0, idx.shape[0]):
        for c in range(0, idx.shape[1]):
            cluster_values[idx[r][c]].append(img[r][c])

    img_c = np.copy(img)

    cluster_averages = []
    for i in range(0, k):
        cluster_averages.append(np.average(cluster_values[i], axis=0))
    
    for r in range(0, idx.shape[0]):
        for c in range(0, idx.shape[1]):
            img_c[r][c] = cluster_averages[idx[r][c]]
            
    return img_c

def segment_img_color_rgb(img, k):
    img_c = np.copy(img)
    
    h = img.shape[0]
    w = img.shape[1]
    
    img_c.shape = (img.shape[0] * img.shape[1], 3)
    kmeans = KMeans(n_clusters=k, random_state=0).fit(img_c).labels_
    kmeans.shape = (h, w)

    return kmeans

def k_means_image(image, k):
    idx = segment_img_color_rgb(image, k)
    return color_clustering(idx, image, k)

img = cv2.imread('imagens/tiger.jpg')
img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
img_128 = pixelate(img, 128, 128)
img_64 = pixelate(img, 64, 64)
img_32 = pixelate(img, 32, 32)

print_image(img, img_64)
print_img(k_means_image(img, 5))
print_img(k_means_image(img_128, 3))