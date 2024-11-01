let capture;
let posenet;
let poses = [];

// Define indices for the head and body separately
let headIndices = [0, 1, 2, 3, 4]; // Head keypoints (nose, eyes, ears)
let bodyIndices = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]; // Rest of the body

// Define connections for the head (connecting head keypoints with each other)
let headConnections = [
    [0, 1], // Nose to left eye
    [0, 2], // Nose to right eye
    [1, 3], // Left eye to left ear
    [2, 4]  // Right eye to right ear
];

// Define body connections (without connecting to the head)
let bodyConnections = [
    [5, 6], // Connect left and right shoulders
    [5, 7], [7, 9], // Connect left shoulder to left elbow and left wrist
    [6, 8], [8, 10], // Connect right shoulder to right elbow and right wrist
    [5, 11], // Connect left shoulder to left hip
    [6, 12], // Connect right shoulder to right hip
    [11, 13], [13, 15], // Connect left hip to left knee and left ankle
    [12, 14], [14, 16] // Connect right hip to right knee and right ankle
];

function setup() {
    createCanvas(800, 500);
    capture = createCapture(VIDEO);
    capture.size(800, 500); // Ensure the video size matches the canvas
    capture.hide();

    posenet = ml5.poseNet(capture, modelLoaded);
    posenet.on('pose', receivedPoses);
}

function receivedPoses(results) {
    poses = results; // Store the received poses
}

function modelLoaded() {
    console.log('PoseNet Model Loaded');
}

function draw() {
    image(capture, 0, 0, width, height);

    // Draw the poses
    for (let i = 0; i < poses.length; i++) {
        let pose = poses[i].pose;

        // Draw head connections
        for (let j = 0; j < headConnections.length; j++) {
            let pointAIndex = headConnections[j][0];
            let pointBIndex = headConnections[j][1];
            let pointA = pose.keypoints[pointAIndex];
            let pointB = pose.keypoints[pointBIndex];

            // Draw a line if both keypoints are detected
            if (pointA.score > 0.2 && pointB.score > 0.2) {
                stroke(0, 0, 255); // Blue for head connections
                strokeWeight(2);
                line(pointA.position.x, pointA.position.y, pointB.position.x, pointB.position.y);
            }
        }

        // Draw head keypoints
        for (let j = 0; j < headIndices.length; j++) {
            let keypoint = pose.keypoints[headIndices[j]];
            if (keypoint.score > 0.2) {
                fill(0, 255, 0); // Green for head keypoints
                noStroke();
                circle(keypoint.position.x, keypoint.position.y, 10);
            }
        }

        // Draw body connections
        for (let j = 0; j < bodyConnections.length; j++) {
            let pointAIndex = bodyConnections[j][0];
            let pointBIndex = bodyConnections[j][1];
            let pointA = pose.keypoints[pointAIndex];
            let pointB = pose.keypoints[pointBIndex];

            // Draw a line if both keypoints are detected
            if (pointA.score > 0.2 && pointB.score > 0.2) {
                stroke(255, 0, 0); // Red for body connections
                strokeWeight(2);
                line(pointA.position.x, pointA.position.y, pointB.position.x, pointB.position.y);
            }
        }

        // Draw body keypoints
        for (let j = 0; j < bodyIndices.length; j++) {
            let keypoint = pose.keypoints[bodyIndices[j]];
            if (keypoint.score > 0.2) {
                fill(0, 255, 0); // Green for body keypoints
                noStroke();
                circle(keypoint.position.x, keypoint.position.y, 10);
            }
        }
    }
}
