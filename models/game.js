var roundModel = require("./round.js");
var playerModel = require("./player.js");
var Round = roundModel.round;
var Player = playerModel.player;
var mongoose = require("mongoose");
/*mongoose.connect("mongodb://localhost/truco");
var db = mongoose.connection;
//var db = mongoose.createConnection('mongodb://localhost/truco');
db.on('error',console.error.bind(console,'connection error'));
db.once('open',function(){
  console.log('connection on');
});*/

var ObjectId = mongoose.Schema.Types.ObjectId;

var gameSchema = mongoose.Schema({
  name : String,
  //player1 : { type: ObjectId, ref: 'Player' },
  player1: Object,
  //player2 : { type: ObjectId, ref: 'Player' },
  player2:Object,
  //rounds : Array,
  currentHand :Object,
  //currentHand : { type: ObjectId, ref: 'Player' },
  currentRound : Object,
  //currentRound : { type: ObjectId, ref: 'Round' },
  score : Array
});

var Game=mongoose.model('Game',gameSchema);

/*function Game(){
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
}*/

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
