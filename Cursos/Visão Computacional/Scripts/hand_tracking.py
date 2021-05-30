import mediapipe as mp
import time  
import cv2 

cap = cv2.VideoCapture('vídeos/hand.mp4')

mp_hands = mp.solutions.hands 
hands = mp_hands.Hands()
mp_draw = mp.solutions.drawing_utils

ptime = 0
ctime = 0

while True:
	success, img = cap.read()

	img_rgb = cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
	results = hands.process(img_rgb)

	if results.multi_hand_landmarks:
		for hand_lms in results.multi_hand_landmarks:
			for id, lm in enumerate(hand_lms.landmark):
				h, w, c = img.shape 
				cx, cy = int(lm.x * w), int(lm.y * h)
				if id == 0:
					cv2.circle(img, (cx,cy), 20, (255,0,255), cv2.FILLED)
			mp_draw.draw_landmarks(img, hand_lms, mp_hands.HAND_CONNECTIONS)

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