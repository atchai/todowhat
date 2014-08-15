app.Router = Backbone.Router.extend({
  routes: {
  	'': 'allRoute',
    'done': 'filterDone',
    'todo': 'filterNotDone',
  },
  /**
  * based on the route, the following methods pass the todos collection to appropriate view and renders
  */
  allRoute: function() {
  	var thetodosview = new app.TodosView({collection: app.todos});
        thetodosview.render();
  },
  filterDone: function() {
  	var filteredView = new app.FilterDoneView({collection: app.todos});
    	filteredView.render();
  },
  filterNotDone: function() {
  	var filteredView = new app.FilterTodoView({collection: app.todos});
    	filteredView.render();
  },
});

