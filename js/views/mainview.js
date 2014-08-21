var Backbone = require('backbone');
var _ = require('underscore');
var Todos = require('../collections/todos');
var TodoView = require('./todoview');
var Tags = require('../collections/tags')
var TagsView = require('./tagsview');
var NavView = require('./navview');
var $ = require('../jquery')
Backbone.$ = $;
module.exports = Backbone.View.extend({
    events: {
        "click .submit": "addTodo",
        "keyup #todofield": "keyPressEventHandler",
        "keyup #tagsfield": "keyPressEventHandler"
    },

    el: $("body"),

    initialize: function() {
        this.$todoList = this.$("#todoul");
        //retrieve any todos and tags in local storage and render them
        Tags.fetch();
        Todos.fetch();
        this.render();
    },
    
    render: function() {
        this.orderPersistance();
        var tagsList = new TagsView({collection: Tags});
        tagsList.render();
        $(document).ready(function(){
            $('.navlinks').empty();
        var links = new NavView({});
        $('.navlinks').append(links.render().el);
        })
    },
    /**
    * add a todo model (and tags) to the collection(s) using content in
    * input boxes
    */
    addTodo: function(e) { 
        e.preventDefault();
        //cache input fields
        this.$todofield = $('#todofield');
        this.$tagsfield = $('#tagsfield');
        var todoContent, tagsContent;
        todoContent = this.$todofield.val();
        //grabs tag values deliminated by commas and removes whitespace
        tagsContent = _.map(this.$tagsfield.val().split(','), function(t) {
            return t.trim();
        }).filter(Boolean);
        Todos.create(
                {
                    content: todoContent,
                    order: Todos.newOrder(),
                    tags: tagsContent
                }, 
                { 
                    //using .create so we must set wait:true so input can be validated by model 
                    wait: true, 
                    //if todo content was valid, see if tag(s) exists in collection so count can be updated appropriately
                    success: function() {
                        _.each(tagsContent, function(t) {
                            Tags.exist(t);
                        });
                    } 
                });
        this.$todofield.val('');
        this.$tagsfield.val('');
        $('.submit').addClass('disabled');

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