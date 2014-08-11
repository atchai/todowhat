app = app || {}

app.MainView = Backbone.View.extend({
    events: {
        "click .submit": "addTodo",
        "keyup #todofield": "keyPressEventHandler",
        "keyup #tagsfield": "keyPressEventHandler"
    },

    el: $("body"),

    initialize: function() {
        this.$todoList = $("#todoul");
        this.listenTo(app.todos, 'reset', this.render);
        this.listenTo(app.todos, 'add', this.addTodoView);
        this.listenTo(app.todos, 'remove', this.removeTodoView);
        this.listenTo(app.tags, 'reset', this.render);
        this.listenTo(app.tags, 'add', this.addTagView);
        this.listenTo(app.tags, 'remove', this.removeTagView);

        app.tags.fetch({
            reset: true
        });
        app.todos.fetch({
            reset: true
        });
        if (app.todos.models.length == 0) {
            this.$todoList.append('<li id="noTodos" class="list-group-item">Nothing to do</li>');
        }
    },

    render: function() {
        // this.$todoList.empty();
        this.orderPersistance();
        $('#taglist').empty();
        $('#taglist').append($('<li class="list-group-item active">tags</li>'));
        app.tags.each(function(t) {
            this.addTagView(t);
        }, this);

        $('#showAll').attr("id", "showAllDummy");
        $('a').css('font-weight', 'normal');
        $('#showAllDummy').css('font-weight', 'bold');
        if (app.todos.filterDone(true).length == 0) {
            $('#filterDone').addClass('disabled');
        } else {
            $('#filterDone').removeClass('disabled');
        }
        if (app.todos.filterDone(false).length == 0) {
            $('#filterNotDone').addClass('disabled');
        } else {
            $('#filterNotDone').removeClass('disabled');
        }

        switch (app.router.filterParam) {
            case 'done':
                this.filterDone();
                var thing = app.todos.filterDone(true);
                if (thing.length == 0) {
                    this.showAll();
                }
                break;
            case 'todo':
                this.filterNotDone();
                var thing = app.todos.filterDone(false);
                if (thing.length == 0) {
                    this.showAll();
                }
                break;
            default:
                this.showAll();
                break;
                return this;
        }
    },

    addTodo: function(e) {
        e.preventDefault();
        var todoContent = $('#todofield').val();
        var tagsContent = $('#tagsfield').val().split(',');
        tagsContent = _.map(tagsContent, function(t) {
            return t.trim();
        });
        console.log(tagsContent[0].length);
        if (todoContent && todoContent.length <= 255 && ($.trim(todoContent)) != 0 && tagsContent[0].length!=0) {
            app.todos.create({
                content: todoContent,
                order: app.todos.newOrder(),
                tags: tagsContent
            });
            _.each(tagsContent, function(t) {
                app.tags.exist(t);
            });
            $('#todofield').val('');
            $('#tagsfield').val('');
            $('.submit').addClass('disabled');
        }
        else if (todoContent && todoContent.length <= 255 && ($.trim(todoContent)) != 0) {
            app.todos.create({
                content: todoContent,
                order: app.todos.newOrder()
            });
            $('#todofield').val('');
            $('#tagsfield').val('');
            $('.submit').addClass('disabled');
        }

    },

    addTodoView: function(todo) {
        var thing = new app.TodoView({
            model: todo
        });
        this.$todoList.prepend(thing.render().el);
        this.orderPersistance();
        if ($('#noTodos')) {
            $('#noTodos').remove();
        };
        if (app.todos.filterDone(true).length == 0) {
            $('#filterDone').addClass('disabled');
        } else {
            $('#filterDone').removeClass('disabled');
        }
        if (app.todos.filterDone(false).length == 0) {
            $('#filterNotDone').addClass('disabled');
        } else {
            $('#filterNotDone').removeClass('disabled');
        }
    },

    removeTodoView: function(todo) {
        var cid = '#' + todo.cid;
        $(cid).remove();
        if (app.todos.filterDone(true).length == 0) {
            $('#filterDone').addClass('disabled');
        } else {
            $('#filterDone').removeClass('disabled');
        }
        if (app.todos.filterDone(false).length == 0) {
            $('#filterNotDone').addClass('disabled');

        } else {
            $('#filterNotDone').removeClass('disabled');
        }
        if (app.todos.models.length == 0) {
            this.$todoList.append('<li id="noTodos" class="list-group-item">Nothing to do</li>');
        }
    },

    filterDone: function() {
        app.router.navigate('done', {
            trigger: true
        });
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
        app.router.navigate('todo', {
            trigger: true
        });
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
        app.router.navigate('#', {
            trigger: true
        });
        this.$todoList.empty();
        app.todos.each(function(c) {
            this.addTodoView(c);
        }, this);
    },
    addTagView: function(tag) {
        var tagthing = new app.TagView({
            model: tag
        });
        $('#taglist').append(tagthing.render().el);
    },
    removeTagView: function(tag) {
        var cid = '#tag' + tag.cid;
        $(cid).remove();
    },
    keyPressEventHandler: function(event) {
        if (event.keyCode == 13) {
            this.$(".submit").click();
        }
    },
    orderPersistance: function() {
        this.$todoList.sortable({
            update: function(event, ui) { //use underscore bind, underscore javascript templates
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