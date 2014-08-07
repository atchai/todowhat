app = app || {}

app.MainView = Backbone.View.extend({
    initialize: function() {
        this.listenTo(app.todos, 'reset', this.render);
        this.listenTo(app.todos, 'add', this.addTodoView);
        this.listenTo(app.todos, 'remove', this.removeTodoView);
        app.todos.fetch({
            reset: true
        });
        if (app.todos.models.length == 0) {
            var fakeModels = [{
                'content': 'review this ticket'
            }, {
                'content': 'drink some water'
            }, {
                'content': 'take a break'
            }];
            _.each(fakeModels, function(thing) {
                console.log(thing)
                app.todos.create(thing)
            })
        }

    },
    events: {
        "click .submit": "addTodo",
        "click #filterDone": "filterDone",
        "click #filterNotDone": "filterNotDone",
        "click #showAll": "render"
    },
    el: $("body"),
    render: function() {
        $('#todoul').empty();
        app.todos.each(function(item) {
            this.addTodoView(item);
            this.checkDoneStatus(item);
        }, this);
        $('#showAll').attr("id", "showAllDummy");
        $(document).ready(function() {
            app.orderPersistance();
            $("#todoul").disableSelection();
        });
        $('a').css('font-weight', 'normal');
        $('#showAllDummy').css('font-weight', 'bold');

        return this;


    },
    addTodo: function(e) {
        e.preventDefault();
        var todoContent = $('#todofield').val();
        if (todoContent && todoContent.length <= 255 && ($.trim(todoContent)) != 0) {
            app.todos.create({content: todoContent, order: app.todos.newOrder()});
            $('#todofield').val('');
        }
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
    },
    filterDone: function() {
        var thing = app.todos.filterDone(true);
        if (thing.length == 0) {
            return false
        };
        $('#todoul').empty();
        thing.each(function(c) {
            console.log(c);
            this.addTodoView(c);
            this.checkDoneStatus(c);
        }, this);
        $('a').css('font-weight', 'normal');
        $('#filterDone').css("font-weight", "bold");
        $(document).ready(function() {
            app.orderPersistance();
            $("#todoul").disableSelection();
        });
        $('#showAllDummy').attr("id", "showAll")

    },
    filterNotDone: function() {
        var thing = app.todos.filterDone(false);
        if (thing.length == 0) {
            return false
        };
        $('#todoul').empty();
        thing.each(function(c) {
            console.log(c);
            this.addTodoView(c);
            this.checkDoneStatus(c);
        }, this);
        $('a').css('font-weight', 'normal');
        $('#filterNotDone').css("font-weight", "bold");
        $(document).ready(function() {
            app.orderPersistance();
            $("#todoul").disableSelection();
        });
        $('#showAllDummy').attr("id", "showAll")

    },
    showAll: function() {
        app.todos.each(function(c) {
            console.log(c);
            this.addTodoView(c);
        }, this);
    },
    checkDoneStatus: function(todo) {
        if (todo.get('done')) {
            var tmpId = '#' + todo.cid;
            $(tmpId + ' input').attr('checked', 'checked');
            $(tmpId).addClass('struck');
        }
    }
});

app.orderPersistance = function() {
    $("#todoul").sortable({
        update: function(event, ui) {
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
                console.log(app.todos.get(cidOfDropped).get('order'))

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

// app.checkDoneStatus = function() {
//     this.todos.each(function(col) { //check if has been marked as done, then sets style
//         if (col.get('done')) {
//             var tmpId = '#' + col.cid;
//             $(tmpId + ' input').attr('checked', 'checked');
//             $(tmpId).addClass('struck');
//         }
//     });
// };