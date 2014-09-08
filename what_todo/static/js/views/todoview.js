var Backbone = require('backbone');
var _ = require('underscore');
var Tags = require('../collections/tags');
var template = require('../../templates/todotemplate.html');
var editView = require('./editview');

module.exports = Backbone.View.extend({
    initialize: function(){
        //changing done state of model will rerender the view of that todo, toggling appropriate styling
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'change:reminder', this.checkReminder);
        this.listenTo(this.model, 'change:reminder', this.checkCancelReminder);
        // this.checkReminder();
    },

    tagName: 'li',

    id: function() {
        return this.model.cid;
    },

    events: {
        "click .remove": "removeTodo",
        "click .toggle": "toggleDone"
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
            tags: this.model.get('tags'),
            reminder: this.model.get('reminder')
        }));
        this.$('.edit').html(new editView({model: this.model}).render().el);
        return this;
    },

    /**
    * removes model from collection, and decreases count of associated tags
    */
    removeTodo: function() {
        this.model.destroy();
        // Fetch tags from server so count on view is updated
        Tags.fetch({reset: true});
        this.render();
    },

    toggleDone: function() {
        var done = this.model.get('done');
        this.model.save({'done': !done});
        Backbone.eventBus.trigger('statusChanged');
    },

    checkReminder: function() {
        var todo = this.model;
        var reminder = todo.get('reminder');
        if (reminder) {
            window.onbeforeunload = function() {
                    return 'You have a reminder set.';
                };
            var timeToReminder = reminder - Date.now();
            var notify = this.notifyUser;
            this.reminderTimeout = setTimeout(function() {notify(todo)}, timeToReminder);
        }
    },

    checkCancelReminder: function() {
        var reminder = this.model.get('reminder');
        if (!reminder) {
            clearTimeout(this.reminderTimeout);
            window.onbeforeunload=null;
        }
    },

    notifyUser: function(todo) {
        var content = todo.get('content')
        todo.save({reminder: null});
        window.onbeforeunload = null;

        notification = new Notification("Have you done this yet?",
            {
                "body": content,
                "icon": "http://i.imgur.com/iD3UXom.png"
            });
    }

});
