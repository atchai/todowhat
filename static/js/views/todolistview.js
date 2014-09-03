var Backbone = require('backbone');
var _ = require('underscore');
var Todos = require('../collections/todos');
var TodosView = require('./todosview');
var DoneView = require('./filterdoneview');
var NotDoneView = require('./filtertodoview');
var FilterTagView = require('./filterTagView');

var $ = require('../jquery')
Backbone.$ = $;

/**
* View for list of todos
*/
module.exports = Backbone.View.extend({
    el: '.todos',

    initialize: function() {
        //fetch existing todos from local storage
        //if no todo list view exists yet, create view for all todos
        if (!this.currentView) {
            this.currentView = new TodosView({collection: Todos});
        }
        this.render();
        this.listenTo(Todos, 'request', this.yourCallback); //start fetching
        this.listenTo(Todos, 'sync', this.yourCallback); //finish fetching
        this.listenTo(Backbone.eventBus, 'filterAll', this.filterAll);
        this.listenTo(Backbone.eventBus, 'filterDone', this.filterDone);
        this.listenTo(Backbone.eventBus, 'filterNotDone', this.filterNotDone);
        this.listenTo(Backbone.eventBus, 'filterTag', this.filterTag);
        Todos.fetch({reset: true});

    },

    /**
    * Puts the todos list view within the .todos element
    */
    render: function() {
        this.$el.html(this.currentView.render().el);
        this.orderPersistance();
    },

    /**
    * Following three methods clean up any already existing todos view and renders new ones based on status filter
    */
    filterDone: function() {
        this.currentView.remove();
        this.currentView = new DoneView({collection: Todos});
        this.render();
    },
    filterNotDone: function() {
        this.currentView.remove();
        this.currentView = new NotDoneView({collection: Todos});
        this.render();
    },
    filterTag: function() {
        this.currentView.remove();
        this.currentView = new FilterTagView({collection: Todos});
        this.render();
    },
    filterAll: function() {
        this.currentView.remove();
        this.currentView = new TodosView({collection: Todos});
        this.render();

    },
    /**
    * uses jQuery UI to make list items sortable.
    * if sorting has occured, order of items is saved to models accordingly.
    */
    orderPersistance: function() {
        this.$('#todoul').sortable({
            axis: "y",
            //only allow list item to be dragged by .handle (a glyphicon)
            handle: ".handle",
            //prevents list item being dragged out of parent element, else dragging item down extends the page
            containment: "parent",
            tolerance: 'pointer',
            //this method is called whenever the list has been rearranged
            update: function(event, ui) {
                var order = $('#todoul').sortable('toArray'),
                    cidOfDropped = ui.item.context.id,
                    itemIndex = ui.item.index();

                //if dropped item is now last in list, change order property to less than that of penultimate
                if (itemIndex == order.length - 1) {
                    var cidOfAbove = order[itemIndex - 1],
                        orderOfAbove = Todos.get(cidOfAbove).get('order');
                    Todos.get(cidOfDropped).save({'order': orderOfAbove - 1});
                } else { //else change the order to more than item below it
                    Todos.get({cid: cidOfDropped})
                        .save({'order': Todos.get({cid: order[itemIndex + 1]})
                            .get('order') + 1});

                    for (var i = 0; i < itemIndex; i++) { //then increase order of those above it
                        var currentOrder = Todos.get({cid: order[i]}).get('order');
                        Todos.get({cid: order[i]})
                            .save({"order": currentOrder + 2});
                    }
                }
                //so that the collection maintains the order without page refresh
                Todos.sort();

            }
        });
    },

    yourCallback: function() {

    }


});