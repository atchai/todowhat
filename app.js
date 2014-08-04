var App = App || {};
var order = [];
var rearrange = function(position) {
    return collection.get({cid: value});
}
App.model = Backbone.Model.extend({
    defaults: {
        done: false
    },
    toggle: function () {
        this.save({
            done: !this.get("done")
        });
    }
})

App.collection = Backbone.Collection.extend({
    localStorage: new Backbone.LocalStorage("StoredTodos"),
    model: App.model
})

var item1, item2, item3, item4, collection, listofitems;


App.view = Backbone.View.extend({
    initialize: function () {
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
    render: function () {
        listofitems = '';
        if (order.length == 0) {
            collection.each(function (col) {
                var tmpsting = '<li id=' + col.cid + '> <input type="checkbox">' + col.get('content') + '</li>';
                listofitems = tmpsting.concat(listofitems);
            });
            var html = this.template({
                test: '<h1>test</h1>',
                todoslist: listofitems
            });
            this.$el.html(html);
        }
        else {
            console.log('order array isnt empty');
            $(document).ready(function(){
                for (var i=0; i<order.length; i++)
                {
                    console.log(collection.get({cid: order[i]}).get('content'));
                    var tmpstring = '<li id=' + order[i] + '> <input type="checkbox">' + collection.get({cid: order[i]}).get('content') + '</li>';
                
                listofitems += tmpstring;
                }
                console.log(listofitems);
                $('#todoul').html(listofitems);
                
            });
            

        }
        $(document).ready(function () {
            collection.fetch();
            collection.each(function (col) {
                if (col.get('done')) {
                    var tmpid = '#' + col.cid;
                    console.log($(tmpid));
                    $(tmpid + ' input').attr('checked', 'checked');
                    $(tmpid).addClass('struck');
                }
            });
            $('input[type="checkbox"]').click(function () {
                if (this.checked) {

                    // console.log($(this).closest('li').attr("id"))
                    // console.log(collection.get($(this).closest('li').attr("id")));
                    collection.get($(this).closest('li').attr("id")).save({"done": true});
                    console.log(collection.get($(this).closest('li').attr("id")).get("done"));
                    $(this).closest('li').addClass('struck');
                } else {
                    $(this).closest('li').removeClass('struck');
                    collection.get($(this).closest('li').attr("id")).save({"done": false});
                    console.log(collection.get($(this).closest('li').attr("id")).get("done"));
                }
            })
        });
        $(document).ready(function () {

            $("#todoul").sortable({
                 update : function () {
                    order = $('#todoul').sortable('toArray');                    
                    console.log("Order: "+order);

                    localStorage["orderlist"] = JSON.stringify(order);
            

                }
            });
            $("#todoul").disableSelection();
        });
        return this;


    },
    addTodo: function (e) {
        e.preventDefault();
        $(document).ready(function () {
            var todotmp = $('#todofield').val();

            if (todotmp) {
                // collection.add({content: todotmp});
                collection.create({
                    content: todotmp
                });
                console.log('adding: ' + todotmp);
                // $('ul').prepend('<li>'+todotmp+'</li>');
                //  $('li:first').prepend('<input type="checkbox">');
                cid = collection.at(collection.length - 1).cid;
                console.log(cid);
                if (order.length != 0){ //if list has been rearranged, order array wont be empty
                    order.unshift(cid);
                }

            }
            $('input[type="checkbox"]').click(function () {
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