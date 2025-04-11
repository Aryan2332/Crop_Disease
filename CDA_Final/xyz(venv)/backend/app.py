import os
import numpy as np
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from PIL import Image
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads_temp'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

model = load_model('model/cnn_model_final_multi_class.h5')

train_dir = 'model/dataset/Train'
class_labels = sorted(os.listdir(train_dir))

print("Class labels:", class_labels)


def preprocess_image(img_path):
    img = Image.open(img_path)
    img = img.resize((224, 224))
    img = np.array(img)
    if img.shape[-1] == 4:
        img = img[:, :, :-1]
    img = img.astype('float32') / 255.0
    img = np.expand_dims(img, axis=0)
    return img


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400


    filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(filepath)


    img = preprocess_image(filepath)
    prediction = model.predict(img)

    predicted_class_idx = np.argmax(prediction, axis=1)[0]

    predicted_class = class_labels[predicted_class_idx]
    print(f"predicted class : {predicted_class}")

    return jsonify({'predicted_class': predicted_class}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
