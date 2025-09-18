require('dotenv').config();
const axios = require('axios');

const GEMINI_AI_API_KEY = process.env.GEMINI_AI_API_KEY;

const getGeminiResponseForQuery = async(query, related_paragraphs)=>{
    try{
        const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse'

        const headers = {
            'x-goog-api-key' : GEMINI_AI_API_KEY
        };

        const prompt = `User query: ${query}

            Relevant information:
            ${
                related_paragraphs.map((paragraph, index)=>{
                    return `${index+1}. ${paragraph}`
                }).join("\n")
            }

            Instructions for the assistant:
            1. Use the relevant internal information only if it directly helps answer the query.
            2. If internal information is missing or not useful, do NOT mention it.  
            Instead, generate a complete response using external knowledge.
            3. Provide a informative, and factual answer regarding the query related to news articles.
            4. Ignore unrelated internal documents entirely.
            5. Do not describe your thought process or mention "internal info" unless it's actually useful.
            6. Structure your response as a direct answer to the user query.
            "
        `

        const data = {
            "contents": [
            {
                "parts": [
                    {
                        "text": prompt
                    }
                ]
            }
            ],
            "generationConfig": {
            "thinkingConfig": {
                    "thinkingBudget": 0
                }
            }
        };

        const response = await axios({
            method : 'POST',
            url,
            data,
            headers,
            responseType: 'stream'
        });
        const stream = response.data;
        return stream
    }
    catch(error){
        console.error(`Error in getting gemini response for query ${query} :`, error);
        throw error;
    }
}

module.exports={
    getGeminiResponseForQuery
}