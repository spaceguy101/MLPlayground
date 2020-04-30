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
let lablesLog;
let targetLabel;

let saveButton;
let addLabelButton;
let inputLabel;
let dataSet = {

};


async function addLabel(_targetLabel) {

  targetLabel = _targetLabel

  await startTimer(false, targetLabel, 5);

  console.log('collecting');
  state = 'collecting';

  await startTimer(true, targetLabel, 3);
  stateP.html('Done Collecting Data for ' + targetLabel)
  state = 'waiting';
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
  brain.loadData('data/squats_standing-30-4-20.json', function () {
    console.log('squats_standing-30-4-20.json data loaded')
  })
  stateP = createP();
  stateP.style('font-size', '30px');




  inputLabel = createInput();
  inputLabel.attribute('class', 'form-control');
  inputLabel.attribute('placeholder', 'Write Label Here');


  addLabelButton = createButton('Add label');
  addLabelButton.attribute('class', 'btn btn-primary');

  addLabelButton.mousePressed(async function () {
    await addLabel(inputLabel.value());
  });


  saveButton = createButton('Save Data');
  saveButton.attribute('class', 'btn btn-primary');
  saveButton.mousePressed(function () {
    brain.saveData();
  });


  lablesLog = createP('No Labels');
  lablesLog.style('font-size', '30px');

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
      logLabel(targetLabel)
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

function logLabel(label) {
  if (dataSet.hasOwnProperty(label)) {
    dataSet[label]++;
  } else {
    dataSet[label] = 1;
  }
  lablesLog.html(JSON.stringify(dataSet));
}