var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var ApplicationModel, ApplicationView, Backbone, Handlebars, d3, template, _ref, _ref1;
  Backbone = require('backbone');
  Handlebars = require('handlebars');
  d3 = require('d3');
  require('bootstrap');
  template = require('text!templates/template.handlebars');
  ApplicationModel = (function(_super) {
    __extends(ApplicationModel, _super);

    function ApplicationModel() {
      _ref = ApplicationModel.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ApplicationModel.prototype.defaults = {
      data: []
    };

    ApplicationModel.prototype.initialize = function() {
      this.rows = 3;
      this.cols = 3;
      return this.changeDimensions(this.rows, this.cols);
    };

    ApplicationModel.prototype.changeDimensions = function(r, c) {
      var arr, idCounter, x, y, _i, _j;
      this.rows = +r;
      this.cols = +c;
      arr = [];
      idCounter = 0;
      for (y = _i = 1; 1 <= r ? _i <= r : _i >= r; y = 1 <= r ? ++_i : --_i) {
        for (x = _j = 1; 1 <= c ? _j <= c : _j >= c; x = 1 <= c ? ++_j : --_j) {
          arr.push({
            x: x,
            y: y
          });
          idCounter += 1;
        }
      }
      this.set('data', arr);
      return this.trigger('updateView');
    };

    return ApplicationModel;

  })(Backbone.Model);
  ApplicationView = (function(_super) {
    __extends(ApplicationView, _super);

    function ApplicationView() {
      _ref1 = ApplicationView.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    ApplicationView.prototype.template = Handlebars.compile(template);

    ApplicationView.prototype.className = 'chart';

    ApplicationView.prototype.events = {
      'change #rows': 'changeRows',
      'change #cols': 'changeCols',
      'click #clear': 'clearBoard',
      'click #save': 'saveBoard'
    };

    ApplicationView.prototype.initialize = function() {
      this._listeners();
      this.$el.append(template);
      return this.render();
    };

    ApplicationView.prototype._listeners = function() {
      return this.listenTo(this.model, 'updateView', this.render);
    };

    ApplicationView.prototype.render = function() {
      var enterSelection, gridSize, heatmap, svg;
      this.$('#rows').val(this.model.rows);
      this.$('#cols').val(this.model.cols);
      svg = d3.selectAll('svg');
      gridSize = 40;
      svg.html('');
      heatmap = svg.selectAll('.tiles').data(this.model.get('data'));
      enterSelection = heatmap.enter().append('rect').attr('x', function(d) {
        return d.x * gridSize;
      }).attr('y', function(d) {
        return d.y * gridSize;
      }).attr('width', gridSize).attr('height', gridSize).attr('class', 'tiles').style('fill', '#fff').attr('stroke', '#333');
      enterSelection.on('click', function(d) {
        var color, el;
        el = d3.select(this);
        if (el.classed('clicked')) {
          return el.classed('clicked', false).transition().style('fill', '#fff').duration(500);
        } else {
          color = '#' + Math.floor(Math.random() * 16777215).toString(16);
          return el.classed('clicked', true).transition().style('fill', color).duration(500);
        }
      });
      heatmap.exit().remove();
      return this;
    };

    ApplicationView.prototype.saveBoard = function(evt) {
      return alert('stubbing out get request to server with model attrs');
    };

    ApplicationView.prototype.clearBoard = function(evt) {
      return d3.selectAll('.tiles').style('fill', '#fff').classed('clicked', false);
    };

    ApplicationView.prototype.changeRows = function(evt) {
      var cols;
      cols = this.model.cols;
      return this.model.changeDimensions(evt.target.value, cols);
    };

    ApplicationView.prototype.changeCols = function(evt) {
      var rows;
      rows = this.model.rows;
      return this.model.changeDimensions(rows, evt.target.value);
    };

    return ApplicationView;

  })(Backbone.View);
  return {
    Model: ApplicationModel,
    View: ApplicationView
  };
});
