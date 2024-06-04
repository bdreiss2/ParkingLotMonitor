
'''Main video detection code'''
from imageai.Detection import VideoObjectDetection
import os
import base64
import tempfile
from flask import jsonify

def encode_video_to_base64(video_path):
    with open(video_path, "rb") as video_file:
        return base64.b64encode(video_file.read()).decode('utf-8')

def video_to_json(base64_video):
    return json.dumps({"video": base64_video})


def video_detection(video1, video2):
   try:

        print("Getting current working directory...")
        execution_path = os.getcwd()
        print(execution_path)
        print("Getting model...")
        detector = VideoObjectDetection()
        print("Setting model...")
        detector.setModelTypeAsTinyYOLOv3()
        print("Setting path...")
        detector.setModelPath(os.path.join(execution_path, "tiny-yolov3.pt"))
        print("Model path: tiny-yolov3.pt")

        if not os.path.exists("tiny-yolov3.pt"):
            print("Model file not found at: tiny-yolov3.pt")
            return "Error: Model file not found"
        print("Loading model...")
        detector.loadModel()

        print("Detting cars...")
        custom_objects = detector.CustomObjects(car=True)

        # Specify the output path with .mp4 extension and use 'mp4v' codec
        print("Setting output path 1 ...")
        output_path1 = os.path.join(execution_path, "processed_vid1")
        print("Output path 1:", output_path1)
        print("Setting video path 1...")
        video_path1 = detector.detectObjectsFromVideo(
            custom_objects=custom_objects,
            input_file_path="./video1.mp4",
            output_file_path=output_path1,
            frames_per_second=60,
            log_progress=True,
            detection_timeout=40,
            save_detected_video=True
            # codec='mp4v'  # Specify MP4 codec
        )

        print("Setting output path 2 ...")
        output_path2 = os.path.join(execution_path, "processed_vid2")
        print("Output path 2:", output_path2)
        print("Setting video path 2...")
        video_path2 = detector.detectObjectsFromVideo(
            custom_objects=custom_objects,
            input_file_path="./video2.mp4",
            output_file_path=output_path2,
            frames_per_second=60,
            log_progress=True,
            detection_timeout=40,
            save_detected_video=True
            # codec='mp4v'  # Specify MP4 codec
        )



        print("Converting video 1 to base64...")
        base64_video1 = encode_video_to_base64(video_path1)
        print("Converting video 2...")
        base64_video2 = encode_video_to_base64(video_path2)

        print("returning json objects")
        return base64_video1, base64_video2
   except Exception as e:
    print(f"An error occurred: {e}")



