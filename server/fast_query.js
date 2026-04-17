const { MongoClient } = require('mongodb');
require('dns').setServers(['8.8.8.8', '8.8.4.4']);

const uri = "mongodb+srv://zaki:test1234@cluster0.l11irmx.mongodb.net/?appName=Cluster0";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("test"); // Mongoose default is usually "test" if not specified
    const collection = db.collection("companies"); // Mongoose uses lowercase plural
    const company = await collection.findOne();
    if (company) {
      console.log('COMPANY_EMAIL:', company.email);
    } else {
      console.log('No company found.');
    }
  } catch(e) {
    console.error("ERROR:", e);
  } finally {
    await client.close();
  }
}
run();
