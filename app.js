var App = App || {};

App.model = Backbone.Model.extend({
    defaults: {
        done: false,
        order: 0
    },
    toggle: function() {
        this.save({
            done: !this.get("done")
        });
    }
})

App.collection = Backbone.Collection.extend({
    localStorage: new Backbone.LocalStorage("StoredTodos"),
    model: App.model,
    comparator: 'order'
})


App.view = Backbone.View.extend({
    initialize: function() {
        dummy1 = new App.model({
            content: 'review this ticket'
        });
        dummy2 = new App.model({
            content: 'take a break'
        });
        dummy3 = new App.model({
            content: 'drink water or something'
        });
        dummy4 = new App.model({
            content: 'test4'
        });
        collection = new App.collection([]);
        collection.on('add', this.render, this);
        this.render();
    },
    events: {
        "click .submit": "addTodo",
        "click .remove": "removeTodo",
    },
    el: $("body"),
    template: _.template($('#test-template').html()),
    render: function() {
        listofitems = '';
        collection.each(function(col) {
            var tmpsting = '<li id=' + col.cid + '> <input type="checkbox">' + col.get('content') + '</li>';
            listofitems = tmpsting.concat(listofitems);
        });
        var html = this.template({
            test: '<h1>test</h1>',
            todoslist: listofitems
        });
        this.$el.html(html);
        $(document).ready(function() {
            collection.fetch();
            collection.each(function(col) {
                if (col.get('done')) {
                    var tmpid = '#' + col.cid;
                    console.log($(tmpid));
                    $(tmpid + ' input').attr('checked', 'checked');
                    $(tmpid).addClass('struck');
                }
            });
            $('input[type="checkbox"]').click(function() {
                if (this.checked) {

                    // console.log($(this).closest('li').attr("id"))
                    // console.log(collection.get($(this).closest('li').attr("id")));
                    collection.get($(this).closest('li').attr("id")).save({
                        "done": true
                    });
                    console.log(collection.get($(this).closest('li').attr("id")).get("done"));
                    $(this).closest('li').addClass('struck');
                } else {
                    $(this).closest('li').removeClass('struck');
                    collection.get($(this).closest('li').attr("id")).save({
                        "done": false
                    });
                    console.log(collection.get($(this).closest('li').attr("id")).get("done"));
                }
            })
        });
        $(document).ready(function() {
            $("#todoul").sortable({
                update: function(event, ui) {
                    var order = $('#todoul').sortable('toArray');
                    console.log("Order: " + order);
                    var cidOfDropped = ui.item.context.id;
                    var itemIndex = ui.item.index();
                    console.log('item index: ' + ui.item.index());
                    console.log('item cid: ' + cidOfDropped);
                    console.log('item below cid: ' + order[itemIndex + 1]);
                    console.log('item below order' + collection.get({
                        cid: order[itemIndex + 1]
                    }).get('order'));
                    collection.get({
                        cid: cidOfDropped
                    }).save({
                        'order': collection.get({
                            cid: order[itemIndex + 1]
                        }).get('order') + 1
                    });
                    // console.log(collection.get({cid: cidOfDropped}).get('order'));

                    console.log(collection.get({
                        cid: cidOfDropped
                    }).get('content'));
                    // collection.get({cid: cidOfDropped}).save({'order': }}           
                    console.log(collection.get({
                        cid: cidOfDropped
                    }).get('order'));
                    for (var i = 0; i < itemIndex; i++) {
                        var currentOrder = collection.get({
                            cid: order[i]
                        }).get('order');
                        collection.get({
                            cid: order[i]
                        }).save({
                            "order": currentOrder + 2
                        });
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
            var todotmp = $('#todofield').val();

            if (todotmp) {
                var todosAmount = collection.models.length;
                var highestOrder;
                if (todosAmount == 0) {
                    console.log('no models in collection m8');
                    collection.create({
                        content: todotmp
                    });
                } else {
                    highestOrder = collection.models[todosAmount - 1].get('order');
                    collection.create({
                        content: todotmp,
                        order: highestOrder
                    });
                }
                // collection.add({content: todotmp});

                console.log('adding: ' + todotmp);
                // $('ul').prepend('<li>'+todotmp+'</li>');
                //  $('li:first').prepend('<input type="checkbox">');
            }
            $('input[type="checkbox"]').click(function() {
                if (this.checked) {

                    // console.log($(this).closest('li').attr("id"))
                    console.log(collection.get($(this).closest('li').attr("id")));
                    collection.get($(this).closest('li').attr("id")).toggle();
                    $(this).closest('li').addClass('struck');
                } else {
                    $(this).closest('li').removeClass('struck');
                    collection.get($(this).closest('li').attr("id")).toggle();
                }
            })
        });


    }
});