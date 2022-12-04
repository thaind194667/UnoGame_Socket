// // var socket = io();
// // socket.emit('connection');
// // socket.on('chat message', function(msg){
// //   let messages = document.getElementById('messages');
// //   // let newText = document.createElement('li');
// //   // li.appendChild(document.createTextNode(msg));
// //   // messages.appendChild(newText);
// //   messages.innerHTML += `<li>${msg}</li>`;
// // });

// socket.on('startGame', function(){
//   // game = new Game('game1',2);
// });

// $(document).ready(function () {

    
  
//   $('form').submit(function(){
//     socket.emit('chat message', $('#m').val());
//     $('#m').val('');
//     return false;
//   });

//   $('#start').click(function(){
//     // console.log('someone clicked');
//     // var game = new Game("game1", 2);
//     // const Game = require('../class/game.js');
//     // game = new Game('game1',2);
//     // console.log(game.getId());
//     socket.emit('start');
//     return false;
//   });
    

//   // let game = new Game("game1", 2);
//   // $("#start").click(function() {
//   //     $.ajax({
//   //         type: "get",
//   //         url: "./uno_server.js",
//   //         async: false,
//   //         data: { Game: game },
//   //         success: function(data) {
//   //             // $("#play").html(data);
//   //             // location = "#play";
//   //             }
//   //     });
//   // });

//   // loadPlayer1();
//   // loadPlayer2();

//   $("#sort").click(function(){    // sort card
//       $.ajax({
//           type: "get",
//           url: gameType + ".php",
//           async: false,
//           data: { playerNum: x },
//           success: function(data) {
//               $("#play").html(data);
//               location = "#play";
//               }
//       });
//   });


//   $("#Reset").click(function(){   // reset game
//       location.reload();
//   });

//   var check = 0;
//   var cardNum;

//   $(document).on('click', '.cardImg', function(){ // super click handle
//       thisCard = $(this).attr("id");
//       if(check == 0) {
//           check = 1;
//           cardNum = thisCard;
//           $("#"+thisCard).animate({ opacity: 0.9, bottom: "+=30%"}, 500);
//           $("#Hit").show();
//       }
//       else {
//           $("#"+cardNum).animate({ opacity: 1, bottom: "-=30%"}, 300);
//           if(thisCard != cardNum) {
//               cardNum = thisCard;
//               $("#Hit").show();
//               $("#"+thisCard).animate({ opacity: 0.9, bottom: "+=30%"}, 500);
//           }
//           else {
//               check = 0;
//               $("#Hit").hide();
//           }
//       }
//   });
  
//   $("#Hit").click(function() {        // hit the card
//       $.ajax({
//           type: "post",
//           url: "process.php",
//           async: false,
//           dataType: "html",
//           data : {
//               game: "uno",
//               command: "hit",
//               card: cardNum.charAt(0)
//           }, success: function(data) {
//               var string = data.replace(/[\r\n]/gm, '');
//               alert(string);
//               let array = string.split(" ");
//               let res = array[0];
//               let url = array[1];
//               let color = array[2];
//               if(res == '0') {
//                   $("#hitFail").show();
//                   $("#hitFail").delay(1000).fadeOut(400);
//               }
//               else {
//                   let link = "unoCard/" + url + ".png";
//                   $("#currentCard").attr("src", link);
//                   $("#currentPlay").css("background-color", color);
//                   $("#"+cardNum).remove();
//                   $("#Hit").hide();
//                   var count = 0;
//                   $('.cardImg').each(function() {
//                       this.setAttribute("id", count);
//                       count++;
//                   });
//                   // var ele = document.getElementById('playerdeck');
//                   // var length =  $('.cardImg').length;
//                   alert(count);
//                   $('.cardImg').css("margin-right", "-" + count + "%");
//                   // $("#" + cardNum).css("bottom", "-=30%");
//                   // $("#" + cardNum).css("opacity", 1);
//                   check = 0;
                  
//                   if(res == '2') {
//                       $("#colorChoose").show();
//                   }
//               }
//           }
//       });
//   });


//   $(".color").click(function() {  // change color
//       $.ajax({
//           type: "post",
//           url: "process.php",
//           async: false, 
//           data: {
//               color: $(this).attr("id"),
//               command: "changeColor", 
//               game: "uno"
//           }, success : function(data) {
//               $("#currentPlay").css("background-color", data);
//               alert(data);
//               $("#colorChoose").hide();
//           }
//       });
//   });


//   $("#Draw").click(function() {
//       $.ajax({
//           type: "post",
//           url: "process.php",
//           async: false,
//           data: {
//               game: "uno",
//               command: "draw"
//           }, success : function(data) {
//               var max = 0;
//               $('.cardImg').each(function() {
//                   max = Math.max(this.id, max);
//               });
//               let newImg = document.createElement("img");
//               ele = document.getElementById("0");
//               newImg.setAttribute("class", "cardImg");
//               src = `unoCard/` + data + `.png`;
//               newImg.setAttribute("src", src.replace(/[\r\n]/gm, ''));
//               newImg.setAttribute("id", max + 1);
//               // newImg.css("margin-right", ele.css("margin-right"));

//               /*  // copy all style from ele to another element (newImg)
//               ele = document.getElementById("0");
//               styles = getComputedStyle(ele);
//               let cssText = styles.cssText;
//               if (!cssText) {
//                 cssText = Array.from(styles).reduce((str, property) => {
//                   return `${str}${property}:${styles.getPropertyValue(property)};`;
//                 }, '');
//               }
//               newImg.style.cssText = cssText;  // 👇️ Assign css styles to element
//               */
//               $(newImg).insertAfter("#" + max);
//               alert(data);
//           }
//       });
//   });


// });

$('#backMenu').click(function(){
    
    $('#menu').show();
    $('#play').hide();
});