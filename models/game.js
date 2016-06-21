var roundModel = require("./round.js");
var playerModel = require("./player.js");
var Round = roundModel.round;
var Player = playerModel.player;
var mongoose = require("mongoose");

var gameSchema = mongoose.Schema({
  //Game name
  //name : String,
  //Player name
  player1: String,
  //player name
  player2: String,
  //hand of the game
  currentHand :String,
  //current Round
  currentRound : Object,
  //Score of the game
  score : Array,
  //Points to win
  fin : Number 
});
var Game=mongoose.model('Game',gameSchema);


//Check if it's valid move and play and card played (if action = play card) in the current round
Game.prototype.play = function(action, value){
  //Lo saque por que ahora los juegos solo los hace el turno corriente
  /*if(this.currentRound.currentTurn !== player)
    throw new Error("[ERROR] INVALID TURN...");*/
  if(this.currentRound.fsm.cannot(action))
    throw new Error("[ERROR] INVALID MOVE...");
  //tengo que arreglar esto xq ahora manda solamente un numero
  if (action=="play card" && value == undefined)
  	throw new Error("[ERROR] PLAYED CARD...");
  return this.currentRound.play(action, value);
};

//retorna verdadero si ya hay un ganador
Game.prototype.win = function(){
  if (this.score[0]>=this.fin || this.score[1]>=this.fin){
    return true;
  }
  return false;
};

//Create and return a new Round to this game
Game.prototype.newRound = function(){
  this.currentHand = this.switchPlayer(this.currentHand);
  var r = new Round(this, this.currentHand);
  this.currentRound = r;
  return this;
};

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
