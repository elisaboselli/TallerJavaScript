var roundModel = require("./round.js");
var playerModel = require("./player.js");
var Model = roundModel.round;
var Player = playerModel.player;


function Game(n1, n2){
	var p1 = new Player(n1);
	var p2 = new Player(n2);
	this.player1 = p1;
	this.player2 = p2;
	this.player2.mano = true;
}

module.exports.game = Game;
