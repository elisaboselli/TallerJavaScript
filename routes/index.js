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
    res.render('newgame',{user:req.session.passport.user});
});

/*POST newgame page*/
router.post('/newgame', function(req,res){
    var g = new Game ({player1 : req.session.passport.user, score: [0,0], fin:req.body.cantidad, state: "Unstarted"});
    g.save(function (err, game){;
        if(err){
            console.log(err);
        }
        res.redirect('/play?gameid=' + game._id);
    });
});

router.get('/games',function(req,res){
    Game.find({state:"Unstarted"},function(err,games){
        if (err){
            console.log(err);
        }
        res.render('games', {games : games});
    });
});

router.post('/games',function(req,res){
    Game.findOne({_id:req.body.gameid},function(err,game){
        game.player2=req.session.passport.user;
        game.newRound();
        Game.update({ _id: req.body.gameid }, { $set :{ player2 : game.player2 ,currentHand : game.currentHand, currentRound : game.currentRound, state : "Started" }},function (err,result){
            res.redirect ('/play?gameid='+ req.body.gameid);
        });
    });
});

/*GET play page*/
router.get('/play', function(req,res){
    Game.findOne({_id:req.query.gameid},function(err,game){
        if (game.currentRound == undefined){
            res.render('play', {g : game, user:req.session.passport.user});
        }
        else{
            var r = game.currentRound;
            r.__proto__ = Round.prototype;
            r.actState(r.fsm.current);
            var user;
            var rival;
            if (req.session.passport.user===game.player1){
                user=r.player1;
                rival=r.player2;
            }
            else{
                user=r.player2;
                rival=r.player1;
            }
            if (user.handscards[0]!==null)
                var c1 = './images/cards/'+(user.handscards[0].number)+(user.handscards[0].suit)+'.jpg';
            if (user.handscards[1]!==null)
                var c2 = './images/cards/'+(user.handscards[1].number)+(user.handscards[1].suit)+'.jpg';
            if (user.handscards[2]!==null)
                var c3 = './images/cards/'+(user.handscards[2].number)+(user.handscards[2].suit)+'.jpg';
            var s = game.currentRound.fsm.current;
            var uc = [];
            for (i=0; i<3; i++){
                if (user.playedcards[i]==null){
                    uc.push('./images/dorso.jpg');
                }
                else{
                    uc.push('./images/cards/'+(user.playedcards[i].number)+(user.playedcards[i].suit)+'.jpg');
                }
            }
            var rc = [];
            for (i=0; i<3; i++){
                if (rival.playedcards[i]==null){
                    rc.push('./images/dorso.jpg');
                }
                else{
                    rc.push('./images/cards/'+(rival.playedcards[i].number)+(rival.playedcards[i].suit)+'.jpg');
                }
            }
            var turn = (user === r.isTurn());
            res.render('play', {g : game, c1 : c1, c2 : c2, c3 : c3, ps : s, uc : uc, rc : rc, turn:turn, user : user, rival : rival});
        }
    });
});

/*GET resaltadogame page*/
router.get('/resultadogame', function(req,res){
    Game.findOne({_id:req.query.gameid},function(err,game){
        if (err){
            console.log(err);
        }
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
        if (err){
            console.log(err);
        }
        res.render('resultadoround',{g:game});
    });
});

/*POST resultadoround page*/
router.post('/resultadoround', function(req,res){
    Game.findOne({_id:req.body.gameid}, function(err,game){
        if (game.currentRound.fsm.current=='fin'){
            game.newRound();
            Game.update({ _id: game._id }, { $set :{currentRound : game.currentRound , currentHand : game.currentHand }},function (err,result){
                if(err){
                    console.log(err);
                }
                res.redirect('/play?gameid=' + game._id);
            });
        }
        else{
            res.redirect('/play?gameid=' + game._id);
        }
    });
});
module.exports = router;
