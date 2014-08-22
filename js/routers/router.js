var Backbone = require('backbone');
var FilterDoneView = require('../views/filterdoneview');
var FilterTodoView = require('../views/filtertodoview');
var Todos = require('../collections/todos');
var todoAppView = require('../views/mainview');

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
  },
  filterDone: function() {
    	new FilterDoneView({collection: Todos}).render();
  },
  filterNotDone: function() {
    	new FilterTodoView({collection: Todos}).render();
  },

  //triggers a custom event to let navigation link view know the route has changed
  change: function() {
    Backbone.eventBus.trigger('routeChanged');
  }
});



