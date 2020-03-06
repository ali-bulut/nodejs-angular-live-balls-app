app.controller('indexController', ($scope, indexFactory) =>{
    //$scope'tan sonraki kısım view kısmında kullanacağımız function'ın adını belirler.

    $scope.messages=[]
    $scope.players={};

    $scope.init=() => {
        const username=prompt('Please enter the username');

        if(username)
            initSocket(username);
        else
            return false;
    }

    function initSocket(username) {

        const connectionOptions={
            reconnectionAttempts:3,
            reconnectionDelay:600
        }
        indexFactory.connectSocket('http://localhost:3000', connectionOptions)
        .then((socket)=>{
            socket.emit('newUser', {username:username});

            socket.on('initPlayers', (players) => {
                $scope.players=players;
                $scope.$apply();
            })

            socket.on('newUser', (data)=>{
                const messageData={
                    type:{
                        code:0, // info 0-> sistem tarafından oluşturulan mesajlar 1-> kullanıcı mesajlarıı
                        message:1 // 1-> katıldı 0-> ayrıldı
                    }, 
                    username:data.username,
                }
                $scope.messages.push(messageData);
                $scope.players[data.id]=data;
                //push gibi DOM eventleri kullandığımız için apply methodunu çalıştırmalıyız ki angular'ın
                //haberi olsun
                $scope.$apply();
            })

            socket.on('disUser', (data)=>{
                const messageData={
                    type:{
                        code:0, // info 0-> sistem tarafından oluşturulan mesajlar 1-> kullanıcı mesajlarıı
                        message:0 // 1-> katıldı 0-> ayrıldı
                    }, 
                    username:data.username,
                }

                $scope.messages.push(messageData);
                delete $scope.players[data.id]
                $scope.$apply();
            })

            socket.on('animate', data=>{
                $('#'+data.socketId).animate({'left': data.x, 'top': data.y}, ()=>{
                })
            })

            let animate=false;
            $scope.onClickPlayer=($event) =>{
                if(!animate){
                    let x=$event.offsetX;
                    let y=$event.offsetY;
                    socket.emit('animate', {x:x,y:y})
                    animate=true;
                  $('#'+socket.id).animate({'left': x, 'top': y}, ()=>{
                      //animate bittiği anda false olacağını tanımladık.
                      animate=false;
                  })
                }
            }

        }).catch((err) => {
            console.log(err);
        })

    }

    
})