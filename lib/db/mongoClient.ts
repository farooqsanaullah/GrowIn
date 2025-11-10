import { MongoClient } from "mongodb";

const { DATABASE_URL, NODE_ENV } = process.env;
const isDev = NODE_ENV === "development";

if (!DATABASE_URL) throw new Error("Please define the DATABASE_URL environment variable in .env");

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // Prevent multiple connections in development
  var _mongoClientPromise: Promise<MongoClient>;
}

if (isDev) {
  // Use global variable to preserve connection across hot reloads in dev mode
  if (!global._mongoClientPromise) {
    client = new MongoClient(DATABASE_URL);
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
  client = new MongoClient(DATABASE_URL);
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
