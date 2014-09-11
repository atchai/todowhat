var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var Todo = require('../models/todo');
var BaseTodos = require('./basetodos');
Backbone.LocalStorage = require('backbone.localstorage')

GuestTodos = BaseTodos.extend({
    localStorage: new Backbone.LocalStorage("StoredGuestTodos")
});
module.exports = new GuestTodos([]);
