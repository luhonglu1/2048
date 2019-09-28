function showNumberWithAnimation(i, j, randNumber) {

  // 借用numberCell元素
  var numberCell = $('#number-cell-' + i + "-" + j);

  numberCell.css('background-color', getNumberBackgroundColor(randNumber));
  numberCell.css('color', getNumberColor(randNumber));
  numberCell.text(randNumber);

  numberCell.animate({
    width: "1rem",
    height: "1rem",
    top: getPosTop(i, j) + "rem",
    left: getPosLeft(i, j) + "rem"
  }, 0);
}

function showMoveAnimation(fromx, fromy, tox, toy) {
  // 借用numberCell元素  
  var numberCell = $('#number-cell-' + fromx + '-' + fromy);
  // 用jQuery的animate函数
  numberCell.animate({
    top: getPosTop(tox, toy) + "rem",
    left: getPosLeft(tox, toy) + "rem"
  }, 200);
}

function updateScore(score) {
  $('#score').text(score);
}

