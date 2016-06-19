var mongoose = require("mongoose");
var deckModel = require("./deck.js");
var gameModel = require("./game.js");
var cardModel = require("./card.js");
var playerModel = require("./player.js");
var Deck = deckModel.deck;
var Game = gameModel.game;
var Card = cardModel.card;
var Player = playerModel.player;

var StateMachine = require("../node_modules/javascript-state-machine/state-machine.js");

function newTrucoFSM(estadoinit){
	if (estadoinit===undefined){
		estadoinit = 'init'; 
	}
  var fsm = StateMachine.create({
  initial: estadoinit,
  events: [
    { name: 'play card', from: 'init',                           to: 'primer carta' },
    { name: 'envido',    from: ['init', 'primer carta'],         to: 'envido' },
    { name: 'truco',     from: ['init', 'played card',
    								   'primer carta'],          to: 'truco'  },
    { name: 'play card', from: ['quiero', 'no-quiero',
                                'primer carta', 'played card'],  to: 'played card' },
    { name: 'quiero',    from: ['envido', 'truco'],              to: 'quiero'  },
    { name: 'no-quiero', from: ['envido', 'truco'],              to: 'no-quiero' },
    { name: 'finalizar', from: ['no-quiero','played card'], 	 to: 'fin'},
  ]});

  return fsm;
}
function Round(game,turn){
	//current turn
	this.currentTurn = turn;
	this.currentHand = this.currentTurn;
	//deck mix
	var d = new Deck().mix();
	//cards player 1 && cards player 2
	this.player1= new Player(game.player1);
	this.player2= new Player(game.player2);

	this.player1.handscards = [d[0],d[2],d[4]];
	this.player2.handscards = [d[1],d[3],d[5]];

	//calculate envido points for players
	this.player1.pointsenv = this.player1.getPoints();
	this.player2.pointsenv = this.player1.getPoints();
	//state machine 
	this.fsm = newTrucoFSM();
	//score truco
	this.scoretruco=1;
	this.estados=[];
	//array of who won each hand
	this.manosganadas=[];
	this.score= [0,0];
}

Round.prototype.actState = function(estadoinit) {
	this.fsm=newTrucoFSM(estadoinit);
};
//Devuelve el jugador que gana el envido (compara puntos)
Round.prototype.confrontPoints = function(){
	if(this.player1.pointsenv>this.player2.pointsenv){
		return this.player1;
	}
	if(this.player1.pointsenv<this.player2.pointsenv){
		return this.player2;
	}
	if(this.player1.pointsenv===this.player2.pointsenv){
		return this.isHand();
	}
}

//Cambia el turno
Round.prototype.changeTurn = function(){
	if (this.fsm.current =="played card" && (this.player1.playedcards.length === this.player2.playedcards.length)){
		//En el estado carta jugada
		var c1=(this.player1.playedcards[this.player1.playedcards.length - 1]);
		var c2=(this.player2.playedcards[this.player2.playedcards.length - 1]);
		var a = (c1.weight - c2.weight);
		if (a>0){
			this.currentTurn=this.player1.name
		}
		if (a<0){
			this.currentTurn=this.player2.name
		}
		if (a===0){
			this.switchTurn();
		}
	}
	//Si no entra al if, cambia el turno
	else{
	this.switchTurn();
	}
}

//Cambia el jugador
Round.prototype.switchTurn = function (){
  if (this.currentTurn === this.player1.name){
  	this.currentTurn = this.player2.name;
  }
  else{
  	this.currentTurn = this.player1.name;
  }
};
//Ahora recive el numero de carta que hay que jugar de el jugador que tiene el turno (debe recibir 0,1 o 2)
//Inserta una carta en la lista de cartas jugadas. Con manosganadas controlamos como va el juego.
Round.prototype.insertCard = function (value){
	if (this.currentTurn === this.player1.name){
		this.player1.playedcards.push(this.player1.handscards[value]);
		this.player1.handscards[value]=undefined;
	}
	else{
		this.player2.playedcards.push(this.player2.handscards[value]);
		this.player2.handscards[value]=undefined;
	}
	if (this.player1.playedcards.length === this.player2.playedcards.length){
		var c1=(this.player1.playedcards[this.player1.playedcards.length - 1]);
		var c2=(this.player2.playedcards[this.player2.playedcards.length - 1]);
		var a = (c1.weight - c2.weight);
		if (a>0){
			this.manosganadas.push(1);
		}
		if (a<0){
			this.manosganadas.push(-1);
		}
		if (a===0){
			this.manosganadas.push(0);
		}
	}
}


//Controla si existe un ganador.
Round.prototype.winner = function(){
	if ((this.player1.playedcards.length === this.player2.playedcards.length) && ((this.player1.playedcards.length===2) ||(this.player1.playedcards.length===3))){
		//Si estamos en posicion de saber si hay un ganador (es decir si ya se jugaron al menos dos manos)
		var sum=0;
		for (var i = 0; i < this.manosganadas.length; i++){
			sum+=this.manosganadas[i];		
		}
		if (sum>0){
			//Si se sumo 2 veces 1 significa que player1 gano 2 manos por lo tanto es ganador
			return this.player1;
		}
		if (sum<0){
			//Si se resto 2 veces 1 significa que player2 gano 2 manos por lo tanto es ganador
			return this.player2;
		}
		if ((sum ===0) && (this.manosganadas.length===3)){
			//Si se jugaron las 6 cartas y se empataron todas, o bien ganaron una vez cada uno y empataron en el restante, se devuelve el jugador que es mano.
			if (this.manosganadas[0] === 0){
				return this.isHand();
			}
			if (this.manosganadas[0]>0) {
				return this.player1;		
			}
			if (this.manosganads[0]<0){
				return this.player2;
			}
		}
	}
	//Si todavia no se puede calcular un ganador se devuelve null
	return null;
}
// devuelve el jugador que es mano
Round.prototype.isHand = function(){
	if (this.currentHand === this.player1.name) {
		return this.player1;
	}
	return this.player2;
}
//devuelve el jugador que tiene el turno
Round.prototype.isTurn = function(){
	if (this.currentTurn === this.player1.name) {
		return this.player1;
	}
	return this.player2;
}

//Calculamos puntajes
Round.prototype.calculateScore = function(action){
  	if(action == "quiero" || action == "no-quiero"){
  		//Si se llego a una decision
  		if (this.estados[this.estados.length-1] == "envido"){
  			//Desde un envido
    		if (action == "quiero"){
    			//Y se quiso, le asignamos +2 puntos al ganador del envido.
   	 			if (this.confrontPoints()=== this.player1){
    				this.score[0] += 2;
   			 	}
    			if (this.confrontPoints()=== this.player2){
    				this.score[1] += 2;
   	 			}
 		   	}
    		if (action=="no-quiero"){
    			//Y no se quiso, le asignamos +1 punto al contrario del que tiene el turno (ya que el que tiene el turno dijo "no quiero")
    			if (this.player1.name === this.currentTurn){
    				this.score[1] += 1; 
   		 		}
    			else{
    				this.score[0] +=1;
    			}

   		 	} 
   		}
   		if (this.estados[this.estados.length-1]=="truco"){
   			//En cambio si se llego desde un truco
    		if (action=="no-quiero"){
    			//Y no se quiso, le asignamos los puntos del truco al contrario del que tiene el turno (ya que el que tiene el turno dijo "no quiero")
    			if (this.player1.name === this.currentTurn){
    				this.score[1] += this.scoretruco;
   			 	}
    			else{
    				this.score[0] += this.scoretruco;
    			}
    			//Y finalizamos
    			this.fsm.finalizar();
    		}
    		//Y si se quiso, aumentamos en 1 los puntos acumulados del truco y los dejamos en espera para ver quien gana la mano
    		else {
    			this.scoretruco += 1;
    		}
		}
	}
}

//Juega
Round.prototype.play = function(action, value) {
  //Cambiamos de estado
  this.estados.push(this.fsm.current);
  this.fsm[action]();
  //Comprobamos puntajes
  this.calculateScore(action);
  if (action =="play card"){
  		//Si jugamos una carta la guardamos
  		this.insertCard(value);
  		if (this.winner ()!==null){
  			//Y si hay un ganador le asigna los puntos a los correspondientes.
  			if (this.winner()===this.player1){
  				this.score[0]+=this.scoretruco;
  			}
  			else{;
  				this.score[1]+=this.scoretruco;
  			}
  			//Por ultimo finalizamos.
  			this.fsm.finalizar();
  		}
  }
  //Y cambiamos el turno
  return this.changeTurn();
};

module.exports.round = Round;
