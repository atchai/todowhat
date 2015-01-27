var $ = require('jquery');
    Backbone = require('backbone'),
    _ = require('underscore'),
    FilterView = require('../filter');

module.exports = FilterView.extend({
    initialize: function() {
        this.todoList = this.collection.filterDone(false);
        FilterView.prototype.initialize.apply(this, arguments);
    }
})
