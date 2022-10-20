const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = 'mongodb+srv://junu:qwe123@cluster0.dkrrnaq.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

module.exports = client;