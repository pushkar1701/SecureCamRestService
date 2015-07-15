var gcm = require('node-gcm'),
	express = require('express'),
	bodyParser = require('body-parser'),
	MongoClient = require('mongodb').MongoClient;
//	mongoose = require('mongoose');
	

var app = express();

var port = process.env.PORT || 3000;

/*app.use(bodyParser.json);
app.use(bodyParser.urlencoded({extended : true}));
*/
var message = new gcm.Message();
var sender = new gcm.Sender('AIzaSyB1e8xoiARKt6m7wgQVHQmTyk4zAtBCJUY');

var registrationIds = [];

// Value the payload data to send...
message.addData('message',"\u270C Peace, Love \u2764 and PhoneGap \u2706!");
message.addData('title','Push Notification Sample' );
message.addData('msgcnt','3'); // Shows up in the notification in the status bar
message.addData('soundname','beep.wav'); //Sound to play upon notification receipt - put in the www folder in app
//message.collapseKey = 'demo';
//message.delayWhileIdle = true; //Default is false
message.timeToLive = 3000;// Duration in seconds to hold in GCM and retry before timing out. Default 4 weeks (2,419,200 seconds) if not specified.
 
// At least one reg id required

var pushRouter = express.Router();
app.use('/pushApi', pushRouter);

pushRouter.route('/sendPushNotify') ///?regId/?emailId
	
	.get(function(req, res){
		sender.send(message, registrationIds, 4, function (result) {
		registrationIds.push('APA91bH6pDsA5Wsyzy1SNtwj9_WUNijotWZdn3V2kFocMuYD0uiI5kRMOzuggx2HqdG1AiAwAwJsa086runPPyn8Hm11yB9DL7K4L1dHX16EOozTZHa5hKfrgiyg1IWoJWvTKJcKF6G6AyxGomDO4j5Xd_1wE-8eDrxLv4VoBOl9FOWnFkJAOkw');
    	res.json(result);
		});
	});

	pushRouter.route('/sendPushData/:regId?/:emailId?')

	.post(function(req,res){

		var regId = req.params.regId;
		var emailId = req.params.emailId;

		MongoClient.connect('mongodb://securecamuser:securecampassword@ds043962.mongolab.com:43962/securecampushdb', function(err, db){
		if (err) throw err;

		db.collection('pushData').insert({"regId" : regId , "uniqId" : emailId}, function(err, doc){
				//res.json(doc);
				console.dir(doc);

				db.close();
			});

			res.json("called Method yay");
			//console.dir("called Method yay");

		})
	})


pushRouter.route('/emptyCollection') ///?regId/?emailId
	.post(function(req, res){

		MongoClient.connect('mongodb://securecamuser:securecampassword@ds043962.mongolab.com:43962/securecampushdb', function(err, db){
		if (err) throw err;

		db.collection('pushData').remove({});
		res.json("called Method yay");
		//console.dir("called Method yay");

		}) 
	});


pushRouter.route('/:name?') ///?regId/?emailId
	.post(function(req, res){
		var name = req.params.name;
		res.json("Hello " + name); 
	});

pushRouter.route('/') ///?regId/?emailId
	.get(function(req, res){
		
		res.json("working"); 
	});



app.listen(port, function(){
	console.log('Listening');
});