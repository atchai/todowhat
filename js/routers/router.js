var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var TodosView = require('../views/todosview');
var FilterDoneView = require('../views/filterdoneview');
var FilterTodoView = require('../views/filtertodoview');
var Todos = require('../collections/todos');
todoAppView = require('../views/mainview');

module.exports = Backbone.Router.extend({
  routes: {
  	'': 'filterAll',
    'done': 'filterDone',
    'todo': 'filterNotDone',
  },

  /**
  * upon starting up the app/router, make sure there is a main view
  */
  initialize: function() {
    if (!this.view) {
      this.view = new todoAppView();
    }
    //call change method when anything happens with router
    this.listenTo(this, "all", this.change);
  },

  /**
  * based on the route, the following methods pass the todos collection to appropriate view and renders
  */
  filterAll: function() {
    Backbone.eventBus.trigger('filterAll');
    Backbone.eventBus.trigger('stopFilter');
        
  },
  filterDone: function() {
  	var filteredView = new FilterDoneView({collection: Todos});
    	filteredView.render();
  },
  filterNotDone: function() {
  	var filteredView = new FilterTodoView({collection: Todos});
    	filteredView.render();
  },

  //triggers a custom event to let navigation link view know the route has changed
  change: function() {
    Backbone.eventBus.trigger('routeChanged');
  }
});



