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
        this.todoList = this.collection.filterDone(false);
    }
})
