var board = new Array();//格子中的数据
var score = 0;//分数数据
// 声明一个新的二维数组记录每个小格子是否已经发生过碰撞
//用来解决一次移动多个数叠加的bug
var hasConflicted = new Array();

//为了实现触控声明点击坐标离开坐标
var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

//页面加载好了之后的动作 ==> 执行newgame函数
$(document).ready(function () {
  newgame();
});

// 定义newgame函数
function newgame() {
  //初始化棋盘格

  inti();
  //在随机的两个格子生成数字

  generateOneNumber();
  generateOneNumber();
}

// 定义初始化棋盘的函数
function inti() {
  for (var i = 0; i < 4; i++)
    for (var j = 0; j < 4; j++) {
      //声明一个变量储存小格子的数据
      //拼出id找到对应内容
      var gridCell = $("#grid-cell-" + i + "-" + j);
      // 给小格子加位置属性
      //用一个新函数用ij的坐标值计算top 与 left值
      gridCell.css('top', getPosTop(i, j) + "rem");
      gridCell.css('left', getPosLeft(i, j) + "rem");
    }
  // 遍历数组 创立二维数组 
  // 初始值设为0
  for (var i = 0; i < 4; i++) {
    board[i] = new Array();
    hasConflicted[i] = new Array();
    for (var j = 0; j < 4; j++) {
      board[i][j] = 0;
      // 将每个小格子的是否碰撞初始设为false
      hasConflicted[i][j] = false;
    }
  }
  //对numbercell的元素进行显示上的设定
  updateBoardView();

  // 初始化分数
  score = 0;
}

function updateBoardView() {
  // 清除原有值
  $('.number-cell').remove();
  for (i = 0; i < 4; i++)
    for (j = 0; j < 4; j++) {
      // 创建新的可移动格子
      $('#grid-container').append('<div class="number-cell" id ="number-cell-' + i + '-' + j + '"></div>')
      var theNumberCell = $('#number-cell-' + i + '-' + j);
      // 判断格子的显示样式
      if (board[i][j] == 0) {
        // 格子的值等于0就不显示 宽高为0 居中
        theNumberCell.css('width', '0');
        theNumberCell.css('height', '0');

        theNumberCell.css('left', getPosLeft(i, j) + ".5rem");
        theNumberCell.css('top', getPosTop(i, j) + ".5rem");
      }
      else {
        // 否则与固定的grid-cell一样位置大小
        theNumberCell.css('width', '1rem');
        theNumberCell.css('height', '1rem');

        theNumberCell.css('left', getPosLeft(i, j) + "rem");
        theNumberCell.css('top', getPosTop(i, j) + "rem");
        // 设置显示出来的格子的背景色
        theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
        // 设置显示出来的格子的字体颜色
        theNumberCell.css('color', getNumberColor(board[i][j]));
        theNumberCell.text(board[i][j]);
        if (board[i][j] >= 1024) {
          theNumberCell.css("font-size", ".4rem");
        }
      }
      //新一轮开始 碰撞便重置为false
      hasConflicted[i][j] = false;
    }
}

//随机的位置生成随机数字
function generateOneNumber() {
  //判断是否存在可以生成数字的位置
  if (nospace(board))
    return false;

  //随机一个位置
  var randomData = new Array();
  var count = 0;
  for (var i = 0; i < 4; i++)
    for (var j = 0; j < 4; j++) {
      if (board[i][j] == 0) {
        randomData[count] = i * 4 + j;
        count++;

      }
    }
  var randomPlace = randomData[parseInt(Math.random() * randomData.length)];
  var randx = parseInt(randomPlace / 4);
  var randy = parseInt(randomPlace % 4);

  //随机一个数字
  var randNumber = Math.random() < 0.5 ? 2 : 4;
  //在随机的位置显示随机的数字
  board[randx][randy] = randNumber;

  // 生成数字时候的动画效果
  showNumberWithAnimation(randx, randy, randNumber);

  return true;
}

//玩家按下按键时进行的操作
//匿名函数通过参数获得具体的按键信息
$(document).keydown(function (event) {
  switch (event.keyCode) {
    case 37://left
      //判断是否能向左移动
      //加一个返回布尔值 ture进入内容;
      event.preventDefault();
      if (moveLeft()) {
        //添加一个新数字
        setTimeout("generateOneNumber()", 210); //让产生一个数延迟进行
        //判断是否结束游戏
        setTimeout("isgameover()", 300);//让判断游戏延迟进行
      }
      break;
    case 38://up
      event.preventDefault();
      if (moveUp()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
      break;
    case 39://right
      event.preventDefault();
      if (moveRight()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
      break;
    case 40://down
      event.preventDefault();
      if (moveDown()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
      break;
    default:
      break;
  }
});

//捕捉起始点坐标 (添加一个监听器)
document.addEventListener('touchstart', function (event) {
  startx = event.touches[0].pageX;
  starty = event.touches[0].pageY;
});

//移动端滑动无反应bug解决
// document.addEventListener('touchmove', function (event) {
//   event.preventDefault();
// });


//捕捉离开点坐标
document.addEventListener('touchend', function (event) {
  endx = event.changedTouches[0].pageX;
  endy = event.changedTouches[0].pageY;

  //结束时进行判断如何进行游戏操作
  var deltax = endx - startx;
  var deltay = endy - starty;

  //解决用户点击也会进行操作的bug
  if (Math.abs(deltax) < 20 && Math.abs(deltay) < 20)
    return;

  //判断移动方向
  //x方向
  if (Math.abs(deltax) >= Math.abs(deltay)) {
    if (deltax > 0) {
      //moveRight
      if (moveRight()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
    }
    else {
      //moveLeft
      if (moveLeft()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
    }
  }
  //y方向
  else {
    if (deltay > 0) {
      //moveDown
      if (moveDown()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
    }
    else {
      //moveUp
      if (moveUp()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
    }
  }
});

//判断游戏是否结束
function isgameover() {
  //没有空位 不能移动
  if (nospace(board) && nomove(board)) {
    gameover();
  }
}


//游戏结束弹出gameover警告框
function gameover() {
  alert("gameover!");
}

function moveLeft() {
  //判断是否能移动
  //board作为游戏数据传入进函数
  if (!canMoveLeft(board)) {
    //不能移动返回false
    return false;
  }
  //能移动进行真正的移动操作并且返回ture
  for (var i = 0; i < 4; i++)
    for (var j = 1; j < 4; j++) {
      if (board[i][j] != 0) {//如果值不等于0才能移动
        for (var k = 0; k < j; k++) {//遍历左边的所有格子
          //找落脚点 ==> 值为0并且之间没有遮挡格子
          if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
            //move进行移动
            showMoveAnimation(i, j, i, k);
            board[i][k] = board[i][j];
            board[i][j] = 0;
            continue;
          } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {//添加一个判断 是否发生过碰撞
            //move进行移动
            showMoveAnimation(i, j, i, k);
            //add产生叠加
            board[i][k] += board[i][j];
            board[i][j] = 0;
            //add score
            score += board[i][k];
            // 得到新的分数 传输给前台
            updateScore(score);

            //发生了碰撞就将值改为true
            hasConflicted[i][k] = true;
            continue;
          }
        }
      }
    }
  //操作完成只是逻辑数据改变 需要对整体数据进行刷新
  setTimeout("updateBoardView()", 200);
  return true;
}

function moveUp() {
  if (!canMoveUp(board)) {
    return false;
  }
  for (var i = 1; i < 4; i++)
    for (var j = 0; j < 4; j++) {
      if (board[i][j] != 0) {
        for (var k = 0; k < i; k++) {
          if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
            showMoveAnimation(i, j, k, j);
            board[k][j] = board[i][j];
            board[i][j] = 0;
            continue;
          } else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]) {
            showMoveAnimation(i, j, k, j);
            board[k][j] += board[i][j];
            board[i][j] = 0;
            score += board[k][j];
            updateScore(score);
            hasConflicted[k][j] = true;
            continue;
          }
        }
      }
    }
  setTimeout("updateBoardView()", 200);
  return true
}

function moveRight() {
  if (!canMoveRight(board)) {
    return false;
  }
  for (var i = 0; i < 4; i++)
    for (var j = 2; j >= 0; j--) {
      if (board[i][j] != 0) {
        for (var k = 3; k > j; k--) {
          if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
            showMoveAnimation(i, j, i, k);
            board[i][k] = board[i][j];
            board[i][j] = 0;
            continue;
          } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {
            showMoveAnimation(i, j, i, k);
            board[i][k] += board[i][j];
            board[i][j] = 0;
            score += board[i][k];
            updateScore(score);
            hasConflicted[i][k] = true;
            continue;
          }
        }
      }
    }
  setTimeout("updateBoardView()", 200);
  return true;
}

function moveDown() {
  if (!canMoveDown(board)) {
    return false;
  }
  for (var i = 2; i >= 0; i--)
    for (var j = 0; j < 4; j++) {
      if (board[i][j] != 0) {
        for (var k = 3; k > i; k--) {
          if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
            showMoveAnimation(i, j, k, j);
            board[k][j] = board[i][j];
            board[i][j] = 0;
            continue;
          } else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !hasConflicted[i][k]) {
            showMoveAnimation(i, j, k, j);
            board[k][j] += board[i][j];
            board[i][j] = 0;
            score += board[k][j];
            updateScore(score);
            hasConflicted[k][j] = true;
            continue;
          }
        }
      }
    }
  setTimeout("updateBoardView()", 200);
  return true;
}