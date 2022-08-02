# prediction class for AnyLogic (predict individual decision)
import random
import tensorflow as tf
from tensorflow.keras.models import load_model
import numpy as np
import matplotlib.pyplot as plt
from statistics import mean
tf.autograph.set_verbosity(0)

tf.get_logger().setLevel('INFO')


class SVPredictor:
    def __init__(self):
        # self.model = tfdf.keras.GradientBoostedTreesModel()
        self.model = load_model('sv_prediction', compile=True)

    def predict(self, Temperature, Precipitation, Daytime, Impact, Media, Threat, Friends, Expenditure, Info, Time, Distance):
        predictions = self.model.predict(
            np.array([[Temperature, Precipitation, Daytime, Impact, Media, Threat, Friends, Expenditure, Info]]), verbose=0)
        distBen = 0.002 - (0.000008 * Distance)
        timeBen = 0

        match Time:
            case 22:
                timeBen = -0.0005
            case 23:
                timeBen = -0.001
            case 0:
                timeBen = -0.005
            case 1:
                timeBen = -0.0015
            case 2:
                timeBen = -0.015
            case 3:
                timeBen = -0.015
            case 4:
                timeBen = -0.015
            case 5:
                timeBen = -0.015
            case 6:
                timeBen = -0.005

        prediction = predictions[0]

        prediction = prediction + timeBen + \
            random.uniform(-0.0001, 0.0001) + distBen
        return round(float(prediction), 8)
