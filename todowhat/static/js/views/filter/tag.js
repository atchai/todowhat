var $ = require('jquery');
    Backbone = require('backbone'),
    _ = require('underscore'),
    FilterView = require('../filter');

module.exports = FilterView.extend({
    initialize: function() {
        this.refresh();
        FilterView.prototype.initialize.apply(this, arguments);
    },

    refresh: function() {
        var tag = Backbone.history.fragment.split("/")[1];
        this.todoList = (tag === 'all') ?
            this.collection : this.collection.filterTag(tag)
    }
});
