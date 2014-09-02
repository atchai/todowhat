var Backbone = require('backbone');
var _ = require('underscore');
var Tags = require('../collections/tags')
var Todos = require('../collections/todos')
var TagsView = require('./tagsview');
var NavView = require('./navview');
var FormView = require('./formview');
var NavBarView = require('./navbarview');
var $ = require('../jquery')
Backbone.$ = $;

/**
* Main application view, renders appropriate views upon starting the application
* i.e. navigation, tag views
*/
module.exports = Backbone.View.extend({
    el: "body",

    initialize: function() {
        //retrieve any tags in local storage and render them
        Tags.fetch();
        this.render();
    },

    render: function() {
        //renders the top navigation bar which contains tag list and navigation links on mobile screens
        this.$el.prepend(new NavBarView().render().el);
        //renders the input forms for adding todos
        this.$('.mainrow').append(new FormView().render().el);
        //renders the tag list on left side (large screens)
        this.$('.taglist').html(new TagsView({collection: Tags}).render().el);
        //renders the navigation links on left side (large screens)
        Todos.fetch();
        this.$('#navlinks').html(new NavView().render().el);
    },

    filterAll: function() {
        // Clear all the filter actives
        $('.list-group-item.active').removeClass('active');
        var thetodosview = new TodosView({collection: Todos});
        thetodosview.render();
    },

    /**
    * clicks add todo button if enter key is pressed
    */
    keyPressEventHandler: function(event) {
        if (event.keyCode == 13) {
            this.$(".submit").click();
        }
    },
    /**
    * uses jQuery UI to make list items sortable.
    * if sorting has occured, order of items is saved to models accordingly.
    */
    orderPersistance: function() {
        this.$todoList.sortable({
            axis: "y",
            handle: ".handle",
            containment: "parent",
            tolerance: 'pointer',
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
                Todos.sort();

            }
        });
    }
});