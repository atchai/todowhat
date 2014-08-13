var app = app || {};

app.MainView = Backbone.View.extend({
    events: {
        "click .submit": "addTodo",
        "keyup #todofield": "keyPressEventHandler",
        "keyup #tagsfield": "keyPressEventHandler"
    },

    el: $("body"),

    initialize: function() {
        this.$todoList = $("#todoul");
        //retrieve any todos and tags in local storage and render them
        app.tags.fetch({
            reset: true
        });
        app.todos.fetch({
            reset: true
        });
        this.render();
    },

    render: function() {
        this.orderPersistance();
        var tagsthingy = new app.TagsView({collection: app.tags});
        tagsthingy.render();
    },

    addTodo: function(e) { //add a todo model (and tags) to the collection(s)
        e.preventDefault();
        var todoContent, tagsContent, todoContentValid;
        todoContent = $('#todofield').val();
        tagsContent = $('#tagsfield').val().split(',');
        tagsContent = _.map(tagsContent, function(t) {
            return t.trim();
        });
        tagsContent = tagsContent.filter(Boolean);
        console.log(tagsContent);
        app.todos.create({
                content: todoContent,
                order: app.todos.newOrder(),
                tags: tagsContent
            }, { wait: true }); 
             _.each(tagsContent, function(t) {
                app.tags.exist(t);
            });
        $('#todofield').val('');
        $('#tagsfield').val('');
        $('.submit').addClass('disabled');

    },

    keyPressEventHandler: function(event) {
        if (event.keyCode == 13) {
            this.$(".submit").click();
        }
    },

    orderPersistance: function() { //update order property of todo models after a drag and drop
        this.$todoList.sortable({
            update: function(event, ui) {
                var order = $('#todoul').sortable('toArray'),
                    cidOfDropped = ui.item.context.id,
                    itemIndex = ui.item.index();
                //if dropped item is now last in list, change order property to less than that of penultimate
                if (itemIndex == order.length - 1) { 
                    var cidOfAbove = order[itemIndex - 1],
                        orderOfAbove = app.todos.get(cidOfAbove).get('order');
                    app.todos.get(cidOfDropped).save({
                        'order': orderOfAbove - 1
                    });
                } else { //else change the order to more than item below it
                    app.todos.get({
                        cid: cidOfDropped
                    }).save({
                        'order': app.todos.get({
                            cid: order[itemIndex + 1]
                        }).get('order') + 1
                    });
                    for (var i = 0; i < itemIndex; i++) { //then increase order of those above it
                        var currentOrder = app.todos.get({
                            cid: order[i]
                        }).get('order');
                        app.todos.get({
                            cid: order[i]
                        }).save({
                            "order": currentOrder + 2
                        });
                    }
                }

            }
        });
    }
});