import tensorflow as tf
from tensorflow.keras.datasets import mnist
from tensorflow.keras.models import load_model
import numpy as np

# Load MNIST test data
(_, _), (x_test, y_test) = mnist.load_data()
x_test = x_test.reshape(-1, 28, 28, 1).astype("float32") / 255.0

# Load the saved model
model = load_model("model/mnist_cnn.h5")

# Evaluate on test set
loss, accuracy = model.evaluate(x_test, y_test)
print(f"Test Accuracy: {accuracy * 100:.2f}%")

# Test on a single image
index = 7
sample = np.expand_dims(x_test[index], axis=0)
prediction = model.predict(sample)
predicted_label = prediction.argmax()

print(f"True Label: {y_test[index]}, Predicted Label: {predicted_label}")