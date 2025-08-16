import { MongoClient } from "mongodb";

export class MongoService {
  private client: MongoClient | null = null;
  private static instance: MongoService;
  private constructor() {}

  private static async init() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
    MongoService.instance = new MongoService();
    MongoService.instance.client = new MongoClient(uri);
    await MongoService.instance.client.connect();
    console.log("[mongodb] Connected to MongoDB");
  }
  public static async getInstance(): Promise<MongoService> {
    if (!MongoService.instance) {
      MongoService.instance = new MongoService();
      await MongoService.init();
    }
    return MongoService.instance;
  }
  public static async getClient(): Promise<MongoClient> {
    await MongoService.getInstance();
    if (!MongoService.instance.client) {
      throw new Error("MongoDB client is not initialized");
    }
    return MongoService.instance.client;
  }
}
