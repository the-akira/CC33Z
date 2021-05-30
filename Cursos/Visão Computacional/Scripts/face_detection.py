import matplotlib.pyplot as plt
import cv2

cc = cv2.CascadeClassifier('haarcascade_frontalface_alt.xml')

image = cv2.imread('imagens/ASTP_crews.jpg')
gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

detected_faces = cc.detectMultiScale(gray_image,scaleFactor=1.1,minNeighbors=10, minSize=(30,30))

for (x, y, width, height) in detected_faces:
	cv2.rectangle(image, (x, y), (x + width, y + height), (0, 0, 255), 10)

plt.figure(figsize=(13,8))
plt.imshow(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
plt.axis('off')
plt.show()