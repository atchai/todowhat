var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var NavView = require('./navview');
var MobileNavView = require('./mobilenavview');
var Tags = require('../collections/tags');
var template = require('../../../templates/todotemplate.html');
var editView = require('./editview');

module.exports = Backbone.View.extend({
    initialize: function(){
        //changing done state of model will rerender the view of that todo, toggling appropriate styling
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'change:reminder', this.checkReminder);
        this.listenTo(this.model, 'change:reminder', this.checkCancelReminder);
        this.checkReminder();
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
            tags: this.model.get('tags')
        }));
        this.$('.edit').html(new editView({model: this.model}).render().el)
        return this;
    },

    /**
    * removes model from collection, and decreases count of associated tags
    */
    removeTodo: function() {
        // _.each(this.model.getTags(), function(tag) {
        //     Tags.removeTag(tag);
        // });
        this.model.destroy();
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
        if (reminder !== null) {
        var notify = this.notifyUser;
            var self = this;
            this.myInterval = setInterval(function () {
                var timeToReminder = (reminder - Date.now())*Math.pow(10,-3);
                console.log(timeToReminder);
                  if (Date.now() > reminder) {
                      notify(todo.get('content'));
                      clearInterval(self.myInterval);
                      todo.save({
                        reminder: null
                      });
                   }
              }, 1000);
        }
    },

    notifyUser: function(content) {
        var notification = new Notification("Have you done this yet?", {
            "body": content,
            "icon": "http://i.imgur.com/iD3UXom.png"
        });
    },

    checkCancelReminder: function() {
        var reminder = this.model.get('reminder');
        if (reminder==null) {
            console.log('reminder is null');
            clearInterval(this.myInterval);
        }

    }


});
