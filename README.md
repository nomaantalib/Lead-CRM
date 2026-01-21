# AI Sales Lead Management CRM

A fully functional MERN stack CRM application inspired by Salesforce Agentforce, featuring AI-powered lead scoring and management.

## MVP LINK :
 - ** https://lead-crm-frontend.onrender.com**
## Features

- **AI Lead Scoring**: Automatically scores leads using Google Gemini AI based on lead data
- **Sales Pipeline Management**: Track leads through stages (Prospect, Qualified, Proposal, etc.)
- **Dashboard with Charts**: Visualize lead priorities and pipeline stages
- **JWT Authentication**: Secure user authentication
- **CRUD Operations**: Add, view, edit, and delete leads
- **Responsive UI**: Clean and modern interface

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React.js, Axios, Recharts
- **AI**: Google Gemini API
- **Authentication**: JWT

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nomaantalib/Lead-CRM.git
   cd Lead-CRM
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   - Create/update `.env` file with:
     ```
     MONGO_URI=mongodb://127.0.0.1:27017/aicrm
     GEMINI_API_KEY=your_gemini_api_key_here
     JWT_SECRET=your_jwt_secret_here
     ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start MongoDB**
   - Ensure MongoDB is running on your system

5. **Run the Application**
   - Terminal 1 (Backend):
     ```bash
     cd backend
     npm start
     ```
   - Terminal 2 (Frontend):
     ```bash
     cd frontend
     npm start
     ```

6. **Access the App**
   - Open http://localhost:3000 in your browser
   - Register a new account or login

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Leads (Protected)
- `GET /api/leads` - Get all leads
- `POST /api/leads` - Create new lead (AI scoring applied)
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead

## AI Features

The AI agent analyzes lead information (name, email, company, phone, message) and provides:
- **Lead Score**: 0-100 quality score
- **Priority**: High/Medium/Low
- **Next Action**: Suggested action (e.g., "Call within 24 hours", "Send email")

## Project Structure

```
lead-CRM/
├── backend/
│   ├── ai/
│   │   └── leadAgent.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Lead.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── LeadRoutes.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api.js
│   │   ├── App.js
│   │   ├── Dashboard.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License
