var Backbone = require('backbone');
var _ = require('underscore');
var Tags = require('../collections/tags')
var Todos = require('../collections/todos')
var TagsView = require('./tagsview');
var NavView = require('./navview');
var FormView = require('./formview');
var NavBarView = require('./navbarview');
var TodosView = require('./todosview');
var $ = require('../jquery')
Backbone.$ = $;

/**
* Main application view, renders appropriate views upon starting the application
* i.e. navigation, tag views
*/
module.exports = Backbone.View.extend({
    el: "body",

    initialize: function() {
        //retrieve any tags in local storage and render them
        Tags.fetch();
        this.render();
    },
    events: {
        "keyup .search-field": "doSearch"
    },
    render: function() {
        //renders the top navigation bar which contains tag list and navigation links on mobile screens
        this.$el.prepend(new NavBarView().render().el);
        //renders the input forms for adding todos
        this.$('.mainrow').append(new FormView().render().el);
        //renders the tag list on left side (large screens)
        this.$('.taglist').html(new TagsView({collection: Tags}).render().el);
        //renders the navigation links on left side (large screens)
        Todos.fetch();
        this.$('#navlinks').html(new NavView().render().el);
        
    },

    filterAll: function() {
        // Clear all the filter actives
        $('.list-group-item.active').removeClass('active');
        var thetodosview = new TodosView({collection: Todos});
        thetodosview.render();
    },

    /**
    * clicks add todo button if enter key is pressed
    */
    keyPressEventHandler: function(event) {
        if (event.keyCode == 13) {
            this.$(".submit").click();
        }
    },

    doSearch: function() {
        // var thing = this.$('.search-field').val();
        console.log(this.$('.search-field').val());
        var thing = Todos.search(this.$('.search-field').val());
        console.log(thing);
        var searchedView = new TodosView({collection: thing});
        this.$('#todoul').html(searchedView.render().el);
        // Backbone.eventBus, 'filterAll'
    }
});