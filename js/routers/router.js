app.Router = Backbone.Router.extend({
  routes: {
  	'': 'allRoute',
    'done': 'filterDone',
    'todo': 'filterNotDone',
  },
  allRoute: function() {
  	var thetodosview = new app.TodosView({collection: app.todos});
        thetodosview.render();
    console.log('at the allRoute method');
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

app.router = new app.Router();


