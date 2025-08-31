# 🚀 DSA Daily Boost - Professional Edition

A comprehensive, professional-grade DSA learning platform with advanced features including custom timers, email notifications, extensive resource collections, and detailed progress analytics. Built for serious programmers who want to master Data Structures & Algorithms efficiently.

## ✨ Professional Features

### 🎯 Core Learning Features
- 📚 **150+ Comprehensive DSA Topics** - Complete coverage with detailed preparation plans
- 🎥 **Multi-Platform Resources** - Striver videos, articles, practice problems from 6+ platforms
- 📖 **Detailed Preparation Plans** - Short-term and long-term learning strategies for each topic
- 🗺️ **Learning Roadmap** - Beginner to Advanced phase tracking
- 💡 **Motivational System** - Daily quotes and achievement badges

### ⏱️ Advanced Timer System
- 🕐 **Custom Timer Durations** - 15, 25, 30, 45, 60 minutes + custom values
- ⚡ **Overtime Tracking** - Monitor dedication beyond set timer duration
- 📊 **Session Analytics** - Real-time efficiency and performance metrics
- 🔔 **Smart Notifications** - Browser and email notifications for session completion

### 📧 Professional Email System
- 📬 **Welcome Emails** - Beautifully designed onboarding emails
- 🎉 **Session Completion Reports** - Detailed study session summaries
- 📈 **Daily Progress Summaries** - Automated daily learning reports
- 👨‍💼 **Admin Notifications** - Real-time user registration alerts

### 📊 Advanced Analytics
- 📈 **Detailed Progress Tracking** - Problems solved, study time, efficiency metrics
- 📅 **Daily Logs System** - Comprehensive daily study tracking
- 🏆 **Achievement System** - Milestone tracking and badge rewards
- 📱 **Cross-device Sync** - Real-time synchronization across all devices

### 🎨 Professional UI/UX
- 🌙 **Modern Dark Theme** - Eye-friendly design for long study sessions
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile
- 🎯 **Intuitive Navigation** - Smart tab restrictions during active sessions
- ✨ **Smooth Animations** - Professional transitions and interactions

## 🛠️ Professional Tech Stack

### Frontend Architecture
- **Framework**: React 18 + TypeScript + Vite
- **UI Library**: shadcn/ui + Tailwind CSS
- **State Management**: React Query + Custom Hooks
- **Routing**: React Router v6
- **Build Tool**: Vite with optimized production builds

### Backend Infrastructure
- **Database**: Supabase PostgreSQL with advanced schemas
- **Authentication**: Supabase Auth + Google OAuth 2.0
- **Real-time**: Supabase Realtime subscriptions
- **Edge Functions**: Supabase Edge Functions for email services
- **Storage**: Supabase Storage for user data

### Email & Notifications
- **Email Service**: Resend API integration
- **Templates**: Professional HTML email templates
- **Notifications**: Browser Notification API
- **Logging**: Comprehensive email delivery tracking

### Analytics & Tracking
- **Progress Tracking**: Custom analytics engine
- **Session Management**: Advanced timer and session tracking
- **Achievement System**: Milestone and badge tracking
- **Performance Metrics**: Study efficiency calculations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Cloud Console account
- Supabase account
- Resend account (for email features)

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd dsa-daily-boost-main
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret

# Application Configuration
VITE_APP_URL=http://localhost:5173

# Email Service Configuration (for Supabase Edge Functions)
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com

# Supabase Edge Function Environment
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Configure OAuth consent screen
5. Create OAuth 2.0 credentials
6. Add redirect URIs:
   - `http://localhost:5173/auth/callback`
   - `https://yourdomain.com/auth/callback` (for production)

### 4. Supabase Configuration
1. Go to your Supabase project dashboard
2. Navigate to "Authentication" > "Providers"
3. Enable Google provider
4. Add your Google Client ID and Client Secret
5. Set redirect URL: `https://yourproject.supabase.co/auth/v1/callback`

### 5. Database Setup
Run the migrations in your Supabase SQL editor in order:
```sql
-- 1. Basic schema
-- Run: supabase/migrations/20250101000000_create_user_progress.sql

-- 2. Production schema
-- Run: supabase/migrations/20250102000000_production_schema.sql

-- 3. Enhanced features (email, achievements, etc.)
-- Run: supabase/migrations/20250103000000_enhanced_features.sql
```

### 6. Email Service Setup (Optional)
To enable email notifications:

1. Sign up for [Resend](https://resend.com/)
2. Get your API key
3. Deploy the Supabase Edge Function:
```bash
supabase functions deploy send-email
```
4. Set environment variables in Supabase dashboard

### 7. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see your app!

## 📚 Comprehensive DSA Coverage

### 🔢 Arrays & Strings (20+ Topics)
- Array Fundamentals with 500+ LeetCode problems
- Two Pointers Technique with optimization strategies
- Sliding Window (Fixed & Variable) with real-world applications
- String Manipulation with pattern matching algorithms
- Advanced array techniques and memory optimization

### 🔗 Linked Lists (18+ Topics)
- Linked List Fundamentals with implementation details
- Fast & Slow Pointers (Floyd's Algorithm)
- Linked List Reversal (Iterative & Recursive)
- Merge operations and complex manipulations
- Memory management and optimization techniques

### 📚 Stacks & Queues (15+ Topics)
- Stack Fundamentals with LIFO operations
- Monotonic Stack for next greater/smaller elements
- Queue Fundamentals with FIFO operations
- Expression evaluation and parsing
- Advanced stack/queue applications

### 🌳 Trees & Graphs (25+ Topics)
- Binary Tree Fundamentals with traversal algorithms
- Graph Fundamentals with representation methods
- DFS & BFS with optimization techniques
- Advanced tree algorithms and graph theory
- Shortest path and minimum spanning tree algorithms

### 🔍 Searching & Sorting (12+ Topics)
- Binary Search with all variations
- Sorting Algorithms with complexity analysis
- Search optimization techniques
- Custom comparators and advanced sorting

### 💡 Dynamic Programming (20+ Topics)
- DP Fundamentals with memoization and tabulation
- Classic DP problems with optimization
- Advanced DP patterns and state management
- Multi-dimensional DP and space optimization

### 📊 Each Topic Includes:
- **Detailed Preparation Plans** - Short-term (1-2 weeks) and long-term (1-3 months)
- **Multiple Resource Types** - Videos, articles, practice problems, notes
- **Platform Integration** - LeetCode, HackerRank, CodeChef, Codeforces, AtCoder
- **Difficulty Progression** - Beginner → Intermediate → Advanced
- **Time Estimates** - Realistic study time requirements
- **Problem Counts** - Exact number of practice problems available

## 🔧 Available Scripts

### Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build optimized production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint with TypeScript support
- `npm run type-check` - Run TypeScript type checking

### Supabase (if using local development)
- `supabase start` - Start local Supabase instance
- `supabase stop` - Stop local Supabase instance
- `supabase db reset` - Reset database with migrations
- `supabase functions serve` - Serve edge functions locally
- `supabase functions deploy send-email` - Deploy email function

### Deployment
- `npm run build && npm run preview` - Test production build
- `vercel deploy` - Deploy to Vercel
- `netlify deploy` - Deploy to Netlify

## 📁 Professional Project Structure

```
src/
├── components/              # Professional UI components
│   ├── ui/                 # shadcn/ui base components
│   ├── StudyTimer.tsx      # Advanced timer with custom durations
│   ├── TopicCard.tsx       # Comprehensive topic display
│   ├── DailyLogsChart.tsx  # Analytics and progress charts
│   ├── ProfileSettings.tsx # User preference management
│   ├── TimerDurationSelector.tsx # Custom timer selection
│   └── ...
├── data/
│   ├── dsaTopics.ts        # 150+ topics with resources
│   └── dsaRoadmap.ts       # Learning roadmap data
├── hooks/
│   ├── useUserData.ts      # Advanced user data management
│   ├── useStudySession.ts  # Session state management
│   └── useBrowserHistory.ts # Activity tracking
├── services/
│   ├── emailService.ts     # Professional email system
│   ├── progressService.ts  # Progress calculations
│   └── userService.ts      # User management
├── integrations/
│   └── supabase/          # Database client and types
├── pages/
│   ├── Index.tsx          # Main application with tabs
│   ├── Dashboard.tsx      # User dashboard
│   └── ...
supabase/
├── functions/
│   └── send-email/        # Edge function for emails
└── migrations/            # Database schema migrations
```

## 🎯 Key Professional Components

### Enhanced TopicCard
Comprehensive topic display with:
- **Detailed Resource Collections** - Videos, articles, practice problems, notes
- **Preparation Plans** - Short-term and long-term learning strategies
- **Multiple Platform Integration** - 6+ coding platforms with direct links
- **Progress Analytics** - Detailed statistics and efficiency metrics
- **Expandable Sections** - Organized resource presentation
- **Professional Styling** - Modern card design with hover effects

### Advanced StudyTimer
Professional timer system featuring:
- **Custom Duration Selection** - 15, 25, 30, 45, 60 minutes + custom
- **Overtime Tracking** - Monitor dedication beyond set duration
- **Session Analytics** - Real-time performance metrics
- **Email Notifications** - Automated session completion reports
- **Motivational Elements** - Quotes and achievement tracking
- **Browser Notifications** - Desktop alerts for session completion

### Comprehensive useUserData Hook
Advanced user data management:
- **Multi-table Data Fetching** - Progress, sessions, achievements, streaks
- **Email Integration** - Welcome emails and admin notifications
- **Achievement System** - Automatic milestone detection and rewards
- **Learning Streaks** - Daily, weekly, and monthly streak tracking
- **Advanced Analytics** - Efficiency calculations and trend analysis
- **Real-time Synchronization** - Cross-device data consistency

### Professional Email Service
Enterprise-grade email system:
- **Template Engine** - Beautiful HTML email templates
- **Multiple Email Types** - Welcome, completion, summary, admin notifications
- **Delivery Tracking** - Comprehensive email logging and status tracking
- **Error Handling** - Robust error management and retry logic
- **Personalization** - Dynamic content based on user data
- **Professional Design** - Mobile-responsive email templates

## 🔐 Professional Authentication Flow

### Initial Sign-In Process
1. User clicks "Sign in with Google"
2. Redirected to Google OAuth consent screen
3. User authorizes the application
4. Google redirects back with authorization code
5. Supabase exchanges code for access token
6. **New User Detection** - Check if first-time user
7. **Welcome Email Sent** - Professional onboarding email
8. **Admin Notification** - Real-time admin alert
9. User session created with profile initialization
10. **Data Loading** - Progress, achievements, streaks loaded

### Session Management
- **Persistent Sessions** - Automatic session restoration
- **Cross-device Sync** - Real-time data synchronization
- **Security Policies** - Row Level Security (RLS) enforcement
- **Token Refresh** - Automatic token renewal
- **Logout Handling** - Clean session termination

## 📊 Advanced Progress Tracking

### Comprehensive Metrics
- **Problems Solved** - Per topic and overall count
- **Study Time** - Actual time spent vs. timer duration
- **Overtime Tracking** - Dedication beyond set timer
- **Session Efficiency** - Performance calculations
- **Learning Streaks** - Daily, weekly, monthly tracking
- **Achievement Milestones** - Automated badge system
- **Topic Mastery** - Progress across difficulty levels
- **Platform Usage** - Multi-platform activity tracking

### Analytics Dashboard
- **Daily Summary Cards** - Today's progress overview
- **Weekly Progress Charts** - Visual trend analysis
- **All-time Statistics** - Comprehensive lifetime metrics
- **Efficiency Tracking** - Study effectiveness measurement
- **Goal Progress** - Weekly and monthly target tracking
- **Recent Activity** - Latest study sessions and achievements

### Email Reports
- **Session Completion** - Detailed session summaries
- **Daily Summaries** - End-of-day progress reports
- **Weekly Digests** - Comprehensive weekly analysis
- **Achievement Notifications** - Milestone celebration emails
- **Streak Alerts** - Streak maintenance reminders

## 🚀 Professional Deployment

### Production Build
```bash
# Install dependencies
npm install

# Build optimized production bundle
npm run build

# Test production build locally
npm run preview
```

### Environment Variables for Production
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://yourproject.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key

# Google OAuth (Production)
VITE_GOOGLE_CLIENT_ID=your_production_client_id
VITE_APP_URL=https://yourdomain.com

# Email Service (Supabase Edge Functions)
RESEND_API_KEY=your_production_resend_key
FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
SUPABASE_SERVICE_ROLE_KEY=your_production_service_key
```

### Deployment Options

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

#### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
netlify deploy --prod --dir=dist
```

#### GitHub Pages
```bash
# Already configured with GitHub Actions
# Push to main branch to auto-deploy
git push origin main
```

### Post-Deployment Checklist
- ✅ Verify Google OAuth redirect URIs
- ✅ Test email notifications
- ✅ Confirm database migrations
- ✅ Validate Supabase RLS policies
- ✅ Test cross-device synchronization
- ✅ Verify responsive design on all devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Professional Support

### Troubleshooting Guide

#### Common Issues
1. **Authentication Problems**
   - Verify Google OAuth redirect URIs
   - Check Supabase Auth configuration
   - Ensure environment variables are correct

2. **Email Notifications Not Working**
   - Verify Resend API key configuration
   - Check Supabase Edge Function deployment
   - Confirm email service environment variables

3. **Timer Issues**
   - Clear browser localStorage if timer state is corrupted
   - Check browser notification permissions
   - Verify session state management

4. **Database Connection Issues**
   - Verify Supabase URL and keys
   - Check RLS policies are correctly configured
   - Ensure migrations are applied in order

#### Debug Steps
1. Check browser console for error messages
2. Verify network requests in DevTools
3. Test with different browsers/devices
4. Check Supabase dashboard for logs
5. Verify all environment variables

#### Getting Help
- 📖 Check the comprehensive [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- 🐛 Report bugs via [GitHub Issues](https://github.com/yourusername/dsa-daily-boost/issues)
- 💬 Ask questions in [GitHub Discussions](https://github.com/yourusername/dsa-daily-boost/discussions)
- 📧 Contact support: support@dsadailyboost.com

#### Performance Optimization
- Enable browser caching for better performance
- Use production builds for deployment
- Optimize images and assets
- Monitor Supabase usage and quotas

## 🏆 Professional Features Summary

### 📊 Analytics & Tracking
- **150+ DSA Topics** with comprehensive resource collections
- **Custom Timer System** with 15-60+ minute durations
- **Overtime Tracking** for dedication measurement
- **Email Notifications** with professional templates
- **Achievement System** with milestone tracking
- **Learning Streaks** with daily/weekly/monthly tracking
- **Session Analytics** with efficiency calculations
- **Cross-device Sync** with real-time updates

### 🎯 Learning Resources
- **6+ Coding Platforms** - LeetCode, HackerRank, CodeChef, Codeforces, AtCoder, InterviewBit
- **Multiple Resource Types** - Videos, articles, practice problems, notes
- **Preparation Plans** - Short-term and long-term strategies
- **Learning Roadmap** - Beginner to Advanced progression
- **Motivational System** - Daily quotes and achievements

### 💼 Professional Quality
- **Enterprise-grade Architecture** - Scalable and maintainable
- **Modern Tech Stack** - React 18, TypeScript, Supabase
- **Professional UI/UX** - Dark theme, responsive design
- **Email Integration** - Resend API with HTML templates
- **Advanced Database** - PostgreSQL with RLS policies
- **Edge Functions** - Serverless email processing

## 🙏 Acknowledgments

- [Striver](https://www.youtube.com/@takeUforward) for the comprehensive DSA content and A2Z course
- [TakeUForward](https://takeuforward.org/) for the excellent learning resources
- [Supabase](https://supabase.com/) for the powerful backend infrastructure
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful and accessible UI components
- [Resend](https://resend.com/) for the reliable email delivery service
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide Icons](https://lucide.dev/) for the comprehensive icon library

## 📞 Support & Contact

For support, feature requests, or contributions:
- 📧 Email: support@dsadailyboost.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/dsa-daily-boost/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/dsa-daily-boost/discussions)
- 📖 Documentation: [Wiki](https://github.com/yourusername/dsa-daily-boost/wiki)

---

**Built with ❤️ for the programming community**

Happy coding and best of luck with your DSA journey! 🚀✨