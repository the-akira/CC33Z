import mediapipe as mp
import time
import cv2 

cap = cv2.VideoCapture('vídeos/oracle.mp4')
ptime = 0

mp_face_detection = mp.solutions.face_detection 
mp_draw = mp.solutions.drawing_utils
face_detection = mp_face_detection.FaceDetection(0.75)

while True:
	success, img = cap.read()

	img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
	results = face_detection.process(img_rgb)

	if results.detections:
		for id,detection in enumerate(results.detections):
			bboxc = detection.location_data.relative_bounding_box
			ih, iw, ic = img.shape
			bbox = int(bboxc.xmin * iw), int(bboxc.ymin * ih), int(bboxc.width * iw), int(bboxc.height * ih)
			cv2.rectangle(img,bbox,(255,0,255),3)
			cv2.putText(img,f'{int(detection.score[0]*100)}%',(bbox[0],bbox[1]-20),cv2.FONT_HERSHEY_PLAIN,3,(255,0,255),2)
	
	ctime = time.time()
	fps = 1/(ctime-ptime)
	ptime = ctime
	cv2.putText(img,f'FPS: {int(fps)}',(20,70),cv2.FONT_HERSHEY_PLAIN,3,(0,255,0),2)

	cv2.imshow('Video',img)

	key = cv2.waitKey(1) & 0xff
	if key == 27:
		break

cap.release()
cv2.destroyAllWindows()