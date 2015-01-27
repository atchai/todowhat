var Backbone = require('backbone');
var _ = require('underscore');
var Tags = require('../collections/tags')
var GuestTags = require('../collections/guesttags')
var Todos = require('../collections/todos')
var GuestTodos = require('../collections/guesttodos')
var TagsView = require('./tags');
var NavView = require('./navigation/status');
var FormView = require('./form');
var NavBarView = require('./navbar');
var TodosView = require('./todos');
var $ = require('../jquery')
Backbone.$ = $;

/**
* Main application view, renders appropriate views upon starting the application
* i.e. navigation, tag views
*/
module.exports = Backbone.View.extend({
    el: "body",

    initialize: function() {
        this.render();
    },

    render: function() {
        //renders the top navigation bar which contains tag list and navigation links on mobile screens
        this.$el.prepend(new NavBarView().render().el);
        //renders the input forms for adding todos
        this.$('.mainrow').append(new FormView().render().el);
        //renders the tag list on left side (large screens)
        this.$('.taglist').html(new TagsView().render().el);
        //renders the navigation links on left side (large screens)
        this.$('#navlinks').html(new NavView().render().el);
    },

    /**
    * clicks add todo button if enter key is pressed
    */
    keyPressEventHandler: function(event) {
        if (event.keyCode == 13) {
            this.$(".submit").click();
        }
    }
});
