
var socket = io();
let roomId;
let Players = [];
let myPos;
let creator;
let myUsername;
let cardNum = 0;
let turn;

let check = 0;
let cardIndex;


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////// Functions ///////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function resetMenu() {

  $('#joinChoose').show();
  $('#joinRoom').hide();
  $('#createChoose').show();
  $('#createRoom').hide();
  $('#menu').hide();
  $('#newRoomId').val('');
  $('#joinRoomId').val('');

}

function printRoomin4() {
  $('#roomIn4').html(`Room ${roomId}`);
}

function codeGenerate() {
  const length = 8;
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function loadPlayerList(data) {
  myPos = data.pos;
  // alert(myPos);
  playerNum = 1;
  let pList = data.players;
  // alert(JSON.stringify(pList));
  let index = 2;
  Players[myPos] = { pos: 1, name: myUsername };
  let p = myPos + 1;
  while (p != myPos) {
    Players[p] = { pos: index, name: "" };
    if (pList[p] != null) {
      // alert(p + " " + index);
      $(`#p${index}Wait`).hide();
      $(`#p${index}Hand, #p${index}Avatar`).show();
      Players[p].name = pList[p];
      $(`#p${index}Avatar`).html(Players[p].name);
      playerNum++;
    }
    index++;
    p++;
    if (p > 8) p = 1;
  }
  // alert(JSON.parse(JSON.stringify(Players)));

  $('#playerAvatar').html(myUsername);
}

function updatePlayerList(data) {
  let pos = data.pos;
  if (data.msg == "leave") {

    // alert(`${pos} left`);
    Players[pos].name = null;
    let P = Players[pos].pos;

    $(`#p${P}Wait`).show();
    $(`#p${P}Hand, #p${P}Avatar`).hide();
    playerNum--;
  }
  else {
    Players[pos].name = data.name;
    // alert(`${data.name} in position ${pos} joined`);
    let P = Players[pos].pos;

    $(`#p${P}Wait`).hide();
    $(`#p${P}Hand, #p${P}Avatar`).show();
    $(`#p${P}Avatar`).html(Players[pos].name);
    playerNum++;
  }
}

function drawCard(url) {
  let newImg = document.createElement("img");
  newImg.setAttribute("class", "cardImg");
  newImg.setAttribute("src", url.replace(/[\r\n]/gm, ''));
  newImg.setAttribute("id", cardNum + 1);
  $(newImg).insertAfter('#' + cardNum);
  cardNum++;
  $('.cardImg').css("margin-right", "-" + cardNum + "%");
}

function sendtoServer(message, data) {
  socket.emit(message, data);
}

function highlightPlayer(i) {
  unhighlightPlayer();
  $(`#player${i}`).css('border', 'solid 0.3vh red');
}

function unhighlightPlayer() {
  $(`#player${turn}`).css('border', 'solid 0.1vh');
}

function checkServer() {
  // setInterval(async function(){  }, 10000);
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////// Socket  /////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let Res;

socket.onAny(function(event, data) {

  switch (event) {
    case 'reconnect': {
      $('#stopped').hide();
      break;
    }

    case 'createFail': {
      $('#createFail').show();
      $('#createFail').delay(1000).fadeOut(400);
      break;
    }
    case 'createDone': {
      resetMenu();
      $('#unoPlay').show();
      printRoomin4();
      creator = 1;
      loadPlayerList(data);
      $('#startGame').show();
      break;
    }

    case 'joinFail': {
      $('#joinFail').show();
      $('#joinFail').delay(1000).fadeOut(400);
      break
    }
    case 'joinDone': {
      resetMenu();
      $('#unoPlay').show();
      printRoomin4();
      creator = 0;
      loadPlayerList(data);
      $('#readyGame').show();
      break;
    }

  }

});

// socket.on('reconnect', function() {
//   $('#stopped').hide();
// });

// socket.on('createFail', function() {
//   $('#createFail').show();
//   $('#createFail').delay(1000).fadeOut(400);
// });
// socket.on('createDone', function(data) {
//   resetMenu();
//   $('#unoPlay').show();
//   printRoomin4();
//   loadPlayerList(data);

//   creator = 1;
//   $('#startGame').show();
// });

// socket.on('joinFail', function() {
//   $('#joinFail').show();
//   $('#joinFail').delay(1000).fadeOut(400);
// });
// socket.on('joinDone', function(data) {
//   resetMenu();
//   $('#unoPlay').show();
//   printRoomin4();
//   loadPlayerList(data);

//   creator = 0;
//   $('#readyGame').show();
// });

socket.on('change', function(data) {

  // alert(`${myPos}`);

  updatePlayerList(data);

});

socket.on('server-chat', function(msg) {
  // alert(msg);
  let messages = document.getElementById('messages');
  messages.innerHTML += `<li>${msg}</li>`;
});

socket.on('begin', function(data) {
  $('#readyGame').hide();
  let deck = data;
  let all = "";
  // let max = 0;
  for (let i = 0; i < deck.length; i++) {
    let url = "./img/" + deck[i] + ".png";
    drawCard(url);
    all += deck[i];
  }
  $('#0').hide();
  // alert(all);
});

socket.on("state", function(data) {
  let c_url = data.currentCard;
  let c_color = data.color;
  // alert(c_url + c_color);
  $('#frontDeck').show();
  $('#currentCard').attr("src", `./img/${c_url}.png`);
  $("#currentPlay").css("background-color", c_color);
  if (data.turn == myPos) {
    $('#yourTurn').show();
    $('#yourTurn').delay(800).fadeOut(300);
    unhighlightPlayer();
    turn = 1;
  }
  else {
    let i = Players[data.turn].pos;
    // alert(i);
    highlightPlayer(i);
    turn = i;
    $('#Hit').prop('disabled', true);
    $('#Pass').prop('disabled', true);
  }
});

socket.on('ready', function(pos) {
  if (pos == myPos) return;
  let i = myPos;
  let count = 1;
  while (i != pos) {
    i++;
    count++;
    if (i > 8) i = 1;
    // pos--;
  }
  $(`#p${count}State`).show();
  State[count] = 1;
});

socket.on('not ready', function(pos) {
  if (pos == myPos) return;
  let i = myPos;
  let count = 1;
  while (i != pos) {
    i++;
    count++;
    if (i > 8) i = 1;
    // pos--;
  }
  $(`#p${count}State`).hide();
  State[count] = 0;
});

socket.on('hitDone', function(data) {
  let pos = data.pos;
  let card = data.cardid;
  let msg = data.msg;
  if (pos == myPos) {
    $("#" + card).remove();
    // $("#Hit").hide();
    $('#Hit').prop('disabled', true);
    var count = -1;
    $('.cardImg').each(function() {
      count++;
      this.setAttribute("id", count);
      // count++;
    });
    cardNum = count;
    // var ele = document.getElementById('playerdeck');
    // var length =  $('.cardImg').length;
    // alert(count + "cards");
    $('.cardImg').css("margin-right", "-" + count + "%");
    check = 0;
    if (msg == "colorChoose" && turn == 1) {
      $('#colorChoose').show();
    }
  }
});

socket.on('hitFail', function() {

  $('#hitFail').show();
  $('#hitFail').delay(1000).fadeOut(400);
});

socket.on('Draw', function(data) {
  let pos = data.pos;
  if (pos == myPos) {
    let Cards = data.Cards;
    // alert("cards" + Cards);
    for (let i = 0; i < Cards.length; i++) {
      let url = "./img/" + Cards[i] + ".png";
      drawCard(url);
    }
    // alert(`Draw ${data.stack}`);
    $('#Pass').prop('disabled', false);
  }
  else {
    // let stack = data.stack;
    // alert(`${Players[pos].name} draws ${data.stack} cards`);

  }
});

socket.on('Win', function(data) {
  let pos = data.pos;
  let msg;
  if (pos == myPos) msg = "You win!";
  else msg = `${Players[pos].name} wins!`;
  // alert(`${Players[pos].name } wins!`);
  // alert(msg);
  $('#notification').text(msg);
  $('#newGame').show();

});




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////// DOM , Jquery /////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


$(document).ready(function() {

  $('#confirmName').click(function() {
    const name = $('#Name').val();
    if (!$.trim($('#Name').val()).length) {
      alert("Please input your name, player!");
      $('#Name').val('');
    }
    else {

      $('#Begin').hide();
      myUsername = name;
      sendtoServer('joinServer', name);
    }
  });

  $('#readyGame').click(function() {
    if (this.innerHTML == 'Ready') {
      this.innerHTML = 'Cancel';
      sendtoServer('Ready');
    }
    else {
      this.innerHTML = 'Ready';
      sendtoServer('Not ready');
    }
  });

  $('#startGame').click(function() {
    // if(playerNum == 1) {
    //   alert("Waiting for other players ...");
    // }
    // else {
    $('#startGame').hide();
    sendtoServer('startGame');
    // }
  });

  $('#createChoose').click(function() {
    $(this).hide();
    $('#createRoom').show();
    $('#joinChoose').show();
    $('#joinRoom').hide();
  });

  $('#joinChoose').click(function() {
    $(this).hide();
    $('#joinRoom').show();
    $('#createChoose').show();
    $('#createRoom').hide();
  });

  $('#confirmCreate').click(function() {   // (a, b)=> same with function(a, b)
    roomId = $('#newRoomId').val();
    if (roomId == '') {
      roomId = codeGenerate();
    }
    sendtoServer('create room', roomId);

  });

  $('#confirmJoin').click(function() {
    roomId = $('#joinRoomId').val();
    sendtoServer('join room', roomId);
  });

  $('#backMenu').click(function() {
    resetMenu();
    $('#menu').show();
    $('#unoPlay').hide();
    sendtoServer('leave room');
  });

  $('#restart').click(function() {
    $('#newGame').hide();
    if(creator == 0) $('#readyGame').show();
    else $('#startGame').show();
    $('$frontDeck').hide();
    while(cardNum > 0) {
      $('#'+cardNum).remove();
      cardNum--;
    }
    $('#0').show();
  });

  // $('#back').click(function() {
  //   resetMenu();
  //   $('#menu').show();
  // });

  $('form').submit(function() {
    sendtoServer('user-chat', $('#m').val());
    $('#m').val('');
    return false;
  });

  $(document).on('click', '.cardImg', function() { // super on click handle
    thisCard = $(this).attr("id");
    if (check == 0) {
      check = 1;
      cardIndex = thisCard;
      $("#" + thisCard).animate({ opacity: 0.9, bottom: "+=30%" }, 500);
      if (turn == 1) $('#Hit').prop('disabled', false);
    }
    else {
      $("#" + cardIndex).animate({ opacity: 1, bottom: "-=30%" }, 300);
      if (thisCard != cardIndex) {
        cardIndex = thisCard;
        $("#" + thisCard).animate({ opacity: 0.9, bottom: "+=30%" }, 500);
        if (turn == 1) $('#Hit').prop('disabled', false);

      }
      else {
        check = 0;
        $('#Hit').prop('disabled', true);
      }
    }
  });

  $('#Hit').click(function() {
    const data = { pos: myPos, cardid: cardIndex };
    sendtoServer("Hit", data);
  });

  $(".color").click(function() {  // change color
    let color = $(this).attr("id");
    sendtoServer("colorChange", color);
    $('#colorChoose').hide();
  });

  $('#Draw').click(function() {
    if(turn == 1)
      sendtoServer('Draw', myPos);
  });

  $('#Pass').click(function() {
    sendtoServer('Pass');
  });

});