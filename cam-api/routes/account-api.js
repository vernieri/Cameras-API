var express = require('express');
var router = express.Router();
var seneca = require('seneca')()
var mongojs = require('mongojs');

//PUT YOUR MONGOLAB HERE + DB + COLLECTION
var db = mongojs('YOUR MONGO LINK HERE/DB', ['COLLECTION']);


// All Accounts
router.get('/accounts', function(req, res, next){
	db.accounts.find(function(err, account){
		if(err){
			res.send(err);
		}
		res.json(account);
	});
});

//Single Account
router.get('/account/:id', function(req, res, next){
	db.accounts.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, account){
		if(err){
			res.send(err);
		}
		res.json(account);
	});
});

//Save Account
router.post('/account', function(req, res, next){
	var account = req.body;
	if(account.name == '' && account.email == '' && account.company !== 0 && account.office !== 0 && account.admin !== 0){
		res.status(400);
		res.json({"error" : "Bad data"});
	}
	else{
		db.accounts.save(account, function(err, account){
			if(err){
				res.send(err);
			}
			res.json(account);			
		});
	}

});

//Delete Account
router.delete('/account/:id', function(req, res, next){
	db.accounts.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, account){
		if(err){
			res.send(err);
		}
		res.json(account);
	});
});


//Update
router.put('/account/:id', function(req, res, next){
	var account = req.body;
	var updAccount = {};

	if(account.name){
		updAccount.name = account.name;
	}

	if(account.email){
		updAccount.email = account.email;
	}
	
	if(account.company){
		updAccount.company = account.company;


	}	
	if(account.office){
		updAccount.office = account.office;


	}		
	if(account.admin){
		updAccount.admin = account.admin;


	}		

	if(!updAccount){
		res.status(400);
		res.json({
			"error" : "Bad Data"
		});
	}
	else{
		db.accounts.update({_id: mongojs.ObjectId(req.params.id)},updAccount, {}, function(err, account){
			if(err){
				res.send(err);
			}
			res.json(account);
		});		
	}

});


module.exports = router

