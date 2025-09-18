const Redis = require('ioredis')

const REDIS_URL = process.env.REDIS_URL;

class RedisService{
    constructor(){
        this.redis = new Redis(REDIS_URL);
    }

    async get(key){
        try{
            const value = await this.redis.get(key);
            return value;
        }
        catch(error){
            console.error(`Error in redis get operation for key ${key} :`, error);
            throw error;
        }
    }

    async set(key, value, ttlInSeconds){
        try{
            const result = await this.redis.set(key, value, 'EX', ttlInSeconds);
            return result === 'OK'
        }
        catch(error){
            console.error(`Error in redis set operation for key ${key} :`, error);
            throw error;
        }
    }

    async setNX(key, value, ttlInSeconds){
        try {
            const result = await this.redis.set(key, value, 'NX', 'EX', ttlInSeconds);
            return result === 'OK'
        } catch (error) {
            console.error(`Error in set key in NX for ${key} :`, error);
            throw error;
        }
    }

    async del(key){
        try {
            await this.redis.del(key);
            console.log(`Deleted key ${key} from Redis`);
        } catch (error) {
            console.error(`Error deleting key ${key} :`, error);
            throw error;
        }
    }

}

const REDIS_CACHE = new RedisService();

module.exports={
    REDIS_CACHE
}