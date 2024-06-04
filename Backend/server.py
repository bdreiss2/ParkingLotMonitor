from flask import Flask, request, jsonify
from flask_cors import CORS
from VideoSync import audio_sync as sync
from ObjectDetection import new_object_detection as detection


app = Flask(__name__)
CORS(app)

@app.route('/upload/', methods=['POST'])
def proccess_videos():
    print("POST Recieved")
    try:
        # Check if the post request has the file part
        if 'file1' not in request.files or 'file2' not in request.files:
            return jsonify({'error': 'No file part in the request'}), 400

        file1 = request.files['file1']
        file2 = request.files['file2']

        # If the user does not select files, the browser submits an
        # empty file without a filename.
        if file1.filename == '' or file2.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        if file1 and file2:
            offset = sync.find_offset(file1, file2)
            print("Applying Object Detection...")
            vid1, vid2 = detection.video_detection(file1, file2)

            print("Object Detection successful.")
            json = jsonify({'time_offset': offset, 'video1': vid1, 'video2': vid2})
            print("jsonify successful.")
            return json, 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/text/', methods=['POST'])
def proccessTextDetection():
    print("Text Detection Post Recieved")
    try:
        # Check if the post request has the file part
        if 'file1' not in request.files:
            return jsonify({'error': 'No file part in the request'}), 400

        file1 = request.files['file1']

        # If the user does not select files, the browser submits an
        # empty file without a filename.
        if file1.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        if file1:
            print("@Vincent call text detection here")
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='10.24.102.66', port=8443, debug=True)
