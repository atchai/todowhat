var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var Todo = require('../models/todo');
var BaseTodos = require('./basetodos');

Todos = BaseTodos.extend({
    url: '/todos',

    parse: function(response) {
        return response.todos;
    }
});

module.exports = new Todos([]);
