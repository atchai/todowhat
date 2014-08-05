app.toggleDoneStatus = function() {
    $('input[type="checkbox"]').click(function() {
        if (this.checked) {
            app.todos.get($(this).closest('li').attr("id")).save({
                "done": true
            });
            console.log(app.todos.get($(this).closest('li').attr("id")).get("done"));
            $(this).closest('li').addClass('struck');
        } else {
            $(this).closest('li').removeClass('struck');
            app.todos.get($(this).closest('li').attr("id")).save({
                "done": false
            });
            console.log(app.todos.get($(this).closest('li').attr("id")).get("done"));
        }
    })
};
app.MainView = Backbone.View.extend({
    initialize: function() {
        app.todos.on('add', this.render, this);
        this.render();
    },
    events: {
        "click .submit": "addTodo",
        "click .remove": "removeTodo",
    },
    el: $("body"),
    template: _.template($('#app-template').html()),
    render: function() {
        listofitems = '';
        app.todos.each(function(col) {
            var tmpsting = '<li id=' + col.cid + '> <input type="checkbox">' + col.get('content') + '</li>';
            listofitems = tmpsting.concat(listofitems);
        });
        var html = this.template({
            test: '<h1>Todos</h1>',
            todoslist: listofitems
        });
        this.$el.html(html);
        $(document).ready(function() {
            app.todos.fetch();
            app.todos.each(function(col) { //check if has been marked as done, then sets style
                if (col.get('done')) {
                    var tmpid = '#' + col.cid;
                    console.log($(tmpid));
                    $(tmpid + ' input').attr('checked', 'checked');
                    $(tmpid).addClass('struck');
                }
            });
            app.toggleDoneStatus();
            $("#todoul").sortable({
                update: function(event, ui) {
                    var order = $('#todoul').sortable('toArray');
                    var cidOfDropped = ui.item.context.id;
                    var itemIndex = ui.item.index();
                    if (itemIndex == order.length - 1) {
                        var cidOfAbove = order[itemIndex - 1];
                        var orderOfAbove = app.todos.get({cid: cidOfAbove}).get('order');
                        app.todos.get({cid: cidOfDropped}).save({'order': orderOfAbove-1});
                        // console.log(app.todos.models[itemIndex])
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
            $("#todoul").disableSelection();
        });
        return this;


    },
    addTodo: function(e) {
        e.preventDefault();
        $(document).ready(function() {
            var todoContent = $('#todofield').val();

            if (todoContent) {
                var todosAmount = app.todos.models.length;
                var highestOrder;
                if (todosAmount == 0) {
                    console.log('no models in app.todos m8');
                    app.todos.create({
                        content: todoContent
                    });
                } else {
                    highestOrder = app.todos.models[todosAmount - 1].get('order');
                    app.todos.create({
                        content: todoContent,
                        order: highestOrder
                    });
                }
                console.log('adding: ' + todoContent);
            }
            app.toggleDoneStatus();
        });


    }
})