require('dotenv').config();
const axios = require('axios');

const JINA_AI_API_KEY = process.env.JINA_AI_API_KEY;

const getJinaEmbeddings = async(input)=>{
    try{
        const url = 'https://api.jina.ai/v1/embeddings';

        const data = {
            model: "jina-embeddings-v3",
            task: "text-matching",
            input
        }

        const headers = {
            Authorization: `Bearer ${JINA_AI_API_KEY}`
        }

        const response = await axios({
            method : 'POST',
            url,
            data,
            headers
        });

        console.log(`Jina embeddings for input ${JSON.stringify(input)} :`, response.data);
        return response.data;
    }
    catch(error){
        console.error('Error in creating jins embeddings :', error);
        throw error;
    }
}

module.exports={
    getJinaEmbeddings
}