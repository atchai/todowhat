var App = App || {};

App.model = Backbone.Model.extend({
    defaults: {
        done: false
    },
        localStorage: new Backbone.LocalStorage("StoredTodos"),

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
var orderArray = [];

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
        collection.each(function (col) {
            var tmpsting = '<li id=' + col.cid + '> <input type="checkbox">' + col.get('content') + '</li>';
            listofitems = tmpsting.concat(listofitems);
        });
        var html = this.template({
            test: '<h1>test</h1>',
            todoslist: listofitems
        });
        this.$el.html(html);
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
            var storedOrders = JSON.parse(localStorage["orders"]);
            if (storedOrders) {
            	listofitems = '';
            	for (var i=0; i<storedOrders.length; i++) {
        		var tmpcontent = collection.get({cid: storedOrders[i]}).get('content');
        		console.log(tmpcontent);
        		var tmpstring = '<li id="' + storedOrders[i] + '"> <input type="checkbox">' + tmpcontent + '</li>';
        		console.log(tmpstring);
        		listofitems += tmpstring;
        		// var tmpstring = '<li id=' + storedOrders[i] + '> <input type="checkbox">'+collection.get({cid: storedOrders[i]}).get('content')+<'/li'>;
        		// listofitems += tmpstring;
        	}
        	console.log(listofitems);
        	$('ul').html(listofitems);
        	collection.each(function (col) {
                if (col.get('done')) {
                    var tmpid = '#' + col.cid;
                    console.log($(tmpid));
                    $(tmpid + ' input').attr('checked', 'checked');
                    $(tmpid).addClass('struck');
                }
            });
            }
			
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
					var order = $('#todoul').sortable('toArray').toString();					
            		console.log("Order: "+order);
            		orderArray = $('#todoul').sortable('toArray');
            		localStorage["orders"] = JSON.stringify(orderArray);
	

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
                $('ul').prepend('<li>'+todotmp+'</li>');
                	$('li:first').prepend('<input type="checkbox">');
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