var playerModel = require("../models/player.js");

var Player = playerModel.Player;


function Game(player1, player2){
	this.player1 = player1;
	this.player2 = player2;
}

module.exports.game = Game;
