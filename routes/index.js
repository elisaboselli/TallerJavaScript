var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var router = express.Router();
var Game = require("../models/game").game;
var Player = require("../models/player").player;
var Round = require("../models/round").round;
var Card = require("../models/card").card;

/* GET home page. */
router.get('/', function (req, res) {
  var game = new Game();
  res.render('index', { user : req.user });
});

router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', function(req, res) {
    User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
        if (err) {
            return res.render('register', { user : user });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/newgame',function(req,res){
    res.render('newgame');
});

router.post('/newgame', function(req,res){
    var p1 = new Player ({name : req.body.Player1});
    var p2 = new Player ({name : req.body.Player2});
    var cartasp2 = [new Card(1,'basto'),new Card(1,'espada'),new Card(7,'espada')];
    var g = new Game ({name : req.body.GameName, player1 : p1 , player2 : p2 , score: [0,0], currentHand: p2});;
    g.save(function (err, game){
        if(err){
            console.log(err);
        }
        res.redirect('/play?gameid=' + game._id);
    });
});

router.get('/play', function(req,res){
    Game.findOne({_id:req.query.gameid},function(err,game){
        console.log(game.currentRound.fsm);
        if (game.currentRound == undefined){
            game.newRound();
            game.save(function(err,game2){
                if (err){
                    console.log(err)
                }
                res.render('play', {g : game2});
            });
        }
        res.render('play', {g : game});
    });
});

router.post('/play', function(req,res){
    console.log('hasta los huevos');
    Game.findOne({_id:req.body.gameid}, function(err,game){
        var pl= new Player(game.currentRound.player1);
        var r = new Round(game.currentRound);
        game.currentRound=r;
        game.currentRound.estado(game.currentRound.fsm.current);
        console.log(game.currentRound.fsm.transitions());
        if (req.body.jugada!== 'play card1' && req.body.jugada!== 'play card2' &&req.body.jugada!== 'play card3'){
            game.play(game.currentRound.currentTurn,req.body.jugada);
        }
        if (req.body.jugada == 'play card1'){
            game.play(game.currentRound.currentTurn,'play card',game.currentRound.currentTurn.cards[0]);   
        }
        if (req.body.jugada == 'play card2'){
            game.play(game.currentRound.currentTurn,'play card',game.currentRound.currentTurn.cards[1]);   
        }
        if (req.body.jugada == 'play card3'){
            game.play(game.currentRound.currentTurn,'play card',game.currentRound.currentTurn.cards[2]);   
        }
        game.save(function (err, g){
            console.log(g.currentRound.fsm);
            if(err){
               console.log(err);
             }  
            if(g.currentRound.fsm.current=='fin') {
                g.score = g.currentRound.score;
                if (g.win()){
                    res.redirect('/resultadogame?gameid=' + g._id);
                 }
                else{
                    res.redirect('/resultadoround?gameid=' + g._id);
                }
            }
            else
            res.redirect('/play?gameid=' + g._id);
         });
    })
});

router.get('/resultadogame', function(req,res){
    Game.findOne({_id:req.query.gameid},function(err,game){
        //MANEJAR ERRORES!!!
        res.render('resultadogame',{g:game});
    });
});

router.post('/resultadogame', function(req,res){
        res.redirect('/');
    });
router.get('/resultadoround', function(req,res){
    Game.findOne({_id:req.query.gameid},function(err,game){
        //MANEJAR ERRORES!!!
        res.render('resultadoround',{g:game});
    });
});
router.post('/resultadoround', function(req,res){
    Game.findOne({_id:req.body.gameid}, function(err,game){
        game.newRound();
        game.save(function (err, g){
            if(err){    
                console.log(err);
            }
            res.redirect('/play?gameid=' + g._id);
        });
    });
});


router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

//Esto no anda pero esta bien
router.get('/game1', function(req, res){
    var g = new Game({});
    res.status(200).send(g);
    /*Game.findOne({name:"game1"}, function(err,result){
        if (err) {
            console.log("err");
            console.log(err);
            done(err);
        }
        res.write(result);
    });*/
});

module.exports = router;
