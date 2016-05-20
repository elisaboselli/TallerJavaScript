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

describe ('puntos del envido', function(){
	it('7 de basto , 12 de oro, 3 de basto  deberia devolver 30',function(){
		var c1 = new Card(7,'basto');
		var c2 = new Card(12,'oro');
		var c3 = new Card(3,'basto');
		var p=new Player ('Juan');
		p.cards=[c1,c2,c3] ;
		expect(p.getPoints()).to.be.equal(30);
	});
});
