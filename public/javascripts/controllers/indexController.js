app.controller('indexController', ($scope, indexFactory) =>{
    //$scope'tan sonraki kısım view kısmında kullanacağımız function'ın adını belirler.

    $scope.messages=[]


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

            socket.on('newUser', (data)=>{
                const messageData={
                    type:0, // info (sadece sistem tarafından oluşturulan giriş çıkış mesajları)
                    username:data.username
                }
                $scope.messages.push(messageData);

                //push gibi DOM eventleri kullandığımız için apply methodunu çalıştırmalıyız ki angular'ın
                //haberi olsun
                $scope.$apply();
            })
        }).catch((err) => {
            console.log(err);
        })

    }

    
})