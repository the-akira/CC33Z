import numpy as np
import cv2

"""
A detecção de pistas é a tarefa de detectar pistas 
em uma estrada a partir de uma câmera.
"""

def draw_the_lines(image, lines):
    # criamos uma imagem distinta para as linhas (preta -> todos os valores 0)
    lines_image = np.zeros((image.shape[0], image.shape[1], 3), dtype=np.uint8)
    # existem as coordenadas (x,y) para os pontos iniciais e final das linhas
    for line in lines:
        for x1, y1, x2, y2 in line:
            cv2.line(lines_image, (x1, y1), (x2, y2), (0, 0, 255), thickness=3)
    # finalmente devemos unir a imagem com as linhas
    image_with_lines = cv2.addWeighted(image, 0.8, lines_image, 1, 0.0)
    return image_with_lines

def region_of_interest(image, region_points):
    # Vamos substituir com pixels 0 (preto)
    # as regiões da imagem que não temos interesse
    mask = np.zeros_like(image)
    # A região que estamos interessados é o triângulo inferior - pixels 255 (branco)
    cv2.fillPoly(mask, region_points, 255)
    # Queremos usar a mask: desejamos manter as regiões da imagem original
    # onde a mask possui pixels coloridos com branco
    masked_image = cv2.bitwise_and(image, mask)
    return masked_image

def get_detected_lanes(image):
    (height, width) = (image.shape[0], image.shape[1])
    # transformamos a imagem em escala de cinza
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    # Edge detection kernel (canny's algorithm)
    canny_image = cv2.Canny(gray_image, 100, 120)
    # estamos interessados apenas na "região inferior" da imagem
    region_of_interest_vertices = [
        (0, height),
        (width/2, height*0.65),
        (width, height)
    ]
    # podemos nos livrar das partes irrelevantes da imagem
    # nós apenas mantemo apenas a região triangular inferior
    cropped_image = region_of_interest(
            canny_image,
            np.array([region_of_interest_vertices], np.int32)
        )
    # usamos o algoritmo de detecção de linhas (usaremos radianos)
    lines = cv2.HoughLinesP(cropped_image, 
            rho=2, 
            theta=np.pi/180,
            threshold=50,
            lines=np.array([]),
            minLineLength=40,
            maxLineGap=150
        )
    # desenhamos as linhas na imagem
    image_with_lines = draw_the_lines(image, lines)
    return image_with_lines

# Um vídeo é o mesmo que diversos frames
# Uma imagem apresentada após a outra
video = cv2.VideoCapture('vídeos/lane_detection_video.mp4')

while video.isOpened():
    is_grabbed, frame = video.read()

    # testamos se é o fim do vídeo
    if not is_grabbed:
        break

    frame = get_detected_lanes(frame)

    cv2.imshow('Lane Detection Video', frame)
    cv2.waitKey(15)

video.release()
cv2.destroyAllWindows()