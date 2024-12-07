const { Firestore } = require('@google-cloud/firestore');
 
async function storeData(id, data) {
  const db = new Firestore();
 
  const predictCollection = db.collection('prediction');
  return predictCollection.doc(id).set(data);
}

async function getData() {
  try {
    const db = new Firestore();
    const snapshot = await db.collection('prediction').get();
    if (snapshot.empty) {
      console.log('No matching documents.');
      return [];
    }

    const data = [];
    snapshot.forEach((doc) => {
      data.push({
        id: doc.id, // Tambahkan ID dokumen ke dalam data
        ...doc.data(),
      });
    });

    return data;
  } catch (error) {
    console.error('Error fetching data from Firestore:', error);
    throw new Error('Unable to fetch data');
  }
}



module.exports = {storeData, getData};