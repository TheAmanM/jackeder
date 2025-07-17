# Jackeder - Gym Accountability for Friends

A web application designed for a close-knit group of friends to track their daily gym attendance and foster mutual accountability.

## Features

- **Landing Page**: Compelling overview with clear value proposition
- **User Authentication**: Sign up and login with Firebase Auth
- **Dashboard**: Real-time view of everyone's gym status
- **Progress Tracking**: Personal charts and statistics
- **User Profiles**: Individual friend profiles with history
- **Historical View**: Navigate through past dates
- **Responsive Design**: Works on all devices

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **UI Library**: shadcn/ui components
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Charts**: Recharts
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Setup Instructions

### 1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd jackeder-gym-tracker
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Firebase Setup
1. Create a new Firebase project at https://console.firebase.google.com
2. Enable Authentication with Email/Password provider
3. Create a Firestore database
4. Get your Firebase configuration from Project Settings

### 4. Environment Variables
1. Copy `.env.local.example` to `.env.local`
2. Fill in your Firebase configuration values:

\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
\`\`\`

### 5. Firestore Security Rules
Add these security rules to your Firestore database:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read all user profiles but only update their own
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read all gym statuses but only update their own
    match /gymStatuses/{statusId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
\`\`\`

### 6. Run the development server
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Deployment

### Deploy to Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

## Usage

1. **Sign Up**: Create an account with username, email, and password
2. **Dashboard**: View today's gym status for you and your friends
3. **Update Status**: Toggle your gym attendance for the current day
4. **View Progress**: Check your personal statistics and charts
5. **Friend Profiles**: Click on friend names to view their profiles
6. **Historical Data**: Navigate to previous dates to see past statuses

## Project Structure

\`\`\`
├── app/
│   ├── (auth)/          # Authentication pages
│   ├── dashboard/       # Main dashboard
│   ├── progress/        # Progress tracking
│   ├── profile/         # User profiles
│   └── api/            # API routes
├── components/
│   ├── ui/             # shadcn/ui components
│   └── auth-guard.tsx  # Authentication wrapper
├── lib/
│   └── firebase.ts     # Firebase configuration
└── scripts/
    └── *.sql          # Database setup scripts
\`\`\`

## Contributing

This is a private project for a specific group of friends. If you'd like to create your own version:

1. Fork the repository
2. Set up your own Firebase project
3. Customize the user interface and features as needed
4. Deploy to your preferred platform

## License

Private project - All rights reserved.
