var roundModel = require("./round.js");
var playerModel = require("./player.js");
var Model = roundModel.round;
var Player = playerModel.player;


function Game(n1, n2){
	//var p1 = new Player(this, n1);
	//var p2 = new Player(this, n2);
	this.player1 = new Player(this, n1);
	this.player2 = new Player(this, n2);
	this.rounds = [];
	this.currentHand = this.player1;
	this.currentRound = undefined;
	this.score = [0,0];
	//this.player2.mano = true;
}

//COPIADO DEL GIT DEL PROFE:

//Check if it's valid move and play in the current round
Game.prototype.play = function(player, action, value){
  if(this.currentRound.currentTurn !== player)
    throw new Error("[ERROR] INVALID TURN...");

  if(this.currentRound.fsm.cannot(action))
    throw new Error("[ERROR] INVALID MOVE...");

  return this.currentRound.play(action, value);
};

//Create and return a new Round to this game
Game.prototype.newRound = function(){
  var round = new Round(this, this.currentHand);
  this.currentRound = round;
  this.currentHand = switchPlayer(this.currentHand);
  this.rounds.push(round);

  return this;
}

//returns the oposite player
function switchPlayer(player) {
  return "player1" === player ? "player2" : "player1";
};


module.exports.game = Game;
