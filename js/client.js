(function($){
	var socket = io.connect('http://localhost:1337');
	var msgtemplate = $('#msgtemplate').html();
	$('#msgtemplate').remove();

	$('#loginform').submit(function(event){
		event.preventDefault();
		socket.emit('login', {
			username : $('#username').val(),
			mail : $('#mail').val()
		});
	});

	/*  Login  */
	socket.on('loginerror', function(){
		$('#loginerror').text("Veuillez entrez un pseudo et une adresse mail");
	})

	socket.on('logged', function(){
		$('#login').fadeOut();
		$('#message').focus();
	});


	/*  messages sending */
	$('#form').submit(function(event){
		event.preventDefault();
		socket.emit('newMsg', {message: $('#message').val()});
		$('#message').val('');
		$('#message').focus();
	});

	socket.on('newMsg', function(message){
		$('#messages').append('<div class="message">' + Mustache.render(msgtemplate, message) + '</div>');
	});

	/* Users in and out gestion */
	socket.on('newuser', function(user){
		$('#users').append('<img src="' + user.avatar + '" title="' + user.username + '" id="' + user.id + '">');
	});

	socket.on('userOut', function(user){
		$('#' + user.id).remove();
	});

})(jQuery);