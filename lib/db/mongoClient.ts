import { MongoClient } from "mongodb";

const { MONGODB_URI, NODE_ENV } = process.env;
const isDev = NODE_ENV === "development";

if (!MONGODB_URI) throw new Error("Please define the MONGODB_URI environment variable in .env");

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // Prevent multiple connections in development
  var _mongoClientPromise: Promise<MongoClient>;
}

if (isDev) {
  // Use global variable to preserve connection across hot reloads in dev mode
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI);
    global._mongoClientPromise = client.connect()
      .then((client) => {
        console.log("[MongoDB] connected (dev)");
        return client;
      })
      .catch((err) => {
        console.error("[MongoDB] connection failed (dev):", err);
        throw err;
      });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, we will create a new client for every build
  client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect()
    .then((client) => {
      console.log("[MongoDB] connected (prod)");
      return client;
    })
    .catch((err) => {
      console.error("[MongoDB] connection failed (prod):", err);
      throw err;
    });
}

export default clientPromise;
