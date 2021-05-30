import cv2

capture = cv2.VideoCapture('vídeos/akira.mp4')

while True:
	success, img = capture.read()

	if success:
		cv2.imshow('Video - Akira',img)

		# Aperte a tecla 'q' para sair
		if cv2.waitKey(20) & 0xFF == ord('q'):
			break

	else:
		break

capture.release()
cv2.destroyAllWindows()