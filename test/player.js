var expect = require("chai").expect;
var playerModel = require("../models/player.js");

var Player = playerModel.player;

describe('Player',function(){
	it('should have name', function(){
		var p = new Player('Pedro');
		expect(p).to.have.property('name');
	});
});
