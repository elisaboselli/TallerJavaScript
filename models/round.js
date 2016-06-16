var deckModel = require("./deck.js");
var gameModel = require("./game.js");
var cardModel = require("./card.js");
var playerModel = require("./player.js");
var Deck = deckModel.deck;
var Game = gameModel.game;
var Card = cardModel.card;
var Player = playerModel;

var StateMachine = require("../node_modules/javascript-state-machine/state-machine.js");

function newTrucoFSM(){
  var fsm = StateMachine.create({
  initial: 'init',
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
	this.currentHand = turn;
	//deck mix
	var d = new Deck().mix();
	//cards player 1 && cards player 2
	this.player1= game.player1;
	this.player2= game.player2;
	if (turn == game.player1){
		this.player1.cards = [d[0],d[2],d[4]];
		this.player2.cards = [d[1],d[3],d[5]];
	}
	else{
		this.player2.cards = [d[0],d[2],d[4]];
		this.player1.cards = [d[1],d[3],d[5]];
	}
	//calculate envido points for players
	this.player1.pointsenv = game.player1.getPoints();
	this.player2.pointsenv = game.player2.getPoints();
	//state machine 
	this.fsm = newTrucoFSM();
	//score truco
	this.scoretruco=1;
	//played cards in the table
	this.playedcards = [];
	//previus states
	this.estados= [];
	//array of who won each hand
	this.manosganadas= [];
	this.score= [0,0];
}

//Devuelve el jugador que gana el envido (compara puntos)
Round.prototype.confrontPoints = function(){
	if(this.player1.pointsenv>this.player2.pointsenv){
		return this.player1;
	}
	if(this.player1.pointsenv<this.player2.pointsenv){
		return this.player2;
	}
	if(this.player1.pointsenv===this.player2.pointsenv){
			return this.currentHand;
	}
}

//Cambia el turno
Round.prototype.changeTurn = function(){
	if (this.fsm.current =="played card"){
		//En el estado carta jugada
		if (((this.playedcards.length)  === 2) || (this.playedcards.length === 4)){
			//Si se jugaron 2 o 4 cartas controla a quien le toca el turno (quien gana el "enfrentamiento" de cartas)
			var aux = ((this.playedcards[this.playedcards.length - 1]).confront(this.playedcards[this.playedcards.length - 2]))
			if (aux===1){
				//Si aux = 1 entonces gano el que jugo ultimo, por lo tanto lo retorna (turno actual)
				return this.currentTurn;
			}
		}
	}
	//Si no entra al if, cambia el turno
	return this.currentTurn = this.switchPlayer(this.currentTurn);
}

//Cambia el jugador
Round.prototype.switchPlayer = function (player){
  if (player === this.player1){
  	player = this.player2;
  }
  else{
  	player = this.player1;
  }
  return player;
};

//Inserta una carta en la lista de cartas jugadas. Con manosganadas controlamos como va el juego.
Round.prototype.insertCard = function (card){
	//A la lista en la ultima posicion no ocupada guarda la carta jugada (independientemente de que jugador sea)
		this.playedcards.push(card);
		if ((this.playedcards.length === 2)||(this.playedcards.length  === 4) || (this.playedcards.length === 6)){
			//Si la cantidad de cartas jugadas es par, hay que confrontarlas para saber quien gana la mano
			var c1=(this.playedcards[this.playedcards.length - 1]);
			var c2=(this.playedcards[this.playedcards.length - 2]);
			var a = (c1.confront(c2));
			if (a===1){
				//Si c1 le gana a c2
				if (this.currentTurn ==this.player1){
					//Y es el turno de player1 (player1 jugo c1) agregamos 1 a manos ganadas
					this.manosganadas.push (1);
				}
				else{
					//Sino agregamos 1
					this.manosganadas.push (-1);
				}
			}
			if (a===-1){
				//Si c2 le gana a c1
				if (this.currentTurn ==this.player1){
					//Y es el turno de player1 (player1 jugo c1) agregamos 1 a manos ganadas
					this.manosganadas.push (-1);
				}
				else{
					//Sino agregamos 1
					this.manosganadas.push (1);
				}
			}
			if (a===0){
				//Si las cartas empatan, no se le suma nada
				this.manosganadas.push (0);
			}
		}	
}

//Controla si existe un ganador.
Round.prototype.winner = function(){
	if (((this.playedcards.length)  === 4) || (this.playedcards.length === 6)){
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
		if (sum ===0 && (this.playedcards.length === 6) ){
			//Si se jugaron las 6 cartas y se empataron todas, o bien ganaron una vez cada uno y empataron en el restante, se devuelve el jugador que es mano.
			if (this.manosganadas[0]=== -1){
					var noHand = this.switchPlayer(this.currentHand);
					return noHand			
			}
			else {
					return this.currentHand;		
			}
		}
	}
	//Si todavia no se puede calcular un ganador se devuelve null
	return null;
}

//Calculamos puntajes
Round.prototype.calculateScore = function(action){
  	if(action == "quiero" || action == "no-quiero"){
  		//Si se llego a una decision
  		if (this.estados[this.estados.length-1] == "envido"){
  			//Desde un envido
    		if (action == "quiero"){
    			//Y se quiso, le asignamos +2 puntos al ganador del envido.
   	 			if (this.confrontPoints()=== this.game.player1){
    				this.score[0] += 2;
   			 	}
    			if (this.confrontPoints()=== this.game.player2){
    				this.score[1] += 2;
   	 			}
 		   	}
    		if (action=="no-quiero"){
    			//Y no se quiso, le asignamos +1 punto al contrario del que tiene el turno (ya que el que tiene el turno dijo "no quiero")
    			if (this.player1 === this.currentTurn){
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
    			if (this.player1 === this.currentTurn){
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
    			this.scoretruco += 10;
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
  			else{
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
