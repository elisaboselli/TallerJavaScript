var expect = require("chai").expect;
var gameModel = require("../models/game.js");

var Game = gameModel.game;

var playerModel = require("../models/player.js");
var Player = playerModel.player;

describe('Game',function(){
	it('should have player 1', function(){
		var p1 = new Player('Pedro');
		var p2 = new Player('Juan');
		var g = new Game(p1,p2);
		expect(g).to.have.property('player1');
	});
	
	it('should have player 2', function(){
		var p1 = new Player('Pedro');
		var p2 = new Player('Juan');
		var g = new Game(p1,p2);
		expect(g).to.have.property('player2');
	});
});

//COPIADO DEL GIT DEL PROFE: Hay que controlarlo despues porque me parece que hay algunas funciones que no existen.
/*describe('Game#play', function(){
  var game;

  beforeEach(function(){
    game = new Game();
    game.newRound();

    // Force to have the following cards and envidoPoints
    game.player1.setCards([
        new Card(1, 'copa'),
        new Card(7, 'oro'),
        new Card(2, 'oro')
    ]);

    game.player2.setCards([
        new Card(6, 'copa'),
        new Card(7, 'copa'),
        new Card(2, 'basto')
    ]);
  });

  it('plays [envido, quiero] should gives 2 points to winner', function(){
    game.play('player1', 'envido');
    game.play('player2', 'quiero');

    expect(game.score).to.deep.equal([0, 2]);
  });
});*/