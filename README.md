# 🧠 MNIST Handwritten Digit Recognition

A deep learning project where a Convolutional Neural Network (CNN) is trained to recognize handwritten digits from the MNIST dataset. The model is deployed using Flask (backend API) and connected to a React frontend for live digit prediction from user-uploaded images.

---

## 📌 Project Highlights

- 🔢 Predicts handwritten digits (0–9) using a trained CNN model
- ⚙️ Backend: Flask + TensorFlow + Pillow
- 🌐 Frontend: React + Axios + Material UI (MUI)
- 📁 End-to-End integration — from model to user interaction
- 🎯 Achieved **98.59%** accuracy on test dataset

---

## 🧪 Model Overview

- **Input:** Grayscale image (28x28 pixels)
- **Architecture:**
  - Conv2D → ReLU → MaxPooling
  - Conv2D → ReLU → MaxPooling
  - Flatten → Dense → Dropout
  - Output Layer: Softmax (10 neurons)
- **Loss Function:** Categorical Crossentropy
- **Optimizer:** Adam
- **Epochs:** 5

---

## 🚀 Tech Stack

| Area       | Tools Used                          |
|------------|-------------------------------------|
| Deep Learning | TensorFlow, Keras                 |
| Backend    | Flask, Flask-CORS                   |
| Frontend   | React, Axios, Material UI (MUI)     |
| Image Processing | Pillow (PIL)                  |

---

## 🔄 How It Works

1. User uploads a handwritten digit image via the frontend.
2. The image is sent to the Flask API (`/predict` endpoint).
3. The backend:
   - Saves and preprocesses the image
   - Runs prediction using the trained CNN
   - Sends back the predicted digit and confidence level
4. The frontend displays the result to the user!

---

## 🖥️ Setup Instructions

### 📂 Clone the repo

```bash
git clone https://github.com/varsa-varniga/HandWritten-Digit-Classifier
cd HandWritten-Digit-Classifier
🧠 Model Training
python train_model.py
Backend (Flask API)
  cd backend
  pip install -r requirements.txt
  python app.py
cd frontend
npm install
npm run dev



🧪 Sample Prediction
True Label: 9
Predicted Label: 9
Confidence: 98%

📊 Demo Screenshot
![image](https://github.com/user-attachments/assets/c913a822-82bf-4322-bd91-1c14865aaa76)

🤝 Contributions
Feel free to fork, improve, or extend this project. Open to collaboration and feedback!

📬 Connect with Me
LinkedIn[https://www.linkedin.com/in/varsavarniga-n-m-024527302/]
Made with ❤️ by Varniga


