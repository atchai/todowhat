var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var NavView = require('./navview');
var MobileNavView = require('./mobilenavview');
var Tags = require('../collections/tags');
var template = require('../../templates/todotemplate.html');

module.exports = Backbone.View.extend({
    initialize: function(){
        //changing done state of model will rerender the view of that todo, toggling appropriate styling
        this.listenTo(this.model, 'change', this.render);
        this.$navlinks = $('#navlinks');
    },

    tagName: 'li',

    id: function() {
        return this.model.cid;
    },

    events: {
        "click .remove": "removeTodo",
        "click .toggle": "toggleDone",
    },
    /**
    * renders view of a todo as well as the navigation links
    *
    */
    render: function() {
        this.$el.addClass('list-group-item');
        this.$el.html(template({
            todoItem: this.model.get('content') ,
            done: this.model.get('done'),
            tags: this.model.getTags()
        }));
        return this;
    },

    /**
    * removes model from collection, and decreases count of associated tags
    */
    removeTodo: function() {
        _.each(this.model.getTags(), function(tag) {
            Tags.removeTag(tag);
        });
        this.model.destroy();
        this.render();
    },

    toggleDone: function() {
        var done = this.model.get('done');
        this.model.save({'done': !done});
        Backbone.eventBus.trigger('statusChanged');
    }
});
