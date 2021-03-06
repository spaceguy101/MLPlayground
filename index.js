// ml5.js: Pose Classification
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/learning/ml5/7.2-pose-classification.html
// https://youtu.be/FYgYyq-xqAw

// All code: https://editor.p5js.org/codingtrain/sketches/JoZl-QRPK

// Separated into three sketches
// 1: Data Collection: https://editor.p5js.org/codingtrain/sketches/kTM0Gm-1q
// 2: Model Training: https://editor.p5js.org/codingtrain/sketches/-Ywq20rM9
// 3: Model Deployment: https://editor.p5js.org/codingtrain/sketches/c5sDNr8eM
p5.disableFriendlyErrors = true; // disables FES

let video;
let poseNet;
let pose;
let skeleton;

let brain;
let poseLabel = "Label";
let labelP = null


function setup() {
  let canvas = createCanvas(640, 480);
  canvas.style('margin', 'auto')
  canvas.parent('sketch-div');

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
  const modelInfo = {
    model: 'models/model.json',
    metadata: 'models/model_meta.json',
    weights: 'models/model.weights.bin',
  };
  brain.load(modelInfo, brainLoaded);

  labelP = select('#labelP');

}

function brainLoaded() {
  classifyPose();
}

function classifyPose() {
  if (pose) {
    let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y);
    }
    brain.classify(inputs, gotResult);
  } else {
    setTimeout(classifyPose, 100);
  }
}

function gotResult(error, results) {

  var html = '';
  for (result of results) {
    html = html + result.label + ':' + result.confidence.toFixed(2) * 100 + "</br>"
  }
  labelP.html(html)

  //console.log(results[0].confidence);
  setTimeout(classifyPose, 100);
}


function gotPoses(poses) {

  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  } else {
    pose = null;
  }
}


function modelLoaded() { }

function draw() {

  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, video.width, video.height);

  if (pose) {
    /*
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
      fill(0, 0, 255);
      stroke(255);
      ellipse(x, y, 16, 16);
    }
    */
  } else {
    labelP.html('No person found')
  }

}