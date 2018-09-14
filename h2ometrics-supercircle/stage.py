import os.path
import re
import unicodedata
import datetime
import json
import math

from pymongo import MongoClient
from tornado.options import define, options

def main():
    client = MongoClient()
    db = client['supercircle']

    circle_pos = db['circle_pos']
    recent_pos = db['recent_pos']

    # drop collection
    circle_pos.drop()
    recent_pos.drop()

    # initialize recents collection
    circle_array = ['blueCircle', 'redCircle', 'greenCircle']
    for circle in circle_array:
        recent_pos.insert({'id': circle, 'x':120+120*circle_array.index(circle), 'y':240+(240*(circle_array.index(circle)%2))})
        circle_pos.insert({'id': circle, 'x':120+120*circle_array.index(circle), 'y':240+(240*(circle_array.index(circle)%2))})
    
    # hardcoding initial super circle
    super_area = math.pi*150**2
    circum_circle = recent_pos.insert({'id': 'supercircle', 'c': [240, 330], 'r':150, 'area':super_area})

if __name__ == "__main__":
    main()