import mediapipe as mp
import time  
import cv2 

cap = cv2.VideoCapture('vídeos/13th.mp4')
ptime = 0

mp_draw = mp.solutions.drawing_utils
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(max_num_faces=2)
draw_specs = mp_draw.DrawingSpec(thickness=1, circle_radius=2)

while True:
	success, img = cap.read()

	img_rgb = cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
	results = face_mesh.process(img_rgb)

	if results.multi_face_landmarks:
		for face_lms in results.multi_face_landmarks:
			mp_draw.draw_landmarks(img,face_lms,mp_face_mesh.FACE_CONNECTIONS,
				draw_specs, draw_specs)

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