var deckModel = require("./deck.js");
var gameModel = require("./game.js");
var Deck = deckModel.deck;
var Game = gameModel.game;

var StateMachine = require("../node_modules/javascript-state-machine/state-machine.js");

function newTrucoFSM(){
  var fsm = StateMachine.create({
  initial: 'init',
  events: [
    { name: 'play card', from: 'init',                           to: 'primer carta' },
    { name: 'envido',    from: ['init', 'primer carta'],         to: 'envido' },
    { name: 'truco',     from: ['init', 'played card'],          to: 'truco'  },
    { name: 'play card', from: ['quiero', 'no-quiero',
                                'primer carta', 'played card'],  to: 'played card' },
    { name: 'quiero',    from: ['envido', 'truco'],              to: 'quiero'  },
    { name: 'no-quiero', from: ['envido', 'truco'],              to: 'no-quiero' },
  ]});

  return fsm;
}


function Round(game,turn){
	this.game = game;
	this.currentTurn = turn;
	var d = new Deck().mix();
	this.m = 0;
	this.env = 0;
	this.tru = 1;
	game.player1.cards = [d[0],d[2],d[4]];
	game.player2.cards = [d[1],d[3],d[5]];
	game.player1.pointsenv = game.player1.getPoints();
	game.player2.pointsenv = game.player2.getPoints();
	//game.player1.mano = !(game.player1.mano);
	//game.player2.mano = !(game.player2.mano);
	this.fsm = newTrucoFSM();
	this.status='running';
	this.score=[0,0];
}

Round.prototype.confrontPoints = function(){
	if(game.player1.pointsenv>game.player2.pointsenv){
		return game.player1;
	}
	if(game.player1.pointsenv<game.player2.pointsenv){
		return game.player2;
	}
	if(game.player1.pointsenv===game.player2.pointsenv){
		if(game.player1.mano){
			return game.player1;
		}
		return game.player2;
	}
}

/*Round.prototype.poderCantarEnvido = function(){
	if((this.m===0)&&(this.tru===1)){
		return true;
	}
	return false;
}

Round.prototype.jugarEnvido = function(){
	if(game.player1.cantoEnvido()){
		this.env = this.env + 1;
		if(game.player2.aceptoEnvido()){
			this.env = this.env + 1;
			confrontPoints().pointsTot = confrontPoints().pointsTot+this.env;
		}
		game.player1.pointsenv=this.env;
		this.env = 0;
	}
	if(game.player2.cantoEnvido()){
		this.env = this.env + 1;
		if(game.player1.aceptoEnvido()){
			this.env = this.env + 1;
			confrontPoints().pointsTot = confrontPoints().pointsTot+this.env;
		}
		game.player2.pointsenv=this.env;
		this.env = 0;
	}
}

Round.prototype.cantoEnvido = function(){
	return (confirm("¿Quieres cantar Envido?"));
}

Round.prototype.aceptoEnvido = function(){
	return (confirm("¿Quieres aceptar Envido?"));
}*/

//COPIADO DEL GIT DEL PROFE:
//Cambia el turno
Round.prototype.changeTurn = function(){
   return this.currentTurn = switchPlayer(this.currentTurn);
}

//Cambia el jugador
function switchPlayer(player) {
  return "player1" === player ? "player2" : "player1";
};

//Juega
Round.prototype.play = function(action, value) {
  // move to the next state
  this.fsm[action]();

  // check if is needed sum score
  this.calculateScore(action);

  // Change player's turn
  return this.changeTurn();
};

module.exports.round = Round;
