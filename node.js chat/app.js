var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	users={};
	
	server.listen(3000);
	
	app.get('/',function(req,res){
		res.sendfile(__dirname +'/index.html');
		
		
	}    );
	
	io.sockets.on('connection',function(socket){
		socket.on('new user',function(data, callback){
			var aa=data+"[Offline]";
			//console.log(a);
			if(data in users){
				callback(false);
			}else{
				callback(true);
				socket.nickname = data;
				users[socket.nickname]=socket;
				
				
				updateNicknames();
			}
			if(aa in users){
				delete users[aa];
				updateNicknames();
			}
			
		});
		
		function updateNicknames(){
			
			io.sockets.emit('usernames',Object.keys(users));
			console.log("refresh");
			
		};
		
		function ofline(aaa){
			
			socket.nickname = aaa;
				users[socket.nickname]=socket;
			updateNicknames();
		};
		
		socket.on('send message',function(data, callback){
			var msg = data.trim();
			
			
			if(msg.substr(0,3) === '/w '){
				msg=msg.substr(3);
				var ind= msg.indexOf(' ');
				if(ind !== -1){
					var name= msg.substring(0,ind);
					var msg= msg.substring(ind + 1);
					if(name in users){
						
						
					
					users[name].emit('whisper',{msg: msg, nick: socket.nickname});
					//users[socket.nickname].emit('whisper',{msg: msg, nick: socket.nickname});
					console.log('Whisper!');

						
					}else{
						callback('Online bir kullanıcı girin!')
						
					}
					
				}
				else{
					callback('Özel mesaj icin mesajı giriniz!')
					
				}
					
			}else if(msg.substr(0,2) === 'a '){
				msg=msg.substr(2);
				var ind= msg.indexOf(' ');
				if(ind !== -1){
					var name= msg.substring(0,ind);
					var msg= msg.substring(ind + 1);
					if(name in users){
						
						
					
					users[name].emit('a',{msg: msg, nick: socket.nickname});
					//users[socket.nickname].emit('whisper',{msg: msg, nick: socket.nickname});
					console.log('a!');

						
					}else{
						callback('Online bir kullanıcı girin!')
						
					}
					
				}
				else{
					callback('Özel mesaj icin mesajı giriniz!')
					
				}
				
				
			}
			else{
				io.sockets.emit('new message',{msg: msg, nick: socket.nickname});
				
			}
			
		});
		socket.on('disconnect',function(data){
			if(!socket.nickname) return;
			var aaaa=socket.nickname+"[Offline]";
			delete users[socket.nickname];
			console.log(aaaa);
			ofline(aaaa);
		
			updateNicknames();
			
			
			
		});
	
			
			
		
		function güncelle(){
			
			io.sockets.emit('usernames',Object.keys(users));
			console.log("15 saniye güncellemesi");
			 
		};
		setInterval(güncelle,15000);
		
		
		
		
	});