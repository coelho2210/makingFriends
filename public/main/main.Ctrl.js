(function () {
  'use strict';

  angular
    .module('app')
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', '$localStorage', 'socket', 'lodash'];

  function MainCtrl($scope, $localStorage, socket, lodash) {
    $scope.message ='';
    $scope.messages = [];
    $scope.users = [];

    $scope.mynickname = $localStorage.nickname;
    var nickname = $scope.mynickname;


  socket.on('show-message', function(data){
    console.log(data);
  });

  socket.emit('get-users');

    socket.emit('get-users');

     socket.on('all-users', function (data) {
      console.log(data);
      $scope.users = data.filter(function (item) {
        return item.nickname !== nickname;
      });
    });

    socket.on('message-recieved', function(data){
      $scope.messages.push(data);
    })


    $scope.sendMessage = function(date){
      var newMessage = {
        message: $scope.message,
        from: $scope.mynickname
      }
      socket.emit('send-message', newMessage);
      $scope.message = '';
      $scope.messages.push(newMessage);
    }


  };
})();