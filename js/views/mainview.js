app = app || {}

app.MainView = Backbone.View.extend({
    initialize: function() {
        app.todos.fetch({
            reset: true
        });
        if (app.todos.models.length == 0) {
            var fakeModels = [{'content': 'review this ticket'}, {'content': 'drink some water'}, {'content': 'take a break'}];
            for(var i=0;i<fakeModels.length;i++){app.todos.create(fakeModels[i]);}
        }
        this.listenTo(app.todos, 'reset', this.render);
        this.listenTo(app.todos, 'add', this.addTodoView);
        this.listenTo(app.todos, 'remove', this.removeTodoView);
        this.render();

    },
    events: {
        "click .submit": "addTodo"
    },
    el: $("body"),
    render: function() {
        $('#todoul').empty();
        app.todos.each(function(item) {
            this.addTodoView(item);
        }, this)
        $(document).ready(function() {
            app.checkDoneStatus();
            app.toggleDoneStatus();
            app.orderPersistance();
            $("#todoul").disableSelection();
        });
        return this;


    },
    addTodo: function(e) {
        e.preventDefault();
        var todoContent = $('#todofield').val();
        if (todoContent && todoContent.length<=255) {
            console.log(todoContent.length);
            var todosAmount = app.todos.models.length;
            var highestOrder;
            if (todosAmount == 0) {
                app.todos.create({ //THIS SHIT TRIGGERS ADD EVENT
                    content: todoContent
                });
            } else {
                highestOrder = app.todos.models[todosAmount - 1].get('order');
                app.todos.create({
                    content: todoContent,
                    order: highestOrder
                });
            }
            $('#todofield').val('');
        }
        $(document).ready(function() {
            app.toggleDoneStatus();
        });


    },
    addTodoView: function(todo) {
        var thing = new app.TodoView({
            model: todo
        });
        $('#todoul').prepend(thing.render().el);
        app.orderPersistance();
    },
    removeTodoView: function(todo) {
        var cid = '#' + todo.cid;
        $(cid).remove();
    }
});

app.toggleDoneStatus = function() {
    $('input[type="checkbox"]').click(function() {
        if (this.checked) {
            app.todos.get($(this).closest('li').attr("id")).save({
                "done": true
            });
            $(this).closest('li').addClass('struck');
        } else {
            $(this).closest('li').removeClass('struck');
            app.todos.get($(this).closest('li').attr("id")).save({
                "done": false
            });
        }
    });
};

app.orderPersistance = function() {
    $("#todoul").sortable({
        update: function(event, ui) {
            var order = $('#todoul').sortable('toArray');
            var cidOfDropped = ui.item.context.id;
            var itemIndex = ui.item.index();
            if (itemIndex == order.length - 1) {
                var cidOfAbove = order[itemIndex - 1];
                var orderOfAbove = app.todos.get(cidOfAbove).get('order');
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
};

app.checkDoneStatus = function() {
     this.todos.each(function(col) { //check if has been marked as done, then sets style
                if (col.get('done')) {
                    var tmpId = '#' + col.cid;
                    $(tmpId + ' input').attr('checked', 'checked');
                    $(tmpId).addClass('struck');
                }
            });
};

