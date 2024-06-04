import cv2
import json
import numpy as np
import time

parking_spots = {}

video = cv2.VideoCapture('parking_lot.mp4')

frame_width = int(video.get(cv2.CAP_PROP_FRAME_WIDTH))
frame_height = int(video.get(cv2.CAP_PROP_FRAME_HEIGHT))

cv2.namedWindow('Adjust Parking Spots')

def mouse_click(event, x, y, flags, param):
    if event == cv2.EVENT_LBUTTONDOWN:
        cv2.circle(frame, (x, y), 5, (0, 255, 0), -1)
        corners.append((x, y))

print("Please select the four corners of the parking lot.")
print("Click on the top-left, top-right, bottom-right, and bottom-left corners in order.")

corners = []
while len(corners) < 4:
    ret, frame = video.read()
    if not ret:
        break

    cv2.imshow('Adjust Parking Spots', frame)
    cv2.setMouseCallback('Adjust Parking Spots', mouse_click)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

parking_spots['top_left'] = corners[0]
parking_spots['top_right'] = corners[1]
parking_spots['bottom_right'] = corners[2]
parking_spots['bottom_left'] = corners[3]

print("Please select the nine parking spots.")
print("Click on the top-left and bottom-right corners of each spot.")

for i in range(1, 10):
    print(f"Selecting Spot {i}...")

    spot_corners = []
    while len(spot_corners) < 2:
        ret, frame = video.read()
        if not ret:
            break

        cv2.imshow('Adjust Parking Spots', frame)
        cv2.setMouseCallback('Adjust Parking Spots', mouse_click)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    parking_spots[str(i)] = [spot_corners[0], spot_corners[1]]
    print(f"Spot {i} selected.")

with open('parking_spots.json', 'w') as f:
    json.dump(parking_spots, f)

print("Parking spot coordinates saved to 'parking_spots.json'.")

occupancy_data = []
previous_time = time.time()

print("Starting occupancy detection...")

while True:
    ret, frame = video.read()
    if not ret:
        break

    current_time = time.time()
    if current_time - previous_time >= 1:
        occupancy_status = {}

        for spot_id, coordinates in parking_spots.items():
            if spot_id != 'top_left' and spot_id != 'top_right' and spot_id != 'bottom_right' and spot_id != 'bottom_left':
                x1, y1 = coordinates[0]
                x2, y2 = coordinates[1]

                spot_region = frame[y1:y2, x1:x2]
                gray_spot = cv2.cvtColor(spot_region, cv2.COLOR_BGR2GRAY)
                _, binary_spot = cv2.threshold(gray_spot, 100, 255, cv2.THRESH_BINARY_INV)

                non_zero_pixels = cv2.countNonZero(binary_spot)
                total_pixels = spot_region.shape[0] * spot_region.shape[1]
                occupancy_percentage = (non_zero_pixels / total_pixels) * 100

                reference_spot_id = '1'
                if spot_id == reference_spot_id:
                    reference_occupancy_percentage = occupancy_percentage

                if occupancy_percentage >= reference_occupancy_percentage:
                    occupancy_status[spot_id] = 'occupied'
                else:
                    occupancy_status[spot_id] = 'empty'

        occupancy_data.append(occupancy_status)
        previous_time = current_time

    cv2.imshow('Occupancy Detection', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

video.release()
cv2.destroyAllWindows()

with open('occupancy_data.json', 'w') as f:
    json.dump(occupancy_data, f)

print("Occupancy detection completed.")
print("Occupancy data saved to 'occupancy_data.json'.")