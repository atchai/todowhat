var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var Todo = require('../models/todo');

module.exports = Backbone.Collection.extend({

    model: Todo,

    comparator: 'order',

    /**
     * This returns new collection containing only done or not done todos.
     */
    filterDone: function(status) {
        return new this.constructor(
            this.filter(function(todo) {
                return todo.get('done') === status;
            })
        );
    },

    /**
     * Return 'order' attribute of the last todo in collection incremented by 1.
     * This ensures new todos will be above old todos
     */
    newOrder: function() {
        if (this.last()) {
            return this.last().get('order') + 1;
        } else {
            return 0;
        }
    },

    /**
    * Returns a subcollection with todos matching the search pattern
    */
    search: function(letters) {
        if (!letters) {
            return this;
        }
        var pattern = new RegExp(letters, "i");
        return new this.constructor(
            this.filter(function(data) {
                return pattern.test(data.get("content"));
            })
        );
    },

    /**
     * Returns todos with a specific tag
     */
    filterTag: function(tag) {
        return new this.constructor(
            this.filter(function(todo) {
                var tagArr = [];
                var tagList = todo.getTags();
                tagList.forEach(function(t) {
                    tagArr.push(t);
                })
                return _.contains(tagArr, tag);
            })
        );
    },

    sortableOrder: function(order, cidOfDropped, itemIndex) {
        if (itemIndex == order.length - 1) {
            var cidOfAbove = order[itemIndex - 1],
                orderOfAbove = this.get(cidOfAbove).get('order');
            this.get(cidOfDropped).save({'order': orderOfAbove - 1});
        } else { // else change the order to more than item below it
            this.get({cid: cidOfDropped})
                .save({'order': this.get({cid: order[itemIndex + 1]})
                    .get('order') + 1});

            for (var i = 0; i < itemIndex; i++) { // then increase order of those above it
                var currentOrder = this.get({cid: order[i]}).get('order');
                this.get({cid: order[i]})
                    .save({"order": currentOrder + 2});
            }
        }
        this.sort();
    }
});

// module.exports = new BaseTodos([]);
