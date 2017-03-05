var mqtt = require('mqtt');

var client = mqtt.connect({
	host : '188.166.184.34',
	port : 6969,
	username : 'pipeeroac05c207b',
	password : '5738921e589fcb114312db62'
});

function publishToMQTT(message){
	var User = Parse.Object.extend("Conversation");
	var query = new Parse.Query(User);

	query.equalTo("objectId", message.get('conversationId'));
	query.find({
		success: function(results) {
			var payload = {
				content : message.get('content'),
				author : message.get('author'),
				members : results[0].get('members'),
				timestamp : message.get('createdAt')
			};
			client.publish('listen/message/rest-api', JSON.stringify(payload));
		},
		error: function(error) {
			console.log(error);
		}
	});
}

Parse.Cloud.afterSave("Message", function(request) {
	var message = request.object;

	publishToMQTT(message);

	var Conversation = Parse.Object.extend("Conversation");
	var query = new Conversation;

	query.id = message.get('conversationId');
	query.set('lastMessage', message.get('content'));

	query.save(null, {
		success: function(data) {
		}
	});

});
