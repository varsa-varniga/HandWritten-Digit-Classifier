from flask import Flask, request, jsonify
from flask_cors import CORS  # 🔥 Import CORS
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image
import os

app = Flask(__name__)
CORS(app)  # 🔥 Enable CORS to allow React frontend requests

model = load_model("model/mnist_cnn.h5")

def preprocess_image(image_path):
    img = Image.open(image_path).convert('L')  # Grayscale
    img = img.resize((28, 28))
    img = np.array(img).astype("float32") / 255.0
    img = img.reshape(1, 28, 28, 1)
    return img

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    image = request.files['image']
    image_path = "temp.png"
    image.save(image_path)

    img = preprocess_image(image_path)
    prediction = model.predict(img)
    predicted_class = int(prediction.argmax())
    confidence = float(prediction[0][predicted_class])

    return jsonify({'digit': predicted_class, 'confidence': confidence})

if __name__ == '__main__':
    app.run(debug=True)
