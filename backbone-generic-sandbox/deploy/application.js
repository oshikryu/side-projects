var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require) {
  var ApplicationModel, ApplicationView, Backbone, Handlebars, serverbox, template, _ref, _ref1;
  Backbone = require('backbone');
  Handlebars = require('handlebars');
  require('bootstrap');
  template = require('text!templates/template.handlebars');
  serverbox = require('text!templates/server-box.handlebars');
  ApplicationModel = (function(_super) {
    __extends(ApplicationModel, _super);

    function ApplicationModel() {
      _ref = ApplicationModel.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ApplicationModel.prototype.defaults = {
      servers: [
        [
          {
            id: 0,
            name: 'hadoop',
            short: 'hd',
            color: 'deeppink'
          }
        ], [], [], []
      ]
    };

    ApplicationModel.prototype.applications = [
      {
        name: 'hadoop',
        short: 'hd',
        color: 'deeppink'
      }, {
        name: 'rails',
        short: 'rs',
        color: 'purple'
      }, {
        name: 'chronos',
        short: 'ch',
        color: '#00FFFF'
      }, {
        name: 'storm',
        short: 'st',
        color: 'steelblue'
      }, {
        name: 'spark',
        short: 'sp',
        color: 'lightgreen'
      }
    ];

    ApplicationModel.prototype.idInc = 0;

    ApplicationModel.prototype.appList = [
      {
        id: 0,
        name: 'hadoop',
        short: 'hd',
        color: 'deeppink'
      }
    ];

    ApplicationModel.prototype.addApp = function(index, app) {
      this.idInc += 1;
      app['id'] = this.idInc;
      this.get('servers')[index].push(app);
      this.appList.push(app);
      return this.trigger('updateView');
    };

    ApplicationModel.prototype.minusApp = function(id, app) {
      var inner, outer, servers,
        _this = this;
      servers = this.get('servers');
      outer = '';
      inner = '';
      _.each(servers, function(d, ii) {
        outer = ii + 1;
        return _.each(d, function(e, ind) {
          if (e.id === id) {
            return servers[outer].splice(ind, 1);
          }
        });
      });
      _.find(this.appList, function(d, ii) {
        if (d.id === id) {
          return _this.appList.splice(ii, 1);
        }
      });
      return this.trigger('updateView');
    };

    ApplicationModel.prototype.destroyServer = function() {
      var removed, servers,
        _this = this;
      servers = this.get('servers');
      removed = servers.pop();
      return _.each(removed, function(d) {
        var id, index;
        id = d.id;
        index = _.find(_this.appList, function(e) {
          return e.id === id;
        });
        return _this.appList.splice(index, 1);
      });
    };

    ApplicationModel.prototype.initialize = function() {
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

    ApplicationView.prototype.serverbox = Handlebars.compile(serverbox);

    ApplicationView.prototype.className = 'chart';

    ApplicationView.prototype.events = {
      'change #rows': 'changeRows',
      'change #cols': 'changeCols',
      'click #add-server': 'addServer',
      'click #destroy-server': 'destroyServer',
      'click .minus-app': 'minusApp',
      'click .add-app': 'addApp'
    };

    ApplicationView.prototype.initialize = function() {
      this._listeners();
      this.$el.append(template);
      return this.render();
    };

    ApplicationView.prototype._listeners = function() {
      this.listenTo(this.model, 'updateView', this.render);
      this.listenTo(this, 'addServerBlock', this.addServerBlock);
      return this.listenTo(this, 'destroyServerBlock', this.destroyServerBlock);
    };

    ApplicationView.prototype.render = function() {
      var _this = this;
      this.$el.find('.main').html('');
      _.each(this.model.get('servers'), function(d) {
        return _this.$el.find('.main').append(_this.serverbox({
          apps: d
        }));
      });
      return this;
    };

    ApplicationView.prototype.addServerBlock = function() {
      return this.$el.find('.main').append(serverbox);
    };

    ApplicationView.prototype.destroyServerBlock = function() {
      return this.render();
    };

    ApplicationView.prototype.addServer = function(evt) {
      this.model.get('servers').push([]);
      return this.trigger('addServerBlock');
    };

    ApplicationView.prototype.destroyServer = function(evt) {
      var len, servers;
      servers = this.model.get('servers');
      len = servers.length;
      if (len < 1) {
        return false;
      }
      this.model.destroyServer();
      return this.trigger('destroyServerBlock', this.destroyServerBlock);
    };

    ApplicationView.prototype.addApp = function(evt) {
      var appToAdd, freeServerIndex, type;
      type = evt.target.dataset.type;
      appToAdd = _.find(this.model.applications, function(d) {
        return d.short === type;
      });
      freeServerIndex = _.findIndex(this.model.get('servers'), function(d, i) {
        return d.length === 0;
      });
      if (freeServerIndex === -1) {
        freeServerIndex = _.findIndex(this.model.get('servers'), function(d, i) {
          return d.length === 1;
        });
        if (freeServerIndex === -1) {
          alert('TWO many apps on a server');
          return false;
        }
      }
      return this.model.addApp(freeServerIndex, appToAdd);
    };

    ApplicationView.prototype.minusApp = function(evt) {
      var id, target, targetApp, type;
      type = evt.target.dataset.type;
      target = _.last(this.model.appList, function(d, i) {
        return d.short === type;
      });
      targetApp = _.last(target);
      id = targetApp.id;
      return this.model.minusApp(id, targetApp);
    };

    return ApplicationView;

  })(Backbone.View);
  return {
    Model: ApplicationModel,
    View: ApplicationView
  };
});
