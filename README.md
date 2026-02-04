# GenAI Enterprise Portal

A professional React-based portal for managing and accessing company GenAI projects with enterprise-grade security and authentication.

## Features

- **Enterprise UI Design** - Professional, corporate-grade interface
- **AWS Cognito Authentication** - Secure user authentication and authorization
- **Cross-Domain Security** - JWT token-based secure project access
- **Team Management** - Organize projects by teams (Sales, Marketing, Support, etc.)
- **Real-time Analytics** - Project progress tracking and team statistics
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Modern Tech Stack** - React 18, Tailwind CSS, Framer Motion animations

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure AWS Cognito**
   Update the `amplifyConfig` in `src/App.js` with your AWS Cognito settings:
   ```javascript
   const amplifyConfig = {
     Auth: {
       Cognito: {
         region: 'your-region',
         userPoolId: 'your-user-pool-id',
         userPoolClientId: 'your-app-client-id',
       }
     }
   };
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Security Implementation

### JWT Token Authentication
- Generates secure tokens for cross-domain access
- Time-limited tokens (configurable expiration)
- Domain validation to prevent unauthorized access

### Cross-Domain Access Flow
1. User authenticates via AWS Cognito
2. Portal generates JWT token with project permissions
3. Token includes authorized domains and user context
4. External projects validate token before granting access

## Project Structure

```
src/
├── components/
│   ├── Dashboard.js      # Main dashboard layout
│   ├── Header.js         # Navigation header with user menu
│   ├── ProjectCard.js    # Individual project cards
│   ├── ProjectGrid.js    # Projects grid layout
│   ├── ProjectModal.js   # Detailed project view modal
│   ├── StatsCards.js     # Analytics dashboard cards
│   ├── TeamSection.js    # Team filter navigation
│   └── Login.js          # Authentication page
├── App.js               # Main app component with routing
├── index.js             # React app entry point
└── index.css            # Global styles and Tailwind config
```

## Customization

### Adding New Projects
Update the `projects` array in `src/components/ProjectGrid.js`:

```javascript
{
  id: 9,
  title: 'Your Project Name',
  description: 'Project description',
  team: 'engineering', // sales, marketing, support, engineering, design
  status: 'active', // active, development, beta, maintenance
  url: 'https://your-project.company.com',
  lastUpdated: '1 hour ago',
  members: 5,
  progress: 75,
  tags: ['AI', 'Machine Learning', 'Analytics']
}
```

### Styling Customization
- Colors: Update `tailwind.config.js` primary color palette
- Fonts: Modify font family in `tailwind.config.js`
- Components: Edit component styles in `src/index.css`

### Team Configuration
Add new teams in `src/components/TeamSection.js`:

```javascript
{
  id: 'new-team',
  name: 'New Team',
  icon: YourIcon,
  count: 3,
  color: 'bg-indigo-500'
}
```

## Production Deployment

1. **Environment Variables**
   Create `.env.production` with your production AWS Cognito config

2. **Build Optimization**
   ```bash
   npm run build
   ```

3. **Deploy to AWS S3 + CloudFront**
   - Upload build files to S3 bucket
   - Configure CloudFront distribution
   - Set up custom domain with SSL certificate

4. **Security Headers**
   Configure CloudFront to add security headers:
   - Content-Security-Policy
   - X-Frame-Options
   - X-Content-Type-Options

## Security Best Practices

- Always use HTTPS in production
- Implement proper CORS policies
- Set up rate limiting on authentication endpoints
- Regular security audits and dependency updates
- Monitor authentication logs and failed attempts

## Support

For technical support or feature requests, contact your development team or create an issue in the project repository.