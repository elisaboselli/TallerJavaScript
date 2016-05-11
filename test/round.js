var expect = require("chai").expect;
var roundModel = require("../models/round.js");
var gameModel = require("../models/game.js");
var playerModel = require("../models/player.js");
var Round = roundModel.round;
var Game = gameModel.game;
var Player = playerModel.player;

describe('Round',function(){
	var g = new Game('Pedro','Juan');
	var r = new Round(g);
	it('player1 should have 3 cards', function(){

		expect(g.player1.cards).to.have.lengthOf(3);
	});
	
	it('player2 should have 3 cards', function(){
		expect(g.player2.cards).to.have.lengthOf(3);
	});
	
	it('the players should have differents hand',function(){
		expect(g.player1.mano).to.be.not.equal(g.player2.mano);
	});
	
	/*it('player should have this points', function(){
		expect().to.be.equal.();
	});*/
});
