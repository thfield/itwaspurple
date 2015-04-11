// large help from http://documentcloud.github.io/backbone/docs/todos.html

$(function () {
  
  var Card = Backbone.Model.extend({
    defaults: function() {
      return {
        order: cardDeck.nextOrder(),
        title: "New Card",
        content: "New Content",
        created: Date.now(),
        edited: null
      };
    },
    initialize: function(){
      console.log("New card Created: " + this.get('order'));
    }
  });



  var CardDeck = Backbone.Collection.extend({
    initialize: function (model, options) {
      //console.log("initializing cardDeck");
    },
    model: Card,
    nextOrder: function() {
      if (!this.length) return 1;
      if(this.reversed) {
        return this.first().get('order') + 1;
      }else {
        return this.last().get('order') + 1;
      };
    },
    localStorage: new Backbone.LocalStorage("iwp-carddeck"),
    comparator:'order',
    reversed: false
  });

  var cardDeck = new CardDeck;
  //TODO: make separate collection for trash can

  

  var CardView = Backbone.View.extend({
    tagName: "div",
    attributes: {class:"card"},
    template: _.template( $("#card_template").html() ),
    initialize: function(){
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
      this.listenTo(dispatcher, 'click', this.toggleEdit);
    },
    events: {
      "click img.card-remove": "clear",
      "click img.edit-button": "toggleEdit",
      "dblclick .card-read": "toggleEdit"
    },
    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        this.input = this.$('.card-edit');
        return this;
    },

    toggleEdit: function() {
      if ( this.$el.hasClass("editing") ) {
        this.close();
      }else {
        this.edit();
      };
    },
    edit: function() {
      this.$el.addClass("editing");
    },
    close: function() {
      var content = this.input.val();
      if (!content) {
        this.clear();
      } else {
        this.model.save({ content: content, edited: Date.now() });
        this.$el.removeClass("editing");
      }
    },
    updateOnEnter: function(e) {
      if (e.keyCode == 13) this.close();
    },
    clear: function() {
      this.model.destroy();
    }
  });



  var AppView = Backbone.View.extend({
    el: $("div.wrapper"),
    initialize: function (options) {
      console.log("initializing appView");
    },
    events: {
      "click img.add": "addCard",
      "click img.subtract": "delCard",
      "click img.edit": "editMode",
      "click img.load": "showList",
      "click img.reverse": "reverseCards",
    },
    addCard: function() {
      var newCard = new Card();
      cardDeck.add(newCard);
      this.drawCard(newCard);  
    },
    delCard: function() {
        cardDeck.last().destroy();
        //cardDeck.pop(); // change to pop() when implemeting trashcan collection
    },
    editMode: function() {
        console.log("entering edit mode");
        //$(".card").toggleClass("editing");
        dispatcher.trigger("click");
    },
    reverseCards: function() {
        cardDeck.reversed = !cardDeck.reversed;
        cardDeck.comparator = function(card){
          if(this.reversed) {
              return -card.get('order');
            } else {
              return card.get('order');
            };
          };
        cardDeck.sort();
        var list = $(".cards>.card").get().reverse();
        $.each(list, function (i) {
            $("#cardsEnd").before(list[i]);
        });
    },
    drawCard: function(card) {
      var view = new CardView({ model:card });
      this.$("#cardsEnd").before(view.render().el);
    },
    showList: function() {
      console.log(cardDeck.toJSON());
    }
  });
  
  var dispatcher = _.extend({}, Backbone.Events);
  var appView = new AppView;
});