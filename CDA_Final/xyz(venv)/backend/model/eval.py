import tensorflow as tf

model = tf.keras.models.load_model('cnn_model_final_multi_class.h5')
model.summary()
