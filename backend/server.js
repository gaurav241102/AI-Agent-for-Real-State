require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk'); // Import the Groq SDK
const fs = require('fs');

// Add error handling for environment variables
if (!process.env.GROQ_API_KEY) {
    console.error('Error: GROQ_API_KEY is not set in .env file');
    process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

// Add error handling for config file
let config;
try {
    config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
    console.log('Successfully loaded config.json');
} catch (error) {
    console.error('Error loading config.json:', error.message);
    process.exit(1);
}

// Initialize the Groq client with your API key
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// In-memory storage for conversations (for a real app, use a database)
const chatHistories = {};

// --- API Endpoint to START a chat ---
app.post('/api/start-chat', (req, res) => {
    console.log('Received start-chat request:', req.body);
    const { name, phone, industry } = req.body;
    const businessProfile = config[industry];
    if (!businessProfile) {
        console.error('Invalid industry:', industry);
        return res.status(400).json({ error: 'Invalid industry.' });
    }

    const greeting = businessProfile.initial_greeting.replace('{lead_name}', name);
    const firstQuestion = businessProfile.qualifying_questions[0];
    const initialMessage = `${greeting} ${firstQuestion}`;
    
    // Initialize chat history for this lead
    chatHistories[phone] = [{ role: 'assistant', content: initialMessage }];
    console.log(`New chat started for ${name} (${phone})`);
    res.json({ reply: initialMessage, history: chatHistories[phone] });
});

// --- API Endpoint to CONTINUE a chat ---
app.post('/api/chat', async (req, res) => {
    console.log('Received chat request:', req.body);
    const { message, phone, industry } = req.body;
    const businessProfile = config[industry];

    if (!chatHistories[phone]) {
        console.error('Chat not initiated for phone:', phone);
        return res.status(400).json({ error: 'Chat not initiated.' });
    }

    chatHistories[phone].push({ role: 'user', content: message });

    try {
        // This is the "System Prompt". It's the most important part of your AI logic.
        // We are instructing the AI on its persona, goal, and output format.
        const systemPrompt = `You are ${businessProfile.agent_name}, an expert sales assistant for the ${businessProfile.industry_name} industry. Your goal is to qualify a lead by being conversational and asking relevant questions.
        Qualification Rules:
        - Hot: ${businessProfile.qualification_rules.hot}
        - Cold: ${businessProfile.qualification_rules.cold}
        - Invalid: ${businessProfile.qualification_rules.invalid}
        
        Based on the entire conversation, generate your next conversational response. After the response, you MUST classify the lead and extract key metadata.
        Your final output must be a single, valid JSON object with three keys: "reply", "classification", and "metadata".
        Example: {"reply": "Great! What is your budget?", "classification": "Cold", "metadata": {"Location": "Pune"}}`;
        
        // Call the Groq API
        console.log('Calling Groq API...');
        const chatCompletion = await groq.chat.completions.create({
            // The "messages" array contains the entire conversation history plus our system instructions.
            messages: [
                { role: 'system', content: systemPrompt },
                ...chatHistories[phone] 
            ],
            // Here you specify the Groq model. Llama3 is a great choice.
            model: 'llama3-8b-8192', 
            
            // This is the magic for getting reliable JSON output.
            response_format: { type: 'json_object' },
        });

        const aiResponse = JSON.parse(chatCompletion.choices[0].message.content);
        
        // Add the AI's reply to our history for context in the next turn
        chatHistories[phone].push({ role: 'assistant', content: aiResponse.reply });

        // This logs the final output to your server's console for testing
        console.log('--- Groq Response & Classification ---');
        console.log('Lead:', phone);
        console.log('Classification:', aiResponse.classification);
        console.log('Metadata:', aiResponse.metadata);
        console.log('------------------------------------');

        // Send the structured data back to the frontend
        res.json(aiResponse);

    } catch (error) {
        console.error('Error calling Groq API:', error);
        res.status(500).json({ error: 'Failed to get response from AI.' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Environment:', process.env.NODE_ENV || 'development');
    console.log('Groq API Key:', process.env.GROQ_API_KEY ? '✓ Set' : '✗ Not set');
});
