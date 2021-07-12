import cv2

cc = cv2.CascadeClassifier('haarcascade_frontalface_alt.xml')

video_capture = cv2.VideoCapture('vídeos/video.mp4')
video_capture.set(3, 640)
video_capture.set(4, 480)

while True:
    ret, img = video_capture.read()

    gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    detected_faces = cc.detectMultiScale(gray_img,scaleFactor=1.1,minNeighbors=4,minSize=(30,30))

    for (x, y, width, height) in detected_faces:
        cv2.rectangle(img, (x, y), (x + width, y + height), (0, 0, 255), 10)

    cv2.imshow('Real-Time Face Detection', img)

    key = cv2.waitKey(15) & 0xff
    if key == 27:
        break

video_capture.release()
cv2.destroyAllWindows()