var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('YOUR MONGO HERE/DB', ['COLLECTION']);


// all cam
router.get('/cams', function(req, res, next){
	db.cams.find(function(err, cams){
		if(err){
			res.send(err);
		}
		res.json(cams);
	});
});

//Single Cams
router.get('/cam/:id', function(req, res, next){
	db.cams.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, cam){
		if(err){
			res.send(err);
		}
		res.json(cam);
	});
});

//Save cam
router.post('/cam', function(req, res, next){
	var cam = req.body;
	if(cam.cameraType == '' && cam.isUp == '' && cam.owner == ''){
		res.status(400);
		res.json({"error" : "Bad data"});
	}
	else{
		db.cams.save(cam, function(err, cam){
			if(err){
				res.send(err);
			}
			res.json(cam);			
		});
	}

});

//Delete cam
router.delete('/cam/:id', function(req, res, next){
	db.cams.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, cam){
		if(err){
			res.send(err);
		}
		res.json(cam);
	});
});


//Update
router.put('/cam/:id', function(req, res, next){
	var cam = req.body;
	var updCam = {};

	if(cam.cameraType){
		updCam.cameraType = cam.cameraType;
	}

	if(cam.owner){
		updCam.owner = cam.owner;
	}
	
	if(cam.isUp){
		updCam.isUp = cam.isUp;


	}	

	if(!updCam){
		res.status(400);
		res.json({
			"error" : "Bad Data"
		});
	}
	else{
		db.cams.update({_id: mongojs.ObjectId(req.params.id)},updCam, {}, function(err, cam){
			if(err){
				res.send(err);
			}
			res.json(cam);
		});		
	}

});


module.exports = router

