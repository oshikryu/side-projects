import os.path
import re
import pymongo
import tornado.auth
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import unicodedata
import datetime
import json


from math import pi
from math import sqrt
from numpy import dot
from numpy.linalg import inv
from pymongo import MongoClient
from tornado.options import define, options


client = MongoClient()
db = client['supercircle']
# collection of circle movements
circle_pos = db['circle_pos']
# collection of only the most recent positions of each circle
recent_pos = db['recent_pos']
define("port", default=8888, help="run on the given port", type=int)


def compute(x, y, z):
    M = [[y[0] - x[0], y[1] - x[1]],
            [z[0] - y[0], z[1] - y[1]]]

    b = [(y[0] ** 2 - x[0] ** 2 + y[1] ** 2 - x[1] ** 2) / 2.,
            (z[0] ** 2 - y[0] ** 2 + z[1] ** 2 - y[1] ** 2) / 2.]

    c = dot(inv(M), b)
    r = sqrt((x[0] - c[0]) ** 2 + (x[1] - c[1]) ** 2)
    area = pi * r ** 2

    return dict(c=tuple(c), r=r, area=area)


class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/", MainHandler),
            (r"/initialize", InitializeHandler),
        ]
        settings = dict(
            app_title=u"Supercircle",
            template_path=os.path.join(os.path.dirname(__file__), "templates"),
            static_path=os.path.join(os.path.dirname(__file__), "static"),
        )
        tornado.web.Application.__init__(self, handlers, **settings)


class InitializeHandler(tornado.web.RequestHandler):
    def get(self):
        init_vals = {}
        # import ipdb; ipdb.set_trace()
        cursor = recent_pos.find()
        for c in cursor:
            if c['id'] == 'supercircle':
                init_vals[c['id']] = {'x':c['c'][0], 'y':c['c'][1], 'r':c['r'], 'area':c['area']}
            else:
                init_vals[c['id']] = {'x':c['x'], 'y':c['y']}
            # print init_vals
        self.write(init_vals)


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")


    def post(self):
        post_data = self.request.body
        stuff = json.loads(post_data)
        params = stuff['params']
        
        # write to circle_positions collection
        obj = circle_pos.insert(params)

        # check circle id and update object reference for only the moved circle
        cid = params['id']
        
        # recent_pos values
        data = {"$set":{"pointer": obj, 'x': params['x'], 'y': params['y']}}
        send_recent = recent_pos.update(
               {'id': cid}, 
               data,
               True
            )

        # array of circle colors
        circle_array = ['blueCircle', 'redCircle', 'greenCircle']
        coord_array = []
        # find last positions of the other circles
        for circle in circle_array:
            recent = recent_pos.find_one({'id': circle})
            coords = [recent['x'], recent['y']]
            coord_array.append(coords)

        # calculate super circle
        compute_result = compute(coord_array[0], coord_array[1], coord_array[2])
        # print compute_result

        cir_data = {'$set': compute_result}
        send_circum_circle = recent_pos.update(
               {'id': 'supercircle'}, 
               cir_data,
               True
            )

        self.write(cir_data)


def main():
    tornado.options.parse_command_line()
    http_server = tornado.httpserver.HTTPServer(Application())
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()


if __name__ == "__main__":
    main()