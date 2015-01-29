var Backbone = require('backbone');
var Todos = require('../collections/todos');
var GuestTodos = require('../collections/guesttodos');
var GuestTags = require('../collections/guesttags');
var todoAppView = require('../views/main');
var todoListView = require('../views/todolist');
var searchView = require('../views/search');

/**
* Manages which todos view is rendered
*/
module.exports = Backbone.Router.extend({
    routes: {
        '': 'filterAll',
        'done': 'filterDone',
        'todo': 'filterNotDone',
        'tag/*path': 'filterTag'
    },

    /**
    * upon starting up the app/router, make sure there is a main view
    */
    initialize: function() {
        this.checkUser();

        if (!this.view) {
            this.view = new todoAppView();
            //create a view for the todos collection
            new todoListView();
            new searchView();
        }

        //call change method when anything happens with router
        this.listenTo(this, "all", this.change);
    },

    /**
    * Based on the route, the following methods pass the todos collection to appropriate view and renders
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

    filterTag: function() {
        Backbone.eventBus.trigger('filterTag');
    },

    // Triggers a custom event to let navigation link view know the route has changed
    change: function() {
        Backbone.eventBus.trigger('routeChanged');
    },

    /**
    * Check user authentication
    */
    checkUser: function(callback) {
     var that = this;

     $.ajax("/auth", {
         type: "GET",
         success: function() {
            Backbone.eventBus.trigger('userMode');
         },
         error: function() {
            Backbone.eventBus.trigger('guestMode');
         }
     });
    }
});
