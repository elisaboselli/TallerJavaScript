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

describe ('Puntos del Envido', function(){
	it('7 de basto , 12 de oro, 3 de basto  deberia devolver 30',function(){
		var c1 = new Card(7,'basto');
		var c2 = new Card(12,'oro');
		var c3 = new Card(3,'basto');
		var p=new Player ('Juan');
		p.cards=[c1,c2,c3] ;
		expect(p.getPoints()).to.be.equal(30);
	});

	it('6 de basto , 12 de basto, 3 de oro  deberia devolver 26',function(){
		var c1 = new Card(6,'basto');
		var c2 = new Card(12,'basto');
		var c3 = new Card(3,'oro');
		var p=new Player ('Juan');
		p.cards=[c1,c2,c3] ;
		expect(p.getPoints()).to.be.equal(26);
	});

	it('4 de basto , 12 de oro, 3 de basto  deberia devolver 27',function(){
		var c1 = new Card(4,'basto');
		var c2 = new Card(12,'oro');
		var c3 = new Card(3,'basto');
		var p=new Player ('Juan');
		p.cards=[c1,c2,c3] ;
		expect(p.getPoints()).to.be.equal(27);
	});

	it('4 de copa , 2 de copa, 7 de copa  deberia devolver 31',function(){
		var c1 = new Card(4,'copa');
		var c2 = new Card(2,'copa');
		var c3 = new Card(7,'copa');
		var p=new Player ('Juan');
		p.cards=[c1,c2,c3] ;
		expect(p.getPoints()).to.be.equal(31);
	});

	it('7 de espada , 12 de oro, 3 de basto  deberia devolver 7',function(){
		var c1 = new Card(7,'espada');
		var c2 = new Card(12,'oro');
		var c3 = new Card(3,'basto');
		var p=new Player ('Juan');
		p.cards=[c1,c2,c3] ;
		expect(p.getPoints()).to.be.equal(7);
	});

	it('11 de basto , 12 de oro, 11 de espada  deberia devolver 0',function(){
		var c1 = new Card(11,'basto');
		var c2 = new Card(12,'oro');
		var c3 = new Card(11,'espada');
		var p=new Player ('Juan');
		p.cards=[c1,c2,c3] ;
		expect(p.getPoints()).to.be.equal(0);
	});

	it('11 de basto , 12 de basto, 11 de espada  deberia devolver 20',function(){
		var c1 = new Card(11,'basto');
		var c2 = new Card(12,'basto');
		var c3 = new Card(11,'espada');
		var p=new Player ('Juan');
		p.cards=[c1,c2,c3] ;
		expect(p.getPoints()).to.be.equal(20);
	});
});
