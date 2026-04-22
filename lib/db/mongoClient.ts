import { MongoClient } from "mongodb";

const { MONGODB_URI, NODE_ENV } = process.env;
const isDev = NODE_ENV === "development";

// Skip MongoDB connection during build time
const isBuildTime = process.env.NODE_ENV === "production" && !process.env.MONGODB_URI;

if (!MONGODB_URI && !isBuildTime) {
  throw new Error("Please define the MONGODB_URI environment variable in .env");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // Prevent multiple connections in development
  var _mongoClientPromise: Promise<MongoClient>;
}

// Provide a dummy promise during build time when MONGODB_URI is not available
if (isBuildTime || !MONGODB_URI) {
  clientPromise = Promise.resolve({} as MongoClient);
} else if (isDev) {
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
  // Production mode with fresh connection
  client = new MongoClient(MONGODB_URI!); // Using ! since we know it exists here
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
