import cv2
import json

image = cv2.imread('parkinglotphoto.jpg')

parking_spots = {}

point1 = None
point2 = None
current_id = 1

def mouse_callback(event, x, y, flags, param):
    global point1, point2, current_id

    if event == cv2.EVENT_LBUTTONDOWN:
        if point1 is None:
            point1 = (x, y)
        elif point2 is None:
            point2 = (x, y)
            cv2.rectangle(image, point1, point2, (0, 255, 0), 2)
            parking_spots[current_id] = [point1, point2]
            current_id += 1
            point1 = None
            point2 = None


cv2.namedWindow('Parking Lot')
cv2.setMouseCallback('Parking Lot', mouse_callback)

while True:
    cv2.imshow('Parking Lot', image)
    key = cv2.waitKey(1) & 0xFF
    if key == ord('q'):
        break


with open('parking_spots.json', 'w') as f:
    json.dump(parking_spots, f)

cv2.destroyAllWindows()