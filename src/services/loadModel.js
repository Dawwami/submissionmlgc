
const tf = require("@tensorflow/tfjs-node");


async function loadModel() {

    const modelUrl = 'https://storage.googleapis.com/submissionmlgc-dawwami/models/model.json';
    console.log(`Trying to load model from: ${modelUrl}`);

	try {
		return await tf.loadGraphModel(modelUrl);
	} catch (error) {
		console.error("Error loading model:", error);
		throw error;
	}
}

module.exports = loadModel;