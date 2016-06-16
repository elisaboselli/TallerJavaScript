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
  var cartasp1 = [new Card(7,'basto'),new Card(12,'oro'),new Card(3,'basto')];
  var cartasp2 = [new Card(1,'basto'),new Card(1,'espada'),new Card(7,'espada')];
  var p1 = new Player({name: "Leo", password:"1234", cards: cartasp1 , pointsEnv: 0});
  var p2 = new Player({name: "Bruno", password:"5678", cards: cartasp2 , pointsEnv: 0});
  //console.log(p1.getPoints());
  var g = new Game({name:'MyGame2', player1: p1, player2: p2, currentHand: p2, currentRound: undefined, score: [0,0]});
  //console.log(g);
  g.save(function (err, game) {
    if(err){
      console.log(err);
      done(err)
    }
    g.newRound();
    it('player1 should have 3 cards', function(){
     expect(g.player1.cards).to.have.lengthOf(3);
    });
  
    it('player2 should have 3 cards', function(){
      expect(g.player2.cards).to.have.lengthOf(3);
    });
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
});

/*describe('Round',function(){
	var g = new Game();
	g.newRound();

	it('player1 should have 3 cards', function(){
		expect(g.player1.cards).to.have.lengthOf(3);
	});
	
	it('player2 should have 3 cards', function(){
		expect(g.player2.cards).to.have.lengthOf(3);
	});

});*/

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