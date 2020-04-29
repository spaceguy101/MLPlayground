// ml5.js: Pose Classification
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/learning/ml5/7.2-pose-classification.html
// https://youtu.be/FYgYyq-xqAw

// All code: https://editor.p5js.org/codingtrain/sketches/JoZl-QRPK

// Separated into three sketches
// 1: Data Collection: https://editor.p5js.org/codingtrain/sketches/kTM0Gm-1q
// 2: Model Training: https://editor.p5js.org/codingtrain/sketches/-Ywq20rM9
// 3: Model Deployment: https://editor.p5js.org/codingtrain/sketches/c5sDNr8eM

let video;
let poseNet;
let pose;
let skeleton;

let brain;
let poseLabel = "";

let state = 'waiting';
let stateP = null;
let targetLabel;

async function keyPressed() {
  if (key == 's') {
    brain.saveData();
  } else {

    if (key == 'u') {
      targetLabel = 'Squats_Up'
    } else if (key == 'd') {
      targetLabel = 'Squats_Down'
    } else {
      return;
    }

    stateP.html('Starting to Collect Data in 5 Secs .')
    await delay(1000);
    stateP.html('Starting to Collect Data in 4 Secs .')
    await delay(1000);
    stateP.html('Starting to Collect Data in 3 Secs .')
    await delay(1000);
    stateP.html('Starting to Collect Data in 2 Secs .')
    await delay(1000);
    stateP.html('Starting to Collect Data in 1 Secs .')
    await delay(1000);



    stateP.html('Collecting Data for ' + targetLabel)
    console.log('collecting');
    state = 'collecting';

    //stateP.html('Collecting Data for ' + targetLabel + ' 5 secs')
    //await delay(1000);
    //stateP.html('Collecting Data for ' + targetLabel + ' 4 secs')
    //await delay(1000);
    stateP.html('Collecting Data for ' + targetLabel + ' 3 secs')
    await delay(1000);
    stateP.html('Collecting Data for ' + targetLabel + ' 2 secs')
    await delay(1000);
    stateP.html('Collecting Data for ' + targetLabel + ' 1 secs')
    await delay(1000);
    stateP.html('Done Collecting Data for ' + targetLabel)

    console.log('not collecting');
    state = 'waiting';

  }
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);

  let options = {
    inputs: 34,
    outputs: 4,
    task: 'classification',
    debug: true
  }
  brain = ml5.neuralNetwork(options);

  stateP = createP();
  stateP.style('font-size', '30px');
}



function gotPoses(poses) {

  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
    if (state == 'collecting') {
      let inputs = [];
      for (let i = 0; i < pose.keypoints.length; i++) {
        let x = pose.keypoints[i].position.x;
        let y = pose.keypoints[i].position.y;
        inputs.push(x);
        inputs.push(y);
      }
      let target = [targetLabel];
      brain.addData(inputs, target);
    }

  }
}


function modelLoaded() {
  console.log('poseNet ready');
  stateP.html('PoseNet Ready')
}

function draw() {
  push();
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, video.width, video.height);

  if (pose) {
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(0);

      //line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0);
      stroke(255);
      ellipse(x, y, 16, 16);
    }
  }
  pop();

  fill(255, 0, 255);
  noStroke();
  textSize(512);
  textAlign(CENTER, CENTER);
  text(poseLabel, width / 2, height / 2);
}