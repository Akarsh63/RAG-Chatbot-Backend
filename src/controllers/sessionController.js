require('dotenv').config();
const {v4: uuidv4} = require('uuid');
const { REDIS_CACHE } = require('../services/redisService');
const REDIS_CACHE_TTL = process.env.REDIS_CACHE_TTL;

const createSessionController = async(req, res)=>{
    try{
        const session_id = uuidv4();

        // create a new session if the session id is not existing
        const result = await REDIS_CACHE.setNX(session_id, JSON.stringify([]), REDIS_CACHE_TTL);

        if(!result){
            throw new Error(`Session is already existing for session_id ${session_id}`);
        }

        return res.status(200).json({
            status : true,
            message : 'New session created successfully',
            data : session_id
        })
    }
    catch(error){
        console.error('Error in creation new session id :', error);
        return res.status(500).json({
            status : false,
            message : 'Sorry! Unable to create new session'
        });
    }
}

const deleteSessionController = async(req, res)=>{
    try{
        const {
            session_id
        } = req.params;

        await REDIS_CACHE.del(session_id);

        return res.status(200).json({
            status : true,
            message : 'Session deleted successfully',
        });
    }
    catch(error){
        console.error(`Error in deleting session ${session_id} :`, error);
        return res.status(500).json({
            status : false,
            message : 'Sorry! Unable to delete session'
        });
    }
}

module.exports={
    createSessionController,
    deleteSessionController
}