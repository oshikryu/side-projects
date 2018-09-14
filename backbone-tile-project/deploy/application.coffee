define (require) ->
  Backbone = require 'backbone'
  Handlebars = require 'handlebars'
  d3 = require 'd3'
  require 'bootstrap'
  template = require 'text!templates/template.handlebars'

  class ApplicationModel extends Backbone.Model
    defaults:
      data: []

    initialize: ->
      # TODO: do @model.fetch() to retrieve existing board info
      @rows = 3
      @cols = 3
      # initialize board
      @changeDimensions @rows, @cols

    changeDimensions: (r,c) ->
      # update new dimensions
      @rows = +r
      @cols = +c

      # create matrix
      arr = []
      idCounter = 0
      for y in [1..r]
        for x in [1..c]
          arr.push
            x:x
            y:y
          idCounter += 1

      @set('data', arr)
      @trigger 'updateView'

  class ApplicationView extends Backbone.View
    template: Handlebars.compile template
    className: 'chart'

    events:
      'change #rows': 'changeRows'
      'change #cols': 'changeCols'
      'click #clear': 'clearBoard'
      'click #save': 'saveBoard'

    initialize: ->
      # initialize model listeners
      @_listeners()

      @$el.append template
      @render()

    _listeners: ->
      @listenTo @model, 'updateView', @render

    render: ->
      # initialize input values
      @$('#rows').val(@model.rows)
      @$('#cols').val(@model.cols)


      svg = d3.selectAll('svg')
      gridSize = 40

      # would normally attach ids to data for proper enter/update/exit but
      # clearing the canvas for now 
      svg.html('')

      # data bind
      heatmap = svg.selectAll('.tiles')
        .data(@model.get('data'))



      enterSelection = heatmap
        .enter().append('rect')
        .attr('x', (d) -> d.x * gridSize)
        .attr('y', (d) -> d.y * gridSize)
        .attr('width', gridSize)
        .attr('height', gridSize)
        .attr('class', 'tiles')
        .style('fill', '#fff')
        .attr('stroke', '#333')

      enterSelection.on('click', (d) ->
        el = d3.select(this)

        # check class
        if el.classed('clicked')
          # clear color
          el
            .classed('clicked', false)
            .transition()
              .style('fill', '#fff')
              .duration(500)
        else
          # generate random color
          color = '#'+Math.floor(Math.random()*16777215).toString(16)
          el
            .classed('clicked', true)
            .transition()
              .style('fill', color)
              .duration(500)
          # TODO: persist specific model object's color
      )

      heatmap.exit().remove()

      return @

    # UI events
    saveBoard: (evt) ->
      alert 'stubbing out get request to server with model attrs'

    clearBoard: (evt) ->
      d3.selectAll('.tiles')
        .style('fill', '#fff')
        .classed('clicked', false)

    changeRows: (evt) ->
      cols = @model.cols
      @model.changeDimensions(evt.target.value, cols)

    changeCols: (evt) ->
      rows = @model.rows
      @model.changeDimensions(rows, evt.target.value)
    
  Model: ApplicationModel
  View: ApplicationView
