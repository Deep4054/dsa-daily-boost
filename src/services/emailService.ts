import { supabase } from '@/integrations/supabase/client';

export interface EmailNotification {
  to: string;
  subject: string;
  html: string;
  type: 'welcome' | 'timer_complete' | 'daily_summary' | 'achievement' | 'admin_notification';
}

export const emailService = {
  // Send welcome email when user signs in
  async sendWelcomeEmail(userEmail: string, userName: string) {
    const emailData: EmailNotification = {
      to: userEmail,
      subject: '🚀 Welcome to DSA Daily Boost - Your Coding Journey Begins!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to DSA Daily Boost</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
            .content { padding: 40px 30px; }
            .welcome-message { font-size: 18px; margin-bottom: 25px; color: #2c3e50; }
            .features { background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; }
            .feature-item { display: flex; align-items: center; margin: 15px 0; }
            .feature-icon { width: 24px; height: 24px; margin-right: 15px; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; margin: 20px 0; transition: transform 0.2s; }
            .cta-button:hover { transform: translateY(-2px); }
            .stats { display: flex; justify-content: space-around; margin: 30px 0; }
            .stat-item { text-align: center; }
            .stat-number { font-size: 24px; font-weight: 700; color: #667eea; }
            .stat-label { font-size: 14px; color: #666; }
            .footer { background: #2c3e50; color: white; padding: 20px; text-align: center; font-size: 14px; }
            .social-links { margin: 15px 0; }
            .social-links a { color: white; text-decoration: none; margin: 0 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 Welcome to DSA Daily Boost!</h1>
              <p>Your journey to mastering Data Structures & Algorithms starts now</p>
            </div>
            
            <div class="content">
              <div class="welcome-message">
                <p>Hi <strong>${userName}</strong>,</p>
                <p>Welcome to DSA Daily Boost! We're thrilled to have you join our community of passionate programmers who are committed to mastering Data Structures and Algorithms.</p>
              </div>
              
              <div class="features">
                <h3>🎯 What You Get:</h3>
                <div class="feature-item">
                  <span class="feature-icon">📚</span>
                  <span><strong>Comprehensive Learning Path:</strong> 100+ topics with Striver's video explanations</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">⏱️</span>
                  <span><strong>Smart Timer System:</strong> Customizable study sessions with progress tracking</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">📊</span>
                  <span><strong>Progress Analytics:</strong> Detailed insights into your learning journey</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">🏆</span>
                  <span><strong>Achievement System:</strong> Earn badges and track milestones</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">💡</span>
                  <span><strong>Daily Challenges:</strong> Fresh problems to keep you engaged</span>
                </div>
              </div>
              
              <div class="stats">
                <div class="stat-item">
                  <div class="stat-number">100+</div>
                  <div class="stat-label">DSA Topics</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">2000+</div>
                  <div class="stat-label">Practice Problems</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">50+</div>
                  <div class="stat-label">Hours of Content</div>
                </div>
              </div>
              
              <div style="text-align: center;">
                <a href="${import.meta.env.VITE_APP_URL || 'http://localhost:5173'}" class="cta-button">
                  Start Your Journey 🚀
                </a>
              </div>
              
              <div style="margin-top: 30px; padding: 20px; background: #e8f4fd; border-radius: 8px;">
                <h4>💡 Pro Tips for Success:</h4>
                <ul style="margin: 0; padding-left: 20px;">
                  <li>Set a daily study goal (recommended: 1-2 hours)</li>
                  <li>Use the timer feature to maintain focus</li>
                  <li>Practice problems on multiple platforms</li>
                  <li>Review and revise regularly</li>
                  <li>Join our community discussions</li>
                </ul>
              </div>
            </div>
            
            <div class="footer">
              <p>Happy Coding! 🎯</p>
              <p>The DSA Daily Boost Team</p>
              <div class="social-links">
                <a href="#">📧 Support</a> | 
                <a href="#">📱 Community</a> | 
                <a href="#">📖 Blog</a>
              </div>
              <p style="font-size: 12px; margin-top: 15px;">
                You received this email because you signed up for DSA Daily Boost. 
                <a href="#" style="color: #bbb;">Unsubscribe</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      type: 'welcome'
    };

    return this.sendEmail(emailData);
  },

  // Send timer completion email
  async sendTimerCompleteEmail(userEmail: string, userName: string, sessionData: {
    duration: number;
    problemsSolved: number;
    topicStudied: string;
    overtime: number;
  }) {
    const emailData: EmailNotification = {
      to: userEmail,
      subject: '🎉 Study Session Complete - Great Work!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Study Session Complete</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
            .content { padding: 40px 30px; }
            .session-summary { background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; }
            .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
            .stat-card { background: white; padding: 20px; border-radius: 8px; text-align: center; border: 2px solid #e9ecef; }
            .stat-value { font-size: 24px; font-weight: 700; color: #4facfe; }
            .stat-label { font-size: 14px; color: #666; margin-top: 5px; }
            .achievement-badge { background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%); color: #2d3436; padding: 10px 20px; border-radius: 20px; display: inline-block; margin: 10px 5px; font-weight: 600; }
            .motivation-quote { font-style: italic; text-align: center; color: #636e72; margin: 25px 0; padding: 20px; background: #f1f2f6; border-radius: 8px; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; margin: 20px 0; }
            .footer { background: #2c3e50; color: white; padding: 20px; text-align: center; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Session Complete!</h1>
              <p>Congratulations on completing your study session</p>
            </div>
            
            <div class="content">
              <p>Hi <strong>${userName}</strong>,</p>
              <p>Fantastic work! You've just completed another productive study session. Here's a summary of your achievements:</p>
              
              <div class="session-summary">
                <h3>📊 Session Summary</h3>
                <div class="stat-grid">
                  <div class="stat-card">
                    <div class="stat-value">${sessionData.duration} min</div>
                    <div class="stat-label">Study Time</div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-value">${sessionData.problemsSolved}</div>
                    <div class="stat-label">Problems Solved</div>
                  </div>
                </div>
                <p><strong>Topic Studied:</strong> ${sessionData.topicStudied}</p>
                ${sessionData.overtime > 0 ? `<p><strong>Overtime:</strong> +${sessionData.overtime} minutes (Great dedication! 🔥)</p>` : ''}
              </div>
              
              <div style="text-align: center;">
                ${sessionData.problemsSolved >= 5 ? '<span class="achievement-badge">🏆 Problem Solver</span>' : ''}
                ${sessionData.overtime > 0 ? '<span class="achievement-badge">⚡ Overtime Champion</span>' : ''}
                ${sessionData.duration >= 60 ? '<span class="achievement-badge">🎯 Focus Master</span>' : ''}
              </div>
              
              <div class="motivation-quote">
                "The expert in anything was once a beginner who refused to give up."
              </div>
              
              <div style="text-align: center;">
                <a href="${import.meta.env.VITE_APP_URL || 'http://localhost:5173'}" class="cta-button">
                  Continue Learning 📚
                </a>
              </div>
              
              <div style="margin-top: 30px; padding: 20px; background: #e8f4fd; border-radius: 8px;">
                <h4>🎯 Keep the momentum going:</h4>
                <ul style="margin: 0; padding-left: 20px;">
                  <li>Review what you learned today</li>
                  <li>Try similar problems on different platforms</li>
                  <li>Set tomorrow's study goal</li>
                  <li>Share your progress with the community</li>
                </ul>
              </div>
            </div>
            
            <div class="footer">
              <p>Keep up the excellent work! 🚀</p>
              <p>The DSA Daily Boost Team</p>
            </div>
          </div>
        </body>
        </html>
      `,
      type: 'timer_complete'
    };

    return this.sendEmail(emailData);
  },

  // Send admin notification when user signs in
  async sendAdminNotification(userEmail: string, userName: string, userMetadata: any) {
    // Note: For better security, the admin email should ideally be determined by the
    // server-side edge function, not passed from the client.
    // This implementation uses a client-side environment variable as a compromise.
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    if (!adminEmail) {
      console.error("Admin email is not configured. Skipping admin notification.");
      return;
    }
    
    const emailData: EmailNotification = {
      to: adminEmail,
      subject: '🔔 New User Registration - DSA Daily Boost',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New User Registration</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
            .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; }
            .user-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .info-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #e9ecef; }
            .label { font-weight: 600; color: #495057; }
            .value { color: #6c757d; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🔔 New User Registration</h2>
              <p>DSA Daily Boost Platform</p>
            </div>
            
            <div class="content">
              <p>A new user has registered on the DSA Daily Boost platform:</p>
              
              <div class="user-info">
                <h3>User Information</h3>
                <div class="info-row">
                  <span class="label">Name:</span>
                  <span class="value">${userName}</span>
                </div>
                <div class="info-row">
                  <span class="label">Email:</span>
                  <span class="value">${userEmail}</span>
                </div>
                <div class="info-row">
                  <span class="label">Registration Time:</span>
                  <span class="value">${new Date().toLocaleString()}</span>
                </div>
                <div class="info-row">
                  <span class="label">Provider:</span>
                  <span class="value">Google OAuth</span>
                </div>
                ${userMetadata?.avatar_url ? `
                <div class="info-row">
                  <span class="label">Avatar:</span>
                  <span class="value"><img src="${userMetadata.avatar_url}" alt="User Avatar" style="width: 40px; height: 40px; border-radius: 50%;"></span>
                </div>
                ` : ''}
              </div>
              
              <p>The user has been automatically sent a welcome email and their profile has been created in the system.</p>
              
              <div style="margin-top: 30px; padding: 15px; background: #d4edda; border-radius: 8px; color: #155724;">
                <strong>Action Required:</strong> No immediate action needed. The user can now access all platform features.
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      type: 'admin_notification'
    };

    return this.sendEmail(emailData);
  },

  // Send daily summary email
  async sendDailySummaryEmail(userEmail: string, userName: string, dailyStats: {
    problemsSolved: number;
    studyTime: number;
    topicsStudied: string[];
    streak: number;
  }) {
    const emailData: EmailNotification = {
      to: userEmail,
      subject: '📊 Your Daily Progress Summary - DSA Daily Boost',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Daily Progress Summary</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
            .content { padding: 40px 30px; }
            .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 25px 0; }
            .stat-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; }
            .stat-value { font-size: 28px; font-weight: 700; color: #667eea; }
            .stat-label { font-size: 14px; color: #666; margin-top: 5px; }
            .topics-list { background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .streak-badge { background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%); color: #2d3436; padding: 15px 25px; border-radius: 25px; display: inline-block; font-weight: 700; font-size: 18px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 Daily Progress Summary</h1>
              <p>${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            
            <div class="content">
              <p>Hi <strong>${userName}</strong>,</p>
              <p>Here's a summary of your learning progress today:</p>
              
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-value">${dailyStats.problemsSolved}</div>
                  <div class="stat-label">Problems Solved</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">${dailyStats.studyTime}</div>
                  <div class="stat-label">Minutes Studied</div>
                </div>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <div class="streak-badge">
                  🔥 ${dailyStats.streak} Day Streak
                </div>
              </div>
              
              ${dailyStats.topicsStudied.length > 0 ? `
              <div class="topics-list">
                <h3>📚 Topics Studied Today:</h3>
                <ul>
                  ${dailyStats.topicsStudied.map(topic => `<li>${topic}</li>`).join('')}
                </ul>
              </div>
              ` : ''}
              
              <div style="margin-top: 30px; padding: 20px; background: #d4edda; border-radius: 8px;">
                <h4>🎯 Tomorrow's Goal:</h4>
                <p>Keep the momentum going! Try to solve ${Math.max(dailyStats.problemsSolved, 3)} problems and study for ${Math.max(dailyStats.studyTime, 30)} minutes.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      type: 'daily_summary'
    };

    return this.sendEmail(emailData);
  },

  // Generic email sending function
  async sendEmail(emailData: EmailNotification) {
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: emailData
      });

      if (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
      }

      console.log('Email sent successfully:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Email service error:', error);
      return { success: false, error };
    }
  }
};