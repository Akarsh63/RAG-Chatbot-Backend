const { getGeminiResponseForQuery } = require("../services/geminiAiService");
const { getJinaEmbeddings } = require("../services/jinaAiService");
const { getTopKEmbeddings } = require("../services/pineconeService");

const NUMBER_OF_SIMILAR_EMBEDDINGS = 50;

const sendChatQueryHandler = async(session_id, query)=>{
    try{
        // Get Jina Embeddings for the input query
        const input = [query];
        const jina_embedding = await getJinaEmbeddings(input);
        
        const query_embedding = jina_embedding?.data?.[0]?.embedding;

        // Fetch top k similar vectors for the query_embedding
        const top_k_similar_vectors = await getTopKEmbeddings(query_embedding, NUMBER_OF_SIMILAR_EMBEDDINGS);

        const top_k_similar_paragraphs = top_k_similar_vectors.map((vector)=>{
            return vector['metadata']['paragraph'];
        });

        console.log(`Top k=${NUMBER_OF_SIMILAR_EMBEDDINGS} similar paragraphs for query ${query} for session ${session_id}:`, 
            top_k_similar_paragraphs
        );

        const stream = await getGeminiResponseForQuery(query, top_k_similar_paragraphs);

        return stream;
    }
    catch(error){
        console.error(`Error in send chat message handler for session ${session_id} :`, error);
        throw error;
    }
}

module.exports={
    sendChatQueryHandler
}