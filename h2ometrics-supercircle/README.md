supercircle
===========

Small mini test project. This application contains a single page that has 3 small svg circles and one large calculated svg circumscribed circle. Dragging the smaller circles will recalculate the supercircle. The positions, radius, and area of the super circle and its smaller circles are stored in a database.


##Initializing
On first run or to clear the db and reset the circle, simply type
```
python stage.py
``` 

##Dependencies
The database used is mongodb.

You will need to install a couple of python libraries using pip
```
pip install pymongo
pip install tornado
pip install numpy
```

##Issues
The z-index of the svg circles is known to be a problem. To fix it, just draw the super circle first and then create the smaller circles

Right now it's erasing and rewriting the supercircle on every mouse drag. It should just translate the existing supercircle and update its dimensions.

This app also currently writes/reads the db on every translation, resulting in an excessive amount of posts. To scale up this should be refactored but for the 
purposes of personal experimentation, it can be used for a more interactive flavor.
