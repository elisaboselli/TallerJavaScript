var expect = require("chai").expect;
var playerModel = require("../models/player.js");
var cardModel = require("../models/card.js");
var Player = playerModel.player;
var Card = cardModel.card;

describe('Player',function(){
	it('should have name', function(){
		var p = new Player('Pedro');
		expect(p).to.have.property('name');
	});
	
	it('should play a card', function(){
		var p = new Player('Pedro');
		p.cards[0]= new Card(1,'oro');
		var c = p.jugarCarta(0);
		expect(c.show()).to.be.equal("1: oro");
	});

	it('should do not play a card', function(){
		var p = new Player('Pedro');
		p.cards[0]=null;
		expect(p.jugarCarta(0)).to.be.an('undefined');
	});
});
