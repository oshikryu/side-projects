define (require) ->
  Backbone = require 'backbone'
  Handlebars = require 'handlebars'
  require 'bootstrap'
  template = require 'text!templates/template.handlebars'
  serverbox = require 'text!templates/server-box.handlebars'

  class ApplicationModel extends Backbone.Model
    defaults:
      servers: [
        [
          {
            id: 0
            name: 'hadoop'
            short: 'hd'
            color: 'deeppink'
          }
        ]
        []
        []
        []
      ]

    applications: [
      {
        name: 'hadoop'
        short: 'hd'
        color: 'deeppink'
      }
      {
        name: 'rails'
        short: 'rs'
        color: 'purple'
      }
      {
        name: 'chronos'
        short: 'ch'
        color: '#00FFFF'
      }
      {
        name: 'storm'
        short: 'st'
        color: 'steelblue'
      }
      {
        name: 'spark'
        short: 'sp'
        color: 'lightgreen'
      }
    ]

    idInc: 0

    appList: [
      {
        id: 0
        name: 'hadoop'
        short: 'hd'
        color: 'deeppink'
      }
    ]

    addApp: (index, app) ->
      # mocking out the use and increment of IDs
      @idInc += 1
      app['id'] = @idInc
      @get('servers')[index].push app
      @appList.push app
      @trigger 'updateView'

    minusApp: (id, app) ->
      servers = @get 'servers'
      outer = ''
      inner = ''
      _.each servers, (d, ii) ->
        # loop incrementer offset
        outer = ii + 1
        _.each d, (e, ind) ->
          if e.id == id
            # remove from server
            servers[outer].splice(ind, 1)

      # remove from list
      _.find @appList, (d, ii) =>
        if d.id == id
          @appList.splice ii, 1

      @trigger 'updateView'
      
    destroyServer: () ->
      servers = @get 'servers'
      removed = servers.pop()
      # get app ids of server
      _.each removed, (d) =>
        id = d.id
        # TODO: logic for redistributing app load to available servers
        index = _.find @appList, (e) ->
          e.id == id
        @appList.splice(index, 1)



    initialize: ->
      # TODO: do @model.fetch() to retrieve existing board info
      # initialize board
      @trigger 'updateView'

  class ApplicationView extends Backbone.View
    template: Handlebars.compile template
    serverbox: Handlebars.compile serverbox
    className: 'chart'

    events:
      'change #rows': 'changeRows'
      'change #cols': 'changeCols'
      'click #add-server': 'addServer'
      'click #destroy-server': 'destroyServer'
      'click .minus-app': 'minusApp'
      'click .add-app': 'addApp'

    initialize: ->
      # initialize model listeners
      @_listeners()

      @$el.append template
      @render()

    _listeners: ->
      @listenTo @model, 'updateView', @render
      @listenTo @, 'addServerBlock', @addServerBlock
      @listenTo @, 'destroyServerBlock', @destroyServerBlock

    render: ->
      # clear existing dom
      @$el.find('.main').html('')
      _.each @model.get('servers'), (d) =>
        @$el.find('.main').append @serverbox
          apps: d

      return @

    addServerBlock: ->
      @$el.find('.main').append serverbox

    destroyServerBlock: ->
      @render()


    # UI events
    addServer: (evt) ->
      @model.get('servers').push []
      @trigger 'addServerBlock'

    destroyServer: (evt) ->
      servers = @model.get 'servers'
      len = servers.length
      return false if len < 1
      @model.destroyServer()

      @trigger 'destroyServerBlock', @destroyServerBlock

    addApp: (evt) ->
      type = evt.target.dataset.type
      appToAdd = _.find @model.applications, (d) ->
        d.short == type

      # find empty server
      freeServerIndex = _.findIndex @model.get('servers'), (d,i) ->
        return d.length == 0

      if freeServerIndex == -1
        freeServerIndex = _.findIndex @model.get('servers'), (d,i) ->
          return d.length == 1

        if freeServerIndex == -1
          alert 'TWO many apps on a server'
          return false

      @model.addApp(freeServerIndex, appToAdd)

    minusApp: (evt) ->
      type = evt.target.dataset.type
      target = _.last @model.appList, (d, i) ->
        d.short == type
      targetApp = _.last(target)
      id = targetApp.id

      @model.minusApp(id, targetApp)


    
  Model: ApplicationModel
  View: ApplicationView
