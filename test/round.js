var expect = require("chai").expect;
var roundModel = require("../models/round.js");

var Round = roundModel.round;

describe('Round',function(){
	it('player1 should have 3 cards', function(){
		var r = new Round();
		expect(r.cardsplayer1).to.have.lengthOf(3);
	});
	
	it('player2 should have 3 cards', function(){
		var r = new Round();
		expect(r.cardsplayer2).to.have.lengthOf(3);
	});
});
