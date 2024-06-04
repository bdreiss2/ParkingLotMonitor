from flask import jsonify
from flask_cors import CORS
import tempfile
import shutil
import moviepy.editor as mp
from moviepy.editor import VideoFileClip
import librosa
import numpy as np
from scipy.signal import medfilt
import os

def extract_audio(file_storage, video_path, audio_path):
    # Use a temporary file to ensure compatibility with MoviePy
    try:
         with tempfile.NamedTemporaryFile(delete=False) as tmp:
            file_storage.save(tmp.name)
            video = mp.VideoFileClip(tmp.name)
            video.write_videofile(video_path)

            audio_clip = video.audio
            audio_clip.write_audiofile(audio_path, codec='pcm_s16le')
            audio_clip.close()

            video.close()
    except Exception as e:
        print(f"An error occurred: {e}")

def extract_audio_to_array(audio_path):
    audio_array, sr = librosa.load(audio_path, sr=1000, mono=True)
    return audio_array, sr


def preprocess_audio(audio):
    audio_denoised = medfilt(audio, kernel_size=11)  # Simple noise reduction
    audio_normalized = audio_denoised / np.max(np.abs(audio_denoised))  # Normalization
    return audio_normalized


# Input 2 mp4 file paths and it will find the offset in seconds based on audio
# Positive offset means vid1 starts before vid2, negitive means vid2 starts before vid1
def find_offset(file1, file2):
        print("Calculating Offset...")

        audio1_path = "./audio1.wav"
        audio2_path = "./audio2.wav"

        video1_path = "./video1.mp4"
        video2_path = "./video2.mp4"

        print("Writing video files for future use...")
        # write_video_file(file1, "./1video1.mp4")
        # write_video_file(file2, "./2video2.mp4")

        extract_audio(file1, video1_path, audio1_path)
        audio1, sr1 = extract_audio_to_array(audio1_path)
        # convert_vid_back(audio_path, video_path)
        print(f"file1: {type(file1.read())}\n\n")
        print("Extracted Video 1 to audio file " + audio1_path)

        extract_audio(file2, "./video2.mp4", audio2_path)
        audio2, sr2 = extract_audio_to_array(audio2_path)
        print("Extracted Video 2 to audio file " + audio2_path)

        # Use the shorter of the two audio tracks for correlation
        min_length = min(len(audio1), len(audio2))
        audio1 = audio1[:min_length]
        audio2 = audio2[:min_length]

        print("Preprocessing Audio...")
        audio1 = preprocess_audio(audio1)
        audio2 = preprocess_audio(audio2)

        # Calculate the cross-correlation
        print("Correlating Audio...")
        correlation = np.correlate(audio1, audio2, mode='full')

        # Find the time offset
        lag = correlation.argmax() - (len(audio2) - 1)
        time_offset = lag / sr1
        print("Time offset (in seconds):", time_offset)
        return time_offset

