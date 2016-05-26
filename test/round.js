var expect = require("chai").expect;
var roundModel = require("../models/round.js");
var gameModel = require("../models/game.js");
var playerModel = require("../models/player.js");
var cardModel = require("../models/card.js");
var Round = roundModel.round;
var Game = gameModel.game;
var Player = playerModel.player;
var Card = cardModel.card;

describe('Round',function(){
	var g = new Game();
	g.newRound();

	it('player1 should have 3 cards', function(){
		expect(g.player1.cards).to.have.lengthOf(3);
	});
	
	it('player2 should have 3 cards', function(){
		expect(g.player2.cards).to.have.lengthOf(3);
	});

});

//COPIADO DEL GIT DEL PROFE: Hay que controlarlo despues porque me parece que hay algunas funciones que no existen.
/*describe('Round', function(){
 var game;

  beforeEach(function(){
    game = new Game();
    game.newRound();
  });

  describe("#deal", function(){
    it("should populate player1 cards", function(){
      var round = new Round(game);
      round.deal();

      expect(game.player1.cards.length).to.be.equal(3);
    });

    it("should populate player2 cards", function(){
      var round = new Round(game);
      round.deal();

      expect(game.player2.cards.length).to.be.equal(3);
    });
  });
});*/