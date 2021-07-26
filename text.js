const textBoxes = [];
let currentBox = null;
var canvas = null;
var ctx = null;
let i = 0;
let x = 0;
let y = 0;


//These next 4 lines are for limiting the frame rate.
const FRAMES_PER_SECOND = 30;  // Valid values are 60,30,20,15,10...
// set the mim time to render the next frame
const FRAME_MIN_TIME = (1000/60) * (60 / FRAMES_PER_SECOND) - (1000/60) * 0.5;
var lastFrameTime = 0;  // the last frame time

function $(id) {
  return document.getElementById(id);
}

//runs as soon as the body of the page loads.
function canvasLoad() {
  canvas = document.querySelector("canvas");
  ctx = canvas.getContext("2d");
  ctx.font = '16pt Terminus';
  ctx.canvas.style.letterSpacing = '20px';
  ctx.fillStyle = 'white';
  ctx.fillText("Making sure Times New Roman doesn't take over...", 50, 50);


  // I have to do this so that the box doesn't show the wrong font...
  setTimeout( () => {
    createTextBox();
    updateCanvasPreview();
  }, 1000);


}

function createTextBox() {
  if (textBoxes.length > 0) {
    textBoxes[currentBox].button.style.backgroundColor = "#FFFFFF";
  }
  let textBox = new TextBox(textBoxes.length);

  currentBox = textBoxes.length - 1;
  $("line1").value = textBoxes[currentBox].line1;
  textBoxes[currentBox].button.style.backgroundColor = "red";
}

function selectTextBox(num) {
  textBoxes[currentBox].button.style.backgroundColor = "#FFFFFF";
  currentBox = num;
  $("line1").value = textBoxes[currentBox].line1;

  // Disable all buttons, getting ready to play one of the boxes.
  textBoxes.forEach( (item) => {
    item.button.disabled = true;
  });
  textBoxes[currentBox].button.style.backgroundColor = "green";
  clearCanvas();
  requestAnimationFrame(playText);
}

function DEBUGshowBox() {
  console.log(textBoxes[currentBox].portrait + ", " + textBoxes[currentBox].line1);
}

function updateText(text) {
  textBoxes[currentBox][text] = $(text).value;
  updateCanvasPreview();
}

function setPortrait(portrait) {
  if (portrait) {
    textBoxes[currentBox].portrait = portrait;
    textBoxes[currentBox].path.setAttribute("src", "Portraits/" + portrait + ".png");
  }
  else {
    textBoxes[currentBox].portrait = "none";
    textBoxes[currentBox].path.setAttribute("src", "Portraits/Clear.png");
  }
  updateCanvasPreview();
}

function updateCanvasPreview() {

  x = 0;
  y = 0;
  clearCanvas();

  for (let j = 0; j < textBoxes[currentBox].line1.length; j++) {
    if (textBoxes[currentBox].line1[j] === "\n") {
      j++;
      x = 0;
      y += 25;
    }
    ctx.fillText(textBoxes[currentBox].line1[j], 36 + x, 369 + y);
    x += 10;
  }
  x = 0;
  y = 0;
}

function clearCanvas() {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  let box = document.querySelector("#Box");
  let portrait = document.querySelector("#" + textBoxes[currentBox].portrait);
  ctx.drawImage(box, 0, 0);
  if (portrait != "none") ctx.drawImage(portrait, 512, 352);
}

function playText(time) {
//function playText() {
  if(time-lastFrameTime < FRAME_MIN_TIME){ //skip the frame if the call is too early
        requestAnimationFrame(playText);
        return; // return as there is nothing to do
    }
    lastFrameTime = time;
  if (i === textBoxes[currentBox].line1.length || textBoxes[currentBox].line1.length === 0) {
    i = 0;
    x = 0;
    y = 0;

    // Enable all buttons again after playback finishes
    textBoxes.forEach( (item) => {
      item.button.disabled = false;
    });
    textBoxes[currentBox].button.style.backgroundColor = "red";
    return;
  }

  if (textBoxes[currentBox].line1[i] === "\n") {
    i++;
    x = 0;
    y += 25;

    if (textBoxes[currentBox].line1[i] && textBoxes[currentBox].line1[i] === "\n") {
      i++;
      x = 0;
      y += 25;
    } else if (textBoxes[currentBox].line1[i]) {
      ctx.fillText(textBoxes[currentBox].line1[i], 36 + x, 369 + y);
      i++;
      x += 10;
    }

  }
  else {
     ctx.fillText(textBoxes[currentBox].line1[i], 36 + x, 369 + y);
     i++;
     x += 10;

     if (textBoxes[currentBox].line1[i] && textBoxes[currentBox].line1[i] === "\n") {
       i++;
       x = 0;
       y += 25;
     } else if (textBoxes[currentBox].line1[i]) {
       ctx.fillText(textBoxes[currentBox].line1[i], 36 + x, 369 + y);
       i++;
       x += 10;
     }

   }



  clickSound(i);
  requestAnimationFrame(playText);

}

function clickSound(i) {
  if (i % 6 == 0) {
    $("click").volume = 0.1;
    if ($("click").paused) {
      $("click").load();
      $("click").play();
    }
    else $("click").currentTime = 0;
  }
}

function playButton() {
  $("playbutton").disabled = true;
  clearCanvas();
  requestAnimationFrame(playText);

}

class TextBox {
  constructor(id) {

    this.id = id;
    this.line1 = "This is your text.\nWatch and see how text shows up.";
    this.portrait = "Niko1";
    this.button = null;

    textBoxes.push(this);

    let frames = $("frames");
    this.button = document.createElement("button");
    let image = document.createElement("IMG");
    this.path = image;
    this.button.addEventListener("mouseup", function() {
      selectTextBox(id);
    });
    this.button.innerHTML = this.id;
    image.setAttribute("src", "Portraits/" + this.portrait + ".png");

    frames.appendChild(this.button);
    this.button.appendChild(image);

  }
}
