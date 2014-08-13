var app = app || {};

$(document).ready(function() {
    var todoAppView = new app.MainView();
    app.router = new app.Router();
    Backbone.history.start();
});