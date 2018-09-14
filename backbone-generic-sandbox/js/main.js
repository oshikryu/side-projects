//the require library is configuring paths
require.config({
    paths: {
                //tries to load jQuery from Google's CDN first and falls back
                //to load locally
        "jquery": ["libs/jquery/dist/jquery"],
        "underscore": "libs/lodash/dist/lodash",
        "backbone": "libs/backbone/backbone"
    },
    shim: {
        "backbone": {
                        //loads dependencies first
            deps: ["jquery", "underscore"],
                        //custom export name, this would be lowercase otherwise
            exports: "Backbone"
        }
    },
        //how long the it tries to load a script before giving up, the default is 7
    waitSeconds: 10
});
//requiring the scripts in the first argument and then passing the library namespaces into a callback
//you should be able to console log all of the callback arguments
require(['jquery', 'underscore', 'backbone', 'application'], function(jquery, _, Backbone, App){
    new App;
});
