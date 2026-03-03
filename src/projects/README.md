# Projects Folder Structure

This folder contains all individual project components organized by section.

## Folder Structure

```
src/projects/
├── healthcare/
│   ├── RecruiterAI.js
│   ├── MedicalDiagnosis.js
│   └── PatientCare.js
├── data-extraction/
│   ├── DocumentIntelligence.js
│   ├── WebDataHarvester.js
│   └── DatabaseAnalyzer.js
└── other/
    ├── RecruiterAI.js
    ├── ContentGenerator.js
    └── SmartSupportBot.js
```

## How to Add a New Project

### 1. Create Project Component

Create a new file in the appropriate section folder:

```javascript
// src/projects/healthcare/YourProject.js
import React from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Navigate } from 'react-router-dom';

const YourProject = () => {
  const { user } = useAuthenticator();

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Your Project Name
        </h1>
        <p className="text-gray-600 mb-6">
          Welcome, {user?.attributes?.given_name || user?.username}
        </p>
        
        {/* Your project content here */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Add your HTML/JSX content */}
        </div>
      </div>
    </div>
  );
};

export default YourProject;
```

### 2. Add Route in App.js

Import and add the route:

```javascript
// Import
import YourProject from './projects/healthcare/YourProject';

// Add route inside Authenticator
<Route path="/healthcare/your-project" element={<YourProject />} />
```

### 3. Update ProjectGrid.js

Add your project to the projects array:

```javascript
{
  id: 10,
  title: 'Your Project Name',
  description: 'Project description',
  section: 'healthcare',
  status: 'active',
  url: '/healthcare/your-project', // Internal route
  tags: ['Tag1', 'Tag2']
}
```

## Authentication

All projects are automatically protected by AWS Cognito authentication:
- Users must be logged in to access any project
- Authentication state is preserved across all routes
- Unauthenticated users are redirected to login page

## URL Structure

Projects follow this URL pattern:
- `domain.com/healthcare/recruiterai`
- `domain.com/data-extraction/document-intelligence`
- `domain.com/other/recruiterai`

## Benefits

✅ **Organized Structure**: Easy to find and edit project files
✅ **Authentication Preserved**: All routes protected automatically
✅ **Scalable**: Easy to add new projects
✅ **Maintainable**: Each project in its own file
✅ **Section-based**: Projects grouped by business area
