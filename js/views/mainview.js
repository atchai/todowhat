app = app || {}

app.MainView = Backbone.View.extend({
    events: {
        "click .submit": "addTodo",
        "click #filterDone": "filterDone",
        "click #filterNotDone": "filterNotDone",
        "click #showAll": "render"
    },
    el: $("body"),
    initialize: function() {
        this.$todoList = $("#todoul");
        this.listenTo(app.todos, 'reset', this.render);
        this.listenTo(app.todos, 'add', this.addTodoView);
        this.listenTo(app.todos, 'remove', this.removeTodoView);
        app.todos.fetch({
            reset: true
        });
        if (app.todos.models.length == 0) {
            var fakeModels = [
                {'content': 'review this ticket'},
                {'content': 'drink some water'},
                {'content': 'take a break'}
            ];
            _.each(fakeModels, function(todoModel) {
                app.todos.create(todoModel)
            });
        }
    },
    render: function() {
        this.$todoList.empty();
        app.todos.each(function(item) {
            this.addTodoView(item);
        }, this);
        $('#showAll').attr("id", "showAllDummy");
        this.orderPersistance();
        $('a').css('font-weight', 'normal');
        $('#showAllDummy').css('font-weight', 'bold');
        return this;


    },
    addTodo: function(e) {
        e.preventDefault();
        var todoContent = $('#todofield').val();
        if (todoContent && todoContent.length <= 255 && ($.trim(todoContent)) != 0) {
            app.todos.create({
                content: todoContent,
                order: app.todos.newOrder()
            });
            $('#todofield').val('');
        }
    },
    addTodoView: function(todo) {
        var thing = new app.TodoView({
            model: todo
        });
        this.$todoList.prepend(thing.render().el);
        this.orderPersistance();
    },
    removeTodoView: function(todo) {
        var cid = '#' + todo.cid;
        $(cid).remove();
    },
    filterDone: function() {
        var thing = app.todos.filterDone(true);
        if (thing.length == 0) {
            return false
        };
        this.$todoList.empty();
        thing.each(function(c) {
            this.addTodoView(c);
        }, this);
        $('a').css('font-weight', 'normal');
        $('#filterDone').css("font-weight", "bold");
        this.orderPersistance();
        $('#showAllDummy').attr("id", "showAll")

    },
    filterNotDone: function() {
        var thing = app.todos.filterDone(false);
        if (thing.length == 0) {
            return false
        };
        this.$todoList.empty();
        thing.each(function(c) {
            this.addTodoView(c);
        }, this);
        $('a').css('font-weight', 'normal');
        $('#filterNotDone').css("font-weight", "bold");
        this.orderPersistance();
        $('#showAllDummy').attr("id", "showAll")

    },
    showAll: function() {
        app.todos.each(function(c) {
            this.addTodoView(c);
        }, this);
    },
    orderPersistance: function() {
        this.$todoList.sortable({
            update: function(event, ui) {//use underscore bind, underscore javascript templates
                var order = $('#todoul').sortable('toArray'),
                    cidOfDropped = ui.item.context.id,
                    itemIndex = ui.item.index();
                if (itemIndex == order.length - 1) {
                    var cidOfAbove = order[itemIndex - 1],
                        orderOfAbove = app.todos.get(cidOfAbove).get('order');
                    app.todos.get(cidOfDropped).save({
                        'order': orderOfAbove - 1
                    });
                } else {
                    app.todos.get({
                        cid: cidOfDropped
                    }).save({
                        'order': app.todos.get({
                            cid: order[itemIndex + 1]
                        }).get('order') + 1
                    });
                    for (var i = 0; i < itemIndex; i++) {
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