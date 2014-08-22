var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var Todos = require('../collections/todos');
var TodoView = require('./todoview');
var Tags = require('../collections/tags');
var TagView = require('./tagview');
var NavView = require('./navview');
Backbone.$ = $;

module.exports = Backbone.View.extend({
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
        Tags.each(function(t) {
            var tagList = new TagView({
                model: t
            });
            this.$el.append(tagList.render().el);
        }, this);
        return this;
    },

    /**
    * removes a tag from the list if no longer in the collection
    */
    removeTagView: function(tag) {
        var cid = '#tag' + tag.cid;
        $(cid).remove();
    }
})