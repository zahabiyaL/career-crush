# Career Crush 🚀
### _"You don't need love, you need a job!"_

Career Crush is a modern job-hunting platform that reimagines the recruitment process with a user-friendly, swipe-based interface. It connects Computer Science students with their ideal employers while helping companies find qualified talent efficiently.

## ✨ Key Features

### For Students
- **Profile Creation** - Build a comprehensive profile showcasing your:
  - Technical and soft skills
  - Educational background
  - Work preferences
  - Professional story and achievements
  - Core values and career goals
- **Smart Job Discovery** - Swipe through personalized job recommendations
- **Easy Application** - Apply to positions with a single swipe
- **Resume Management** - Upload and manage your professional documents

### For Recruiters
- **Streamlined Job Posting** - Create detailed job listings with:
  - Comprehensive job descriptions
  - Required and preferred skills
  - Salary ranges and benefits
  - Work environment preferences
  - Application deadlines
- **Candidate Discovery** - Browse through qualified candidate profiles
- **Dashboard Analytics** - Track job posting performance and application statistics
- **Team Management** - Coordinate hiring efforts across your organization

## 🛠️ Technology Stack

### Frontend
- **React** (v19) - UI framework
- **Vite** (v6) - Build tool and development server
- **React Router** (v7) - Client-side routing
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Modern icon system

### Backend
- **Node.js/Express** - Server framework
- **MongoDB/Mongoose** - Database and ODM
- **JWT** - Authentication
- **Multer** - File upload handling
- **Google Auth Library** - OAuth integration

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB instance
- Google OAuth credentials (for social login)

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/career-crush.git
cd career-crush
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:5173
PORT=3000
```

4. Start the development server
```bash
# Start backend server
npm start

# In a new terminal, start frontend development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure
```
career-crush/
├── server/                 # Backend code
│   ├── models/            # Mongoose models
│   ├── uploads/           # File upload directory
│   └── server.js          # Express server setup
├── src/                   # Frontend code
│   ├── components/        # Reusable React components
│   ├── pages/             # Page components
│   ├── assets/           # Static assets
│   ├── App.jsx           # Main React component
│   └── main.jsx          # Application entry point
├── public/               # Public assets
└── package.json          # Project dependencies
```

## 🔐 Authentication Flow
- Custom email/password authentication
- Google OAuth integration
- JWT-based session management
- Secure password hashing with bcrypt

## 💾 Data Models

### Student Profile
- Basic information
- Educational background
- Skills and expertise
- Work preferences
- Professional story
- Core values and goals

### Job Posting
- Company information
- Job requirements
- Compensation details
- Application process
- Status tracking

### Company Profile
- Recruiter details
- Company information
- Job postings
- Candidate interactions

## 🔄 Development Workflow
1. Create feature branches from `main`
2. Follow ESLint rules and code style guidelines
3. Submit pull requests for review
4. Merge after approval and successful CI checks

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
