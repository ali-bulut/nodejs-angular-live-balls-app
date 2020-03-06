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

    function scrollTop() {
        setTimeout(() => {
            const element=document.getElementById('chat-area');
            element.scrollTop=element.scrollHeight;
        });
    }

    function showBubble(id, message){
        $('#'+id).find('.message').show().html(message);

        setTimeout(() => {
            $('#'+id).find('.message').hide()
        }, 2000);
    }

    async function initSocket(username) {

        const connectionOptions={
            reconnectionAttempts:3,
            reconnectionDelay:600
        }
        try{
        const socket = await indexFactory.connectSocket('http://localhost:3000', connectionOptions);
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
                scrollTop();
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

                scrollTop();

                $scope.messages.push(messageData);
                delete $scope.players[data.id]
                $scope.$apply();
            })

            socket.on('animate', data=>{
                $('#'+data.socketId).animate({'left': data.x, 'top': data.y}, ()=>{
                })
            })

            socket.on('newMessage',data=>{
                $scope.messages.push(data);
                $scope.$apply();
                showBubble(data.socketId, data.text)
                scrollTop();
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

            $scope.newMessage=()=>{
                let message=$scope.message;
                const messageData={
                    type:{
                        code:1 // info 0-> sistem tarafından oluşturulan mesajlar 1-> kullanıcı mesajlarıı
                    }, 
                    //initsocket'in parametresi username
                    username:username,
                    text:message
                }
                $scope.messages.push(messageData);
                $scope.message='';

                socket.emit('newMessage', messageData)
                showBubble(socket.id, message);
                scrollTop();
            }
        } 
        catch(err){
            console.log(err);
        }
    }

    
})