const { MongoClient } = require('mongodb');
require('dns').setServers(['8.8.8.8', '8.8.4.4']);

const uri = "mongodb+srv://zaki:test1234@cluster0.l11irmx.mongodb.net/?appName=Cluster0";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const adminDb = client.db().admin();
    const dbs = await adminDb.listDatabases();
    console.log("Databases:");
    dbs.databases.forEach(db => console.log(`- ${db.name}`));
  } catch(e) {
    console.error("ERROR:", e);
  } finally {
    await client.close();
  }
}
run();
