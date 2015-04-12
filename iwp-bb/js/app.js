// large help from http://documentcloud.github.io/backbone/docs/todos.html

$(function () {
  
  var Card = Backbone.Model.extend({
    defaults: function() {
      return {
        order: cardDeck.nextOrder(),
        title: "New Card",
        content: "New Content",
        created: Date.now(),
        edited: null,
        trashed: false
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
    trashed : function() {
      return this.where({trashed: true});
    },
    localStorage: new Backbone.LocalStorage("iwp-carddeck"),
    comparator:'order',
    reversed: false
  });

  var cardDeck = new CardDeck;
  var defaultCards = new CardDeck;
  defaults.forEach(function(param){
    var newCard = new Card(param);
      defaultCards.add(newCard); 
  });



  var CardView = Backbone.View.extend({
    tagName: "div",
    attributes: {class:"card"},
    template: _.template( $("#card_template").html() ),
    trashTemplate: _.template( $("#trash_card_template").html() ),
    initialize: function(){
      this.listenTo(this.model, 'change', this.reRender);
      this.listenTo(this.model, 'destroy', this.remove);
      this.listenTo(dispatcher, 'editToggle:click', this.toggleEdit);
    },
    events: {
      "click img.card-remove": "delete",
      "click img.edit-button": "toggleEdit",
      "dblclick .card-read": "edit",
      "blur .card-edit": "close"
    },
    render: function(){
        if(!this.model.get("trashed")) {
          this.$el.html(this.template(this.model.toJSON()));
          this.input = this.$('.card-edit');
        }else {
          this.$el.html(this.trashTemplate(this.model.toJSON()));
          //this.input = this.$('.card-edit');
        };
        return this;
    },
    reRender: function(){
      if (this.model.get("trashed")) {
        console.log("reRender and trashed");
        this.clear();

      }else {
        this.render();
      };
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
    /*updateOnEnter: function(e) {
      if (e.keyCode == 13) this.close();
    },*/
    clear: function() {
      //this.model.destroy();
      this.remove();
    },
    delete: function(){
      this.model.set("trashed", true);
      this.reRender();
    }
  });



  var AppView = Backbone.View.extend({
    el: $("div.wrapper"),
    initialize: function () {
      console.log("initializing appView");
      //cardDeck.fetch();
      that = this;
      cardDeck.each(function(model){ 
        that.drawCard(model);
      }); 
      //this.listenTo(dispatcher, 'delete:click', this.delCard());
    },
    events: {
      "click img.add": "makeCard",
      "click img.subtract": "delCard",
      "click img.edit": "editMode",
      "click img.load": "showList",
      "click img.reverse": "reverseCards",
      "click img.delete": "emptyTrash",
      "click div#help": "setDefault",
    },
    makeCard: function() {
      var newCard = new Card();
      cardDeck.add(newCard);
      this.drawCard(newCard);  
    },
    delCard: function(mod) {
        //cardDeck.last().destroy();
        //model = model || cardDeck.last(); 
        model = cardDeck.last(); 
        model.set("trashed", true);
        model.save();
    },
    editMode: function() {
        dispatcher.trigger("editToggle:click");
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
    drawCard: function(model) {
      var view = new CardView({ model:model });
        if(!model.get("trashed")) {
          $("#cardsEnd").before(view.render().el);
        }else {
          $(".trashcan").append(view.render().el);
        };
    },
    showList: function() {
      console.log(cardDeck.toJSON());
    },
    emptyTrash: function() {
      _.invoke(cardDeck.trashed(), 'destroy');
      return false;
    },
    setDefault: function() {
      console.log("setting default");
      cardDeck.reset();
      cardDeck = defaultCards;
      that = this;
      cardDeck.each(function(model){ 
        that.drawCard(model);
      }); 
    }
  });
  
  var dispatcher = _.extend({}, Backbone.Events);
  var appView = new AppView;


});