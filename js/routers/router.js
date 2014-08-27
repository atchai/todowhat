var Backbone = require('backbone');
var FilterDoneView = require('../views/filterdoneview');
var FilterTodoView = require('../views/filtertodoview');
var Todos = require('../collections/todos');
var todoAppView = require('../views/mainview');
var todoListView = require('../views/todolistview');

/**
* Manages which todos view is rendered
*/
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
      //create a view for the todos collection
      new todoListView();
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
    Backbone.eventBus.trigger('filterDone');
  },
  filterNotDone: function() {
    Backbone.eventBus.trigger('filterNotDone');
  },

  //triggers a custom event to let navigation link view know the route has changed
  change: function() {
    Backbone.eventBus.trigger('routeChanged');
  }
});