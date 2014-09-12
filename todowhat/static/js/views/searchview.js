var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var Tags = require('../collections/tags');
var template = require('../../templates/searchtemplate.html');
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
		this.listenTo(Todos, 'remove', this.checkVisible);
		this.listenTo(Todos, 'sync', this.checkVisible);

	},

	render: function() {
		this.$el.prepend(template());
        return this;
	},

	checkVisible: function() {
		console.log('hi checking');
		if (!Todos.last()) {//if collection is empty
            this.$el.addClass('hide');
		} else {
            this.$el.removeClass('hide');
		}
	},

	/**
	* Debounced function to filter Todos collection to those
	* containing the search term.
	*/
	findTodos: _.debounce(function(e) {
        var searchTerm = e.target.value;
        if (!searchTerm) {
        	this.resetSearch();
        }
        var thing = Todos.search(searchTerm);
        this.searchedView = new TodosView({collection: thing});
        this.$('#todoul').html(this.searchedView.render().el);
    }, 800),

	/**
	* Removes the search term from input box and removes the filtered
	* todos view.
	*/
    resetSearch: function() {
    	this.$('.search-field').val('');
    	this.searchedView.remove();
    	Backbone.eventBus.trigger('filterAll');
    }
})