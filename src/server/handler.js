const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const {getData, storeData} = require('../services/storeData');

 
async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;
 
  const { confidenceScore, label, suggestion } = await predictClassification(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    "id": id,
    "result": label,
    "suggestion": suggestion,
    "confidenceScore": confidenceScore,
    "createdAt": createdAt
  };

  await storeData(id, data); 

  const response = h.response({
    status: 'success',
    message:'Model is predicted successfully',
    data
  })
  response.code(201);
  return response;
  
}

async function getPredictHandler(request, h) {
  try {
    const data = await getData();

    const response = h.response({
      status: 'success',
      data,
    });
    response.code(200);
    return response;
  } catch (error) {
    console.error('Error in getPredictHandler:', error);
    const response = h.response({
      status: 'error',
      message: 'Terjadi kesalahan saat mengambil data',
    });
    response.code(500);
    return response;
  }
}


module.exports = { postPredictHandler, getPredictHandler };