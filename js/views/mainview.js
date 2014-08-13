/*jshint maxerr: 10000 */
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
        this.$tagList = $('#taglist');
        this.listenTo(app.tags, 'reset', this.render); 
        this.listenTo(app.tags, 'add', this.render); //so that new tags are added alphabetically
        this.listenTo(app.tags, 'remove', this.removeTagView);
        //retrieve any todos and tags in local storage and render them
        app.tags.fetch({
            reset: true
        });
        app.todos.fetch({
            reset: true
        });
        // if (!app.todos.last()) {
        //     this.$todoList.append('<li id="noTodos" class="list-group-item">Nothing to do</li>');
        // }
    },

    render: function() {
        this.orderPersistance();
        this.$tagList.empty(); 
        this.$tagList.append('<li class="list-group-item active">tags</li>');
        app.tags.each(function(t) { //all tags to be visible in taglist always
            this.addTagView(t);
        }, this);
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

    addTagView: function(tag) {
        var tagthing = new app.TagView({
            model: tag
        });
        this.$tagList.append(tagthing.render().el);
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