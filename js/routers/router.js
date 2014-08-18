var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var TodosView = require('../views/todosview');
var FilterDoneView = require('../views/filterdoneview');
var FilterTodoView = require('../views/filtertodoview');
var Todos = require('../collections/todos');

module.exports = Backbone.Router.extend({
  routes: {
  	'': 'allRoute',
    'done': 'filterDone',
    'todo': 'filterNotDone',
  },
  /**
  * based on the route, the following methods pass the todos collection to appropriate view and renders
  */
  allRoute: function() {
  	var thetodosview = new TodosView({collection: Todos});
        thetodosview.render();
  },
  filterDone: function() {
  	var filteredView = new FilterDoneView({collection: Todos});
    	filteredView.render();
  },
  filterNotDone: function() {
  	var filteredView = new FilterTodoView({collection: Todos});
    	filteredView.render();
  },
});



