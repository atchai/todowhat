var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var Todos = require('../collections/todos');
var TodoView = require('./todoview');
var Tags = require('../collections/tags');
var TagView = require('./tagview');
var NavView = require('./navview');
var tagsTemplate = require('../../templates/tagsTemplate.html');
Backbone.$ = $;

module.exports = Backbone.View.extend({
    events: {
        "click .all-todo": "activateAll"
    },

    initialize: function() {
        this.listenTo(this.collection, 'reset', this.render);
        this.listenTo(this.collection, 'add', this.render); //so that new tags are added alphabetically
        this.listenTo(this.collection, 'remove', this.removeTagView);
    },

    /**
    * renders list of all tags in collection
    */
    render: function() {
        this.$el.empty();
        this.$el.append(tagsTemplate);
        Tags.each(function(t) {
            var tagList = new TagView({
                model: t
            });
            this.$el.append(tagList.render().el);
        }, this);
        if(!Tags.last()) {
           this.$el.append('<li class="list-group-item">No tags yet, trying adding one</li>');
        }
        return this;
    },

    /**
    * removes a tag from the list if no longer in the collection
    */
    removeTagView: function(tag) {
        var cid = '#tag' + tag.cid;
        console.log(cid);
        $(cid).remove();
    },

    activateAll: function() {
        var $all = this.$('.all-todo').parent();
        if($all.hasClass('active')) {
            $all.removeClass('active');
        }
        else {
            $('.list-group-item.active').removeClass('active');
            $all.addClass('active');
        }
    }
});