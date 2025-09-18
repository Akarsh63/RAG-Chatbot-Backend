const { 
    sendChatQueryHandler
} = require("../handlers/chatHandler");
const { REDIS_CACHE } = require("../services/redisService");
const REDIS_CACHE_TTL = process.env.REDIS_CACHE_TTL;

const getExistingChatController = async(req, res)=>{
    try{
        const {
            session_id
        } = req.params;

        if(!session_id){
            return res.status(400).json({
                status : false,
                messsage : 'Session id is missing'
            });
        }

        let existing_chats = await REDIS_CACHE.get(session_id);

        if(!existing_chats){
            throw new Error('Session is expired');
        }

        existing_chats = JSON.parse(existing_chats);
        console.log(`Existing chat for session id ${session_id} :`, existing_chats);

        return res.status(200).json({
            status : true,
            messsage : 'Existing chat fetched successfully',
            data : existing_chats
        })
    }
    catch(error){
        console.error('Error in fetching existing chat :', error);
        return res.status(500).json({
            status : false,
            messsage : error.message
        })
    }
}

const sendChatQueryController = async(req, res)=>{
    try{
        const {
            session_id
        } = req.params;

        const {
            query
        } = req.body

        if(!session_id){
            return res.status(400).json({
                status : false,
                messsage : 'Session id is missing'
            });
        }

        if(!query){
            return res.status(400).json({
                status : false,
                messsage : 'Sorry! Query is empty'
            });
        }
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');

        const stream = await sendChatQueryHandler(session_id, query);

        let bot_response = "";
        stream.on('data', (chunk) => {
            try{
                let formatted_chunk = chunk.toString();
                formatted_chunk = formatted_chunk.replace("data: ", "");
                formatted_chunk = JSON.parse(formatted_chunk);
                const chunk_message = formatted_chunk.candidates?.[0]?.content?.parts?.[0].text || "";
                bot_response+= chunk_message;
                const response = JSON.stringify({
                    response : chunk_message
                })
                res.write(`data: ${response}\n\n`);
            }
            catch(error){
                console.error(`Error in sending chunk for session ${session_id} :`, error);
            }
        });

        stream.on('end', async() => {
            try{
                res.end(); 
                console.log('Stream to client ended successfully.');

                const existing = await REDIS_CACHE.get(session_id);
                let messages = existing ? JSON.parse(existing) : [];

                messages.push({
                    role: "user",
                    content: query,
                });

                messages.push({
                    role: "chatbot",
                    content: bot_response,
                });

                await REDIS_CACHE.set(session_id, JSON.stringify(messages), REDIS_CACHE_TTL);
            }
            catch(error){
                console.error(`Error in storing chunk messages for session ${session_id} :`, error);
            }
        });

        stream.on('error', (error) => {
            console.error('Stream error:', error);
            res.status(500).end();
        });
    }
    catch(error){
        console.error('Error in seding chat query :', error);
        return res.status(500).json({
            status : false,
            messsage : error.messsage
        })
    }
}

module.exports={
    getExistingChatController,
    sendChatQueryController
}