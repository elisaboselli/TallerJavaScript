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
