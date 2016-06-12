var expect = require("chai").expect;
var gameModel = require("../models/game.js");

var Game = gameModel.game;

var playerModel = require("../models/player.js");
var Player = playerModel.player;

var cardModel = require("../models/card.js");
var Card = cardModel.card;

describe('Game',function(){
	it('should have two players', function(done){
    //console.log("PLAYER !!");
    //console.log(p1);
    
    /*var pla1;
    var pla2;
    p1.save(function (err,player1){
      console.log("player1 hola");
      if(err){
        console.log(err);
        done(err)
      }
      pla1=player1;
      //expect(game.player1).to.be.eq(data.player1);
      // expect(game.player2).to.be.eq(data.player2);
      //done();
    });
    p2.save(function (err,player2){
      console.log("player2 hola");
      if(err){
        console.log(err);
        done(err)
      }
      pla2=player2;
      //expect(game.player1).to.be.eq(data.player1);
      // expect(game.player2).to.be.eq(data.player2);
      //done();
    });
    console.log("pla1");
    console.log(pla1);*/

    var cartasp1 = [new Card(7,'basto'),new Card(12,'oro'),new Card(3,'basto')];
    var cartasp2 = [new Card(1,'basto'),new Card(1,'espada'),new Card(7,'espada')];
    var p1 = new Player({name: "Leo", password:"1234", cards: cartasp1 , pointsEnv: 30});
    var p2 = new Player({name: "Bruno", password:"5678", cards: cartasp2 , pointsEnv: 28});
    
    p1.save(function (err,player1){
      //console.log("player1 hola");
      if(err){
        console.log(err);
        done(err)
      }
      //pla1=player1;
      //expect(game.player1).to.be.eq(data.player1);
      // expect(game.player2).to.be.eq(data.player2);
      //done();
      p2.save(function (err,player2){
        //console.log("player2 hola");
        if(err){
          console.log(err);
          done(err)
        }
        //pla2=player2;
        //expect(game.player1).to.be.eq(data.player1);
        // expect(game.player2).to.be.eq(data.player2);
        //done();
        var data = {
          name : 'My Game',
          player1: player1,
          player2: player2,
          rounds : [],
          currentHand: player2,
          currentRound : undefined,
          score : [0,0]
        }
        //console.log("DATA !!");
        //console.log(data);
        var g = new Game(data);
        //console.log("Game !!");
        //console.log(g);
        g.save(function (err, game) {
          //console.log("Game hola");
          if(err){
            console.log(err);
            done(err)
          }
          //console.log(game.toString());
          Game.findOne({player2:player2._id},function(err,result){
            //console.log(result);
            if (err) {
              console.log("err");
              console.log(err);
              done(err);
            }
            Player.findOne({_id:result.player2}, function(err,result2){
              //console.log(result2.name);
              expect(result2.name).to.be.eq('Bruno');
              done();
            });
            //expect(result.player2.name).to.be.eq('Leoa');
          });
          //expect(game.player1.name).to.be.eq(data.player1.name);
          //expect(game.player2.name).to.be.eq(data.player2.name);
          //done();
        });
      });
    });
	});
	
	/*it('should have player 2', function(){
		var p1 = new Player('Pedro');
		var p2 = new Player('Juan');
		var g = new Game(p1,p2);
		expect(g).to.have.property('player2');
	});

	it('should change turn', function(){
		var game = new Game();
		game.newRound();
		expect(game.currentHand).to.be.equal(game.player1);
		game.currentHand = game.switchPlayer(game.currentHand);
		expect(game.currentHand).to.be.equal(game.player2);
		game.currentHand = game.switchPlayer(game.currentHand);
		expect(game.currentHand).to.be.equal(game.player1);
	});*/
});

/*describe('Game play (1)', function(){
  var game;

  beforeEach(function(){
    game = new Game();
    game.newRound();

    c1=new Card(1, 'copa');
    c2=new Card(7, 'oro');
    c3=new Card(2, 'oro');
    game.player1.cards=[c1,c2,c3];
    game.player1.pointsenv=game.player1.getPoints();

    c1=new Card(6, 'copa'),
    c2=new Card(7, 'copa'),
    c3=new Card(2, 'basto')
    game.player2.cards=[c1,c2,c3];
    game.player2.pointsenv=game.player2.getPoints();


  });

  it('plays [envido, quiero] should gives 2 points to winner', function(){
    game.play(game.player1, 'envido');
    game.play(game.player2, 'quiero');
    expect(game.score).to.deep.equal([0, 2]);
  });

  it('plays [envido, no quiero] should gives 1 points to player1', function(){
  	game.play(game.player1, 'envido');
  	game.play(game.player2, 'no-quiero');
  	expect(game.score).to.deep.equal([1, 0]);
  });

  it('plays [truco, no quiero] should gives 2 points to player1', function(){
    game.play(game.player1, 'truco');
    game.play(game.player2, 'no-quiero');
   	expect(game.score).to.deep.equal([1, 0]);
  });

  it('jugando con las cartas', function(){
    game.play(game.player1, 'play card', game.player1.jugarCarta(0));
    game.play(game.player2, 'play card', game.player2.jugarCarta(0));
    game.play(game.player1, 'play card', game.player1.jugarCarta(1));
    game.play(game.player2, 'play card', game.player2.jugarCarta(1));
   expect(game.score).to.deep.equal([1, 0]);
  });

  it('jugando con las cartas (con funcion jugarCarta)', function(){
    game.play(game.player1, 'play card', game.player1.jugarCarta(0));
    game.play(game.player2, 'play card', game.player2.jugarCarta(0));
    game.play(game.player1, 'play card', game.player1.jugarCarta(1));
    game.play(game.player2, 'play card', game.player2.jugarCarta(1));
   expect(game.score).to.deep.equal([1, 0]);
  });

  it('jugando con las cartas y truco', function(){
    game.play(game.player1, 'play card', game.player1.jugarCarta(0));
    game.play(game.player2, 'play card', game.player2.jugarCarta(2));
    game.play(game.player2, 'play card', game.player2.jugarCarta(1));
    game.play(game.player1, 'play card', game.player1.jugarCarta(1));
    game.play(game.player1, 'truco');
    game.play(game.player2, 'quiero');
    game.play(game.player1, 'play card', game.player1.jugarCarta(2));
    game.play(game.player2, 'play card', game.player2.jugarCarta(0));
   expect(game.score).to.deep.equal([2, 0]);
  });

});

describe('Game play (2)', function(){
  var game;

  beforeEach(function(){
    game = new Game();
    game.newRound();

    c1=new Card(1, 'copa');
    c2=new Card(7, 'oro');
    c3=new Card(2, 'espada');
    game.player1.cards=[c1,c2,c3];
    game.player1.pointsenv=game.player1.getPoints();

    c1=new Card(3, 'oro'),
    c2=new Card(7, 'copa'),
    c3=new Card(2, 'basto')
    game.player2.cards=[c1,c2,c3];
    game.player2.pointsenv=game.player2.getPoints();


  });

  it('jugando las cartas, 1er mano gana player2, 2da gana player1, player 2 canta truco, player 1 acepta, 3er mano empate; deberia darles los puntos del truco a player 2', function(){
    	game.play(game.player1, 'play card', game.player1.jugarCarta(0));
    	game.play(game.player2, 'play card', game.player2.jugarCarta(0));
	    game.play(game.player2, 'play card', game.player2.jugarCarta(1));
    	game.play(game.player1, 'play card', game.player1.jugarCarta(1));
	    game.play(game.player1, 'truco');
    	game.play(game.player2, 'quiero');
	    game.play(game.player1, 'play card', game.player1.jugarCarta(2));
    	game.play(game.player2, 'play card', game.player2.jugarCarta(2));
    expect(game.score).to.deep.equal([0, 2]);
  });
   it('jugando las cartas, 1er mano gana player1, 2da gana player2, player 2 canta truco, player 1 acepta, 3er mano empate; deberia darles los puntos del truco a player 1', function(){
	    game.play(game.player1, 'play card', game.player1.jugarCarta(1));
	    game.play(game.player2, 'play card', game.player2.jugarCarta(1));
	    game.play(game.player1, 'play card', game.player1.jugarCarta(0));
	    game.play(game.player2, 'play card', game.player2.jugarCarta(0));
	    game.play(game.player2, 'truco');
	    game.play(game.player1, 'quiero');
	    game.play(game.player2, 'play card', game.player2.jugarCarta(2));
	    game.play(game.player1, 'play card', game.player1.jugarCarta(2));
    expect(game.score).to.deep.equal([2, 0]);
  });
	it('jugando las cartas, 1er mano gana player2,player2 canta envido,player1 no quiere, 2da gana player1, player 2 canta truco, player 1 acepta, 3er mano empate; deberia darles los puntos del truco a mas un punto del envido a player2', function(){
		game.play(game.player1, 'play card', game.player1.jugarCarta(0));
		game.play(game.player2, 'envido');
		game.play(game.player1, 'no-quiero');
		game.play(game.player2, 'play card', game.player2.jugarCarta(0));
		game.play(game.player2, 'play card', game.player2.jugarCarta(1));
		game.play(game.player1, 'play card', game.player1.jugarCarta(1));
		game.play(game.player1, 'truco');
		game.play(game.player2, 'quiero');
		game.play(game.player1, 'play card', game.player1.jugarCarta(2));
		game.play(game.player2, 'play card', game.player2.jugarCarta(2));
  	expect(game.score).to.deep.equal([0, 3]);
  });
	it('jugando las cartas, 1er mano gana player2,player2 canta envido,player1 quiere, 2da gana player1, player 2 canta truco, player 1 acepta, 3er mano empate; deberia darles los puntos del truco a player 2 y los puntos del envido a player1', function(){
	    game.play(game.player1, 'play card', game.player1.jugarCarta(0));
		game.play(game.player2, 'envido');
		game.play(game.player1, 'quiero');
		game.play(game.player2, 'play card', game.player2.jugarCarta(0));
	    game.play(game.player2, 'play card', game.player2.jugarCarta(1));
	    game.play(game.player1, 'play card', game.player1.jugarCarta(1));
	    game.play(game.player1, 'truco');
	    game.play(game.player2, 'quiero');
	    game.play(game.player1, 'play card', game.player1.jugarCarta(2));
	    game.play(game.player2, 'play card', game.player2.jugarCarta(2));
    expect(game.score).to.deep.equal([2, 2]);
  });
});

describe('Game play (2)', function(){
  var game;

  beforeEach(function(){
    game = new Game();
  });

  it('jugando dos rondas, primera ronda dos puntos para player2, segunda ronda 4 puntos player1', function(){
    game.newRound();


    c1=new Card(1, 'copa');
    c2=new Card(7, 'oro');
    c3=new Card(2, 'espada');
    game.player1.cards=[c1,c2,c3];
    game.player1.pointsenv=game.player1.getPoints();

    c1=new Card(3, 'oro');
    c2=new Card(7, 'copa');
    c3=new Card(2, 'basto');
    game.player2.cards=[c1,c2,c3];
    game.player2.pointsenv=game.player2.getPoints();   
    game.play(game.player1, 'play card', game.player1.jugarCarta(0));
    game.play(game.player2, 'play card', game.player2.jugarCarta(0));
    game.play(game.player2, 'play card', game.player2.jugarCarta(1));
    game.play(game.player1, 'play card', game.player1.jugarCarta(1));
    game.play(game.player1, 'truco');
    game.play(game.player2, 'quiero');
    game.play(game.player1, 'play card', game.player1.jugarCarta(2));
    game.play(game.player2, 'play card', game.player2.jugarCarta(2));
    game.newRound();
    c1=new Card(1, 'espada');
    c2=new Card(7, 'oro');
    c3=new Card(6, 'oro');
    game.player1.cards=[c1,c2,c3];
    game.player1.pointsenv=game.player1.getPoints();

    c1=new Card(3, 'oro');
    c2=new Card(7, 'copa');
    c3=new Card(2, 'copa');
    game.player2.cards=[c1,c2,c3];
    game.player2.pointsenv=game.player2.getPoints();

    game.play(game.player2, 'play card', game.player2.jugarCarta(0));
	game.play(game.player1, 'envido');
	game.play(game.player2, 'quiero');
	game.play(game.player1, 'play card', game.player1.jugarCarta(0));
	game.play(game.player1, 'truco');
    game.play(game.player2, 'quiero');
    game.play(game.player1, 'play card', game.player1.jugarCarta(1));
    game.play(game.player2, 'play card', game.player2.jugarCarta(1));

  expect(game.score).to.deep.equal([4, 2]);
  });
});*/