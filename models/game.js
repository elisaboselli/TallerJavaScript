var roundModel = require("./round.js");
var playerModel = require("./player.js");
var Round = roundModel.round;
var Player = playerModel.player;


function Game(){
	//players of the game
	this.player1 = new Player(this, "Player1");
	this.player2 = new Player(this, "Player2");
	//array of round played an the current
	this.rounds = [];
	//player hand
	this.currentHand = this.player2;
	//curren Round
	this.currentRound = undefined;
	//score of the game, this.score[0] is the score of the player 1,this.score[1] is the score of the player 1
	this.score = [0,0];
}

//Check if it's valid move and play and card played (if action = play card) in the current round
Game.prototype.play = function(player, action, value){
  if(this.currentRound.currentTurn !== player)
    throw new Error("[ERROR] INVALID TURN...");

  if(this.currentRound.fsm.cannot(action))
    throw new Error("[ERROR] INVALID MOVE...");
  if (action=="play card" && value == undefined)
  	throw new Error("[ERROR] PLAYED CARD...");


  return this.currentRound.play(action, value);
};

//Create and return a new Round to this game
Game.prototype.newRound = function(){
	this.currentHand = this.switchPlayer(this.currentHand);
  var round = new Round(this, this.currentHand);
  this.currentRound = round;
  this.rounds.push(round);
  return this;
}

//returns the oposite player
Game.prototype.switchPlayer = function (player) {
  if (player === this.player1){
  	player = this.player2;
  }
  else{
  	player = this.player1;
  }
  return player;
};


module.exports.game = Game;
