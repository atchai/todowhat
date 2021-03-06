var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('../jquery');
Backbone.$ = $;

var TodosView = require('./todos');
var DoneView = require('./filter/done');
var NotDoneView = require('./filter/todo');
var FilterTagView = require('./filter/tag');

var Todos = require('../collections/todos');
var Tags = require('../collections/tags');
var GuestTodos = require('../collections/guesttodos');
var GuestTags = require('../collections/guesttags');


/**
* Todo list view controller
*/
module.exports = Backbone.View.extend({
    el: '.todos',

    initialize: function() {
        Todos.fetch({reset:true});

        if (!this.currentView) {
            this.currentView = new TodosView({collection: Todos});
        }

        this.render();

        this.listenTo(Backbone.eventBus, 'guestMode', this.guestMode);
        this.listenTo(Backbone.eventBus, 'userMode', this.userMode);
        this.listenTo(Backbone.eventBus, 'filterAll', this.filterAll);
        this.listenTo(Backbone.eventBus, 'filterDone', this.filterDone);
        this.listenTo(Backbone.eventBus, 'filterNotDone', this.filterNotDone);
        this.listenTo(Backbone.eventBus, 'filterTag', this.filterTag);
    },

    /**
    * Puts the todos list view within the .todos element
    */
    render: function() {
        this.$el.html(this.currentView.render().el);
        this.orderPersistance();
    },

    /**
    * Following methods clean up any already existing todos view and renders new ones based on status filter.
    */
    filterDone: function() {
        this.updateView(DoneView);
    },
    filterNotDone: function() {
        this.updateView(NotDoneView);
    },
    filterTag: function() {
        this.updateView(FilterTagView);
    },
    filterAll: function() {
        this.updateView(TodosView);
    },
    updateView: function(viewName) {
        this.currentView.remove();
        this.currentView = new viewName({collection: Todos});
        this.render();
    },

    userMode: function() {
        GuestTodos.toJSON().forEach(function(guestTodo) {
          guestTodo.id = null;
          Todos.create(guestTodo,
            {
                wait:true,
                success: function() {
                    Todos.fetch({reset:true});
                    Tags.fetch({reset:true});
                }
            });
        });
        var length = GuestTodos.length;
        for (var i = length - 1; i >= 0; i--) {
          GuestTodos.at(i).destroy();
        }
        this.filterAll();
    },

    /**
    * If no user is logged in, only show the guest todos/tags
    * saved in localStorage.
    */
    guestMode: function() {
        Todos = GuestTodos;
        GuestTodos.fetch();
        GuestTags.fetch();
        this.filterAll();
    },

    /**
    * Uses jQuery UI to make list items sortable.
    * If sorting has occured, order of items is saved to models accordingly.
    */
    orderPersistance: function() {
        var sortHelper = function(w, that, ui) {
            that.children().each(function() {
                if ($(this).hasClass('ui-sortable-helper') || $(this).hasClass('ui-sortable-placeholder')) {
                    return true;
                }

                // Get the absolute value of the distance between top of the helper
                var dist = Math.abs(ui.position.top - $(this).position().top),
                    before = ui.position.top > $(this).position().top;
                // If overlap is more than half of the dragged item
                if ((w - dist) > (w / 2) && (dist < w)) {
                    if (before) {
                        $('.ui-sortable-placeholder', that).insertBefore($(this));
                    } else {
                        $('.ui-sortable-placeholder', that).insertAfter($(this));
                    }
                }
            });
        }

        this.$('#todoul').sortable({
            axis: "y",
            handle: ".handle",
            containment: "parent",
            tolerance: 'intersect',
            // Helper method to make sorting smoother
            sort: function(event, ui) {
                var that = $(this),
                    w = ui.helper.outerHeight();
                sortHelper(w, that, ui);
             },
            /**
            * Update the order property of todo models whenever the
            * list has finished been rearranged.
            */
            update: function(event, ui) {
                var order = $('#todoul').sortable('toArray'),
                    cidOfDropped = ui.item.context.id,
                    itemIndex = ui.item.index();
                Todos.sortableOrder(order, cidOfDropped, itemIndex);
            }
        });
    }

});
