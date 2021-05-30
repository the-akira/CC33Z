import mediapipe as mp
import time
import cv2 

mp_draw = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose 
pose = mp_pose.Pose()

cap = cv2.VideoCapture('vídeos/taichi.mp4')
ptime = 0

while True:
	success, img = cap.read()

	img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
	results = pose.process(img_rgb)

	if results.pose_landmarks:
		mp_draw.draw_landmarks(img, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
		for id,lm in enumerate(results.pose_landmarks.landmark):
			h, w, c = img.shape
			cx, cy = int(lm.x * w), int(lm.y * h)
			if id == 20:
				cv2.circle(img, (cx,cy), 5, (255,0,255), cv2.FILLED)

	ctime = time.time()
	fps = 1/(ctime-ptime)
	ptime = ctime

	cv2.putText(img,f'FPS: {int(fps)}',(20,50),cv2.FONT_HERSHEY_PLAIN,3,(0,255,0),3)
	cv2.imshow('Video',img)

	key = cv2.waitKey(30) & 0xff
	if key == 27:
		break

cap.release()
cv2.destroyAllWindows()