require.config
    paths:
      jquery: 'lib/jquery'
      underscore: 'lib/lodash'
      backbone: 'lib/backbone'
      handlebars: 'lib/handlebars'
      bootstrap: 'lib/bootstrap/js/bootstrap.min'
      d3: 'lib/d3.v3'
      text: 'lib/text'

    shim:
      underscore:
        exports: '_'
      handlebars:
        exports: 'Handlebars'
      sinon:
        exports: 'sinon'
      backbone:
        deps: ['underscore', 'jquery']
        exports: 'Backbone'
      d3:
        exports: 'd3'
      bootstrap:
        deps: ['jquery']


require [
  'application'
], (Application) ->
  # create model

  model = new Application.Model

  # create view
  view = new Application.View model: model
  $('#page-content').append view.el

  # TEMP: for dev
  window.model = model
  window.view = view
