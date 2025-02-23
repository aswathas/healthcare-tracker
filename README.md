# Healthcare Tracker

A comprehensive healthcare management application built with Next.js, Supabase, and modern web technologies.

## Features

### 1. Dashboard

- Health summary with active conditions and medications
- Recent test results visualization
- Upcoming appointments
- Health missions and goals tracking
- Real-time health status monitoring

### 2. Medical Profile

- Comprehensive medical history
- Conditions and medications tracking
- Pregnancy status monitoring
- Cardiac, pulmonary, and renal condition tracking
- Diabetes management
- Malignancy tracking

### 3. Test Results

- CBC (Complete Blood Count) results tracking
- Historical test data visualization
- Trend analysis
- Abnormal results highlighting

### 4. Doctor Visits

- Appointment scheduling
- Visit history
- Document uploads (prescriptions, reports)
- Follow-up reminders

### 5. AI Doctor Assistant

- Health query responses
- Symptom analysis
- General health advice
- Medical term explanations

### 6. Settings

- Profile management
- Notification preferences
- Connected services (Google Fit, Apple Health)
- Data sharing preferences

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: Tailwind CSS, Framer Motion
- **Data Visualization**: Chart.js, Recharts
- **Backend**: Supabase (PostgreSQL)
- **AI Integration**: Google Gemini API
- **Authentication**: Supabase Auth

## Project Structure

```
healthcare-tracker/
├── app/                    # Next.js app directory
│   ├── ai-doctor/         # AI doctor assistant
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── doctor-visits/     # Visit management
│   ├── medical-profile/   # Medical history
│   ├── reports/          # Test results & reports
│   └── settings/         # User settings
├── components/            # Reusable components
├── contexts/             # React contexts
├── lib/                  # Utility functions
└── types/               # TypeScript definitions
```

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/healthcare-tracker.git
cd healthcare-tracker
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
# Update .env.local with your Supabase and other API keys
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

The application uses the following main tables in Supabase:

- **profiles**: User profiles and basic information
- **medical_profiles**: Detailed medical history
- **cbc_results**: Blood test results
- **doctor_visits**: Appointment records
- **health_missions**: Health goals and tracking

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
