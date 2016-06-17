var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var router = express.Router();
var Game = require("../models/game").game;
var Player = require("../models/player").player;
var Round = require("../models/round").round;
var Card = require("../models/card").card;
var StateMachine = require("../node_modules/javascript-state-machine/state-machine.js");


/* GET home page. */
router.get('/', function (req, res) {
  var game = new Game();
  res.render('index', { user : req.user });
});

/* GET registe page.*/
router.get('/register', function(req, res) {
    res.render('register', { });
});

/* Post register page.*/
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

/* GET login page.*/
router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

/* POST login page*/
router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});
/* GET logout page*/
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});
/* GET newgame page*/
router.get('/newgame',function(req,res){
    res.render('newgame');
});
/*POST newgame page*/
router.post('/newgame', function(req,res){
    var p1 = new Player ({name : req.body.Player1});
    var p2 = new Player ({name : req.body.Player2});
    var g = new Game ({name : req.body.GameName, player1 : p1 , player2 : p2 , score: [0,0], currentHand: p2});
    g.save(function (err, game){;
        if(err){
            console.log(err);
        }
        res.redirect('/play?gameid=' + game._id);
    });
});
/*GET play page*/
router.get('/play', function(req,res){
    console.log(req.query.gameid);
    Game.findOne({_id:req.query.gameid},function(err,game){
        console.log(game.currentRound);
        if (game.currentRound == undefined){
            game.newRound();
            game.save(function(err,game2){
                if (err){
                    console.log(err);
                }
                console.log(game2.currentRound);
                res.render('play', {g : game2});
            });
        }
        var r = game.currentRound;
        r.__proto__ = Round.prototype;
        r.actState(r.fsm.current);
        res.render('play', {g : game});
    });
});

/*POST play  page*/
router.post('/play', function(req,res){
    Game.findOne({_id:req.body.gameid}, function(err,game){
        var r = game.currentRound;
        r.__proto__ = Round.prototype;
        r.actState(r.fsm.current);
        game.currentRound=r;
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
            console.log('aca me muestra actualizado')
            console.log(g.currentRound.fsm.current);
            if(err){
               console.log(err);
             }
             console.log(g._id);
             Game.findOne({_id:g._id},function(err,game){
                if(err){
                    console.log(err)
                }
                console.log('Aca me muestra desactualizado');
                console.log(game._id);
                console.log(game.currentRound.fsm.current);
            });
            if(g.currentRound.fsm.current=='fin') {
                //tiene que ir en resultado game o resultado score o guardar de vuelta
                g.score = g.currentRound.score;
                if (g.win()){
                    res.redirect('/resultadogame?gameid=' + g._id);
                 }
                else{
                    res.redirect('/resultadoround?gameid=' + g._id);
                }
            }
            else{
                res.redirect('/play?gameid=' + g._id);
            }
        });
    });
});

/*GET resaltadogame page*/
router.get('/resultadogame', function(req,res){
    Game.findOne({_id:req.query.gameid},function(err,game){
        //MANEJAR ERRORES!!!
        res.render('resultadogame',{g:game});
    });
});

/*POST resultadogame page*/
router.post('/resultadogame', function(req,res){
        res.redirect('/');
    });

/*GET resultadoround page*/
router.get('/resultadoround', function(req,res){
    Game.findOne({_id:req.query.gameid},function(err,game){
        //MANEJAR ERRORES!!!
        res.render('resultadoround',{g:game});
    });
});

/*POST resultadoround page*/
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


module.exports = router;
