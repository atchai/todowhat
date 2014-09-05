var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var Tags = require('../collections/tags');
var template = require('../../../templates/searchtemplate.html');
var Todos = require('../collections/todos');
var TodosView = require ('./todosview');


module.exports = Backbone.View.extend({
	el: '.search-todos',

	events: {
		"keyup .search-field": "findTodos",
		"click .reset-search": "resetSearch"
	},

	initialize: function() {
		this.render();
	},

	render: function() {
		this.$el.prepend(template());
        return this;
	},

	findTodos: _.debounce(function(e) {
        var searchTerm = e.target.value;
        var thing = Todos.search(searchTerm);
        this.searchedView = new TodosView({collection: thing});
        this.$('#todoul').html(this.searchedView.render().el);
    }, 800),

    resetSearch: function() {
    	this.$('.search-field').val('');
    	this.searchedView.remove();
    	Backbone.eventBus.trigger('filterAll');
    }
})