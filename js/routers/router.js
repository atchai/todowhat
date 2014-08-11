app.Router = Backbone.Router.extend({
  routes: {
    '*p': 'filterTodos'
  },
  filterTodos: function(p) {
    this.filterParam = p;
    app.todos.trigger('reset');
  }
});

app.router = new app.Router();
Backbone.history.start();