import { RedisClientType, createClient } from "redis";

export class RedisService {
  private static instance: RedisService;
  private client: RedisClientType | null = null;

  private constructor() {}

  private static async init() {
    const uri = process.env.REDIS_URI || "redis://localhost:6379";
    RedisService.instance = new RedisService();
    RedisService.instance.client = createClient({ url: uri });
    await RedisService.instance.client.connect();
    console.log("[redis] Connected to Redis");
  }

  public static async getInstance(): Promise<RedisService> {
    if (!RedisService.instance) {
      await RedisService.init();
    }
    return RedisService.instance;
  }

  public async getClient(): Promise<RedisClientType> {
    await RedisService.getInstance();
    if (!RedisService.instance.client) {
      throw new Error("Redis client is not initialized");
    }
    return RedisService.instance.client;
  }
}
