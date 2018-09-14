require.config({
  paths: {
    jquery: 'lib/jquery',
    underscore: 'lib/lodash',
    backbone: 'lib/backbone',
    handlebars: 'lib/handlebars',
    bootstrap: 'lib/bootstrap/js/bootstrap.min',
    d3: 'lib/d3.v3',
    text: 'lib/text'
  },
  shim: {
    underscore: {
      exports: '_'
    },
    handlebars: {
      exports: 'Handlebars'
    },
    sinon: {
      exports: 'sinon'
    },
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    d3: {
      exports: 'd3'
    },
    bootstrap: {
      deps: ['jquery']
    }
  }
});

require(['application'], function(Application) {
  var model, view;
  model = new Application.Model;
  view = new Application.View({
    model: model
  });
  $('#page-content').append(view.el);
  window.model = model;
  return window.view = view;
});
