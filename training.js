// ml5.js: Pose Classification
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/learning/ml5/7.2-pose-classification.html
// https://youtu.be/FYgYyq-xqAw

// All code: https://editor.p5js.org/codingtrain/sketches/JoZl-QRPK

// Separated into three sketches
// 1: Data Collection: https://editor.p5js.org/codingtrain/sketches/kTM0Gm-1q
// 2: Model Training: https://editor.p5js.org/codingtrain/sketches/-Ywq20rM9
// 3: Model Deployment: https://editor.p5js.org/codingtrain/sketches/c5sDNr8eM

let brain;
let p;
function setup() {
  createCanvas(640, 480);
  let options = {
    inputs: 34,
    outputs: 4,
    task: 'classification',
    debug: true
  }
  brain = ml5.neuralNetwork(options);
  brain.loadData('data/squats_standing_tooClose-30-4-20.json', dataReady);

  p = createP('Dont Click train yet');
  p.style('font-size', '30px');
  button = createButton('Train');

  button.mousePressed(function () {
    brain.normalizeData();
    brain.train({ epochs: 100 }, finished);
  });

}

function dataReady() {
  p.html('Data is Loaded . Click train now')
}

function finished() {
  console.log('model trained');
  brain.save();
}