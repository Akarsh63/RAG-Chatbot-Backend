require('dotenv').config();
const axios = require('axios');

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;

const getTopKEmbeddings = async(query_embedding, k)=>{
    try{
        const url = 'https://rag-news-articles-ke1uus4.svc.aped-4627-b74a.pinecone.io/query';

        const headers={
            "Api-Key": PINECONE_API_KEY,
            "X-Pinecone-API-Version": "2025-01"
        };

        const data = {
            namespace: "news-articles",
            vector: query_embedding,
            top_k: k,
            includeValues: false,
            includeMetadata: true,
        };

        const response = await axios({
            method : 'POST',
            url,
            data,
            headers
        });

        const top_k_similar_embeddings = response.data;

        return top_k_similar_embeddings?.matches || [];
    }
    catch(error){
        console.error(`Error in fetching top k=${k} embeddings :`, error);
        throw error;
    }
}

module.exports={
    getTopKEmbeddings
}