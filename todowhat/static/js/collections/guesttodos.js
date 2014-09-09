var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var Todo = require('../models/todo');
Backbone.LocalStorage = require('backbone.localstorage')

GuestTodos = Backbone.Collection.extend({
    localStorage: new Backbone.LocalStorage("StoredGuestTodos"),
    model: Todo,
    comparator: 'order',
    /**
     * this returns new collection containing only done or not done todos
     */
    filterDone: function(status) {
        return new GuestTodos(
            this.filter(function(todo) {
                return todo.get('done') === status;
            })
        );
    },
    /**
     * used to set order property of new model to one more than last existing model in collection
     */
    newOrder: function() {
        if (this.last()) {
            return this.last().get('order') + 1;
        } else {
            return 0;
        }
    },

    search: function(letters) {
        if (letters == "") return this;
        var pattern = new RegExp(letters, "gi");
        return new GuestTodos(
            this.filter(function(data) {
                return pattern.test(data.get("content"));
            })
        );
    },

    /**
     * Returns todos with a specific tag
     */
    filterTag: function(tag) {
        return new GuestTodos(
            this.filter(function(todo) {
                var tagArr = [];
                var tagList = todo.getTags();
                tagList.forEach(function(t) {
                    tagArr.push(t);
                })
                return _.contains(tagArr, tag);
            })
        );
    }
});
module.exports = new GuestTodos([]);
