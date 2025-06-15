# GrowEasy AI Agent

A conversational AI agent built with React and Node.js that helps qualify leads for different industries using the Groq AI API. This project was developed as part of the AI Full Stack Developer Assessment for GrowEasy.

## 👨‍💻 Developer Information
- **Name:** Gaurav Prakash
- **GitHub:** [gaurav241102](https://github.com/gaurav241102)
- **LinkedIn:** [Gaurav Prakash](https://www.linkedin.com/in/gaurav-prakash-97071a199/)
- **Email:** gaurav31308@gmail.com

## 🎯 Project Overview

This project implements a WhatsApp-like chat interface that:
- Receives and initiates conversations with leads
- Qualifies leads as Hot, Cold, or Invalid
- Supports configurable industry profiles (starting with real estate)
- Extracts relevant metadata from conversations

## ✨ Features

- Real-time chat interface for lead qualification
- Industry-specific conversation flows
- AI-powered lead classification (Hot/Cold/Invalid)
- Automatic metadata extraction from conversations
- Configurable business rules and qualification criteria
- Natural, empathetic responses
- Smart fallback for unresponsive leads
- Industry-agnostic plugin/config support

## 🛠️ Tech Stack

### Frontend
- React.js
- Modern JavaScript (ES6+)
- CSS3 for styling

### Backend
- Node.js
- Express.js
- Groq AI API for natural language processing
- CORS enabled for cross-origin requests

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Groq API key (get it from [Groq Console](https://console.groq.com))

## 🚀 Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/gaurav241102/groweasy-assessment.git
cd groweasy-assessment
```

2. Set up the backend:
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory:
```
PORT=3001
GROQ_API_KEY=your_groq_api_key_here
```

4. Set up the frontend:
```bash
cd ../frontend
npm install
```

5. Start the development servers:

In one terminal (backend):
```bash
cd backend
node server.js
```

In another terminal (frontend):
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## 📁 Project Structure

```
groweasy-assessment/
├── backend/
│   ├── server.js          # Express server and API endpoints
│   ├── config.json        # Business rules and conversation flows
│   └── .env              # Environment variables (not in git)
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   ├── App.js        # Main React component
│   │   └── App.css       # Styles
│   └── public/           # Static files
└── README.md
```

## 🔌 API Endpoints

### POST /api/start-chat
Starts a new conversation with a lead.
```json
{
  "name": "Lead Name",
  "phone": "1234567890",
  "industry": "real_estate"
}
```

### POST /api/chat
Continues an existing conversation.
```json
{
  "message": "User's message",
  "phone": "1234567890",
  "industry": "real_estate"
}
```

## ⚙️ Configuration

The `config.json` file contains industry-specific configurations:
- Initial greetings
- Qualifying questions
- Classification rules
- Metadata extraction rules

Example configuration for real estate:
```json
{
  "industry": "real_estate",
  "greeting": "Hi {name}! Thanks for reaching out. I'm your GrowEasy real estate assistant.",
  "qualifying_questions": [
    "Which city/location are you looking for?",
    "Are you looking for a flat, villa, or plot?",
    "Is this for investment or personal use?",
    "What's your budget range?"
  ],
  "classification_rules": {
    "hot": {
      "criteria": ["clear_location", "specific_property_type", "defined_budget", "urgent_timeline"]
    },
    "cold": {
      "criteria": ["vague_requirements", "no_urgency", "unresponsive"]
    },
    "invalid": {
      "criteria": ["gibberish", "test_entry", "spam"]
    }
  }
}
```

## 📝 Sample Chat Transcripts

### Hot Lead Example
```
AI: Hi Rohit! Thanks for reaching out. I'm your GrowEasy real estate assistant. Could you share which city/location you're looking for?
User: Pune, preferably near Kalyani Nagar.
AI: Great! Are you looking for a flat, villa, or plot? Also, is this for investment or personal use?
User: 2BHK flat for personal use. Need to move in within 3 months.
AI: Understood! What's your budget range?
User: Max 75L.
```

Classification: Hot
Metadata:
- Location: Pune (Kalyani Nagar)
- Property Type: 2BHK Flat
- Budget: ₹75L
- Timeline: 3 months
- Purpose: Personal use

## 📧 Submission Details

This project was submitted to:
- varun@groweasy.ai
- CC: tej@groweasy.ai

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Groq AI for providing the AI capabilities
- React team for the amazing frontend framework
- Express.js team for the backend framework 