# Smart Documents Processing

AI-powered document analysis, validation, and automated application processing system with real-time dashboard and comprehensive reporting.

## Features

### Dashboard
- **Real-time Statistics**: View total applications, eligibility rates, approval rates, and pending reviews
- **Advanced Search**: Search by applicant name or application number
- **Smart Filters**: Filter by eligibility status and recommendation
- **Comprehensive Table View**: See all applications with key metrics at a glance
- **Action Buttons**: Quick access to details, JSON data, missing documents, and validation results

### Document Upload
- **Batch Upload**: Upload multiple PDF documents simultaneously
- **Parallel Processing**: Files are uploaded to S3 in parallel for faster processing
- **Progress Tracking**: Real-time upload progress and status updates
- **Session Management**: Automatic session ID generation for tracking

### Application Analysis
- **Eligibility Assessment**: Automated eligibility determination based on requirements
- **Document Validation**: Cross-reference application data with uploaded documents
- **Missing Document Detection**: Identify missing or incomplete documentation
- **CGPA Calculation**: Automatic academic performance analysis
- **Recommendation Engine**: AI-powered approval recommendations

### Detailed Views
- **Application Details**: Complete applicant information and assessment results
- **JSON Export**: View and download complete application data in JSON format
- **Missing Documents Report**: Detailed report of missing and available documents
- **Validation Results**: Comprehensive validation with matches, discrepancies, and warnings

## Technology Stack

- **Frontend**: React with custom hooks and state management
- **Backend**: AWS Lambda + API Gateway
- **Storage**: Amazon S3 for document storage
- **Processing**: AWS Textract for document analysis
- **Database**: DynamoDB for application data

## Setup Instructions

### 1. Environment Configuration

Add the Smart Documents API URL to your `.env` file:

```env
REACT_APP_SMART_DOCS_API_URL=https://s6ctgi38yi.execute-api.ap-south-1.amazonaws.com/dev
```

### 2. API Endpoints

The system uses the following API endpoints:

- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/applications` - List applications with filters
- `POST /api/applications/search` - Search applications
- `GET /api/applications/{actorId}/{sessionId}` - Application details
- `GET /api/applications/{actorId}/{sessionId}/missing-docs` - Missing documents
- `GET /api/applications/{actorId}/{sessionId}/validation-results` - Validation results
- `POST /upload` - Upload documents

### 3. Run the Application

```bash
npm start
```

Navigate to `/data-extraction/smart-documents` in your portal.

## Usage Guide

### Uploading Documents

1. Click on "Upload Documents" tab
2. Click "Choose PDF Files" or drag and drop files
3. Review selected files
4. Click "Upload X Files" to start processing
5. Wait for confirmation that files are uploaded and processing has started

### Viewing Dashboard

1. Click on "Dashboard" tab
2. View overall statistics in the cards at the top
3. Use search bar to find specific applications
4. Apply filters to narrow down results
5. Click action buttons to view detailed information

### Understanding Status Badges

- **ELIGIBLE** (Green): Applicant meets all requirements
- **NOT_ELIGIBLE** (Red): Applicant doesn't meet requirements
- **PENDING** (Yellow): Awaiting additional information

### Recommendation Types

- **APPROVE** (Green): Recommended for approval
- **HOLD_FOR_VERIFICATION** (Yellow): Requires manual verification
- **REVIEW_REQUIRED** (Blue): Needs additional review
- **REJECT** (Red): Not recommended for approval

## Features Breakdown

### Statistics Cards

- **Total Applications**: Count of all processed applications
- **Eligible Applications**: Number and percentage of eligible applicants
- **Approved**: Number and percentage of approved applications
- **Pending Review**: Applications requiring manual review

### Search & Filter

- Search by applicant name or application number
- Filter by eligibility status (All, Eligible, Not Eligible, Pending)
- Filter by recommendation (All, Approved, Hold, Review, Reject)
- Real-time results update

### Application Details Modal

Shows comprehensive information including:
- Basic applicant information
- Assessment results with confidence levels
- Academic performance metrics
- Processing statistics

### JSON View Modal

- Complete application data in JSON format
- Copy to clipboard functionality
- Download as JSON file
- Syntax-highlighted display

### Missing Documents Modal

- List of missing required documents
- List of available documents
- Validation warnings and detailed warnings
- Document status summary
- Downloadable text report

### Validation Results Modal

- Validation summary with overall status
- Matched fields with confidence scores
- Discrepancies with severity levels
- Validation warnings
- Eligibility assessment with requirements
- Downloadable validation report

## API Response Structure

### Dashboard Stats
```json
{
  "overview": {
    "total_applications": 100,
    "eligible_applications": 75,
    "eligibility_rate": 75.0,
    "approved_applications": 60,
    "approval_rate": 60.0,
    "hold_for_verification": 10,
    "review_required": 5
  }
}
```

### Application Object
```json
{
  "actor_id": "actor_123",
  "session_id": "sess_456",
  "applicant_name": "John Doe",
  "application_number": "APP2024001",
  "program": "Computer Science",
  "eligibility_status": "ELIGIBLE",
  "final_recommendation": "APPROVE",
  "academic_performance": {
    "average_cgpa": 8.5,
    "converted_percentage": 85.0
  },
  "processing_timestamp": "2024-01-15T10:30:00Z"
}
```

## Customization

### Styling

All styles are contained in:
- `SmartDocuments.css` - Main app styling
- `Dashboard.css` - Dashboard-specific styles
- `BatchFileUploader.css` - Upload interface styles

### API Configuration

Update the `API_BASE_URL` in `Dashboard.js` and `BatchFileUploader.js` to point to your API Gateway endpoint.

### Branding

Modify the header section in `SmartDocuments.js` to customize:
- Logo and icon
- Application title
- Subtitle text
- Color scheme

## Troubleshooting

### Upload Issues
- Ensure files are in PDF format
- Check file size limits (typically 10MB per file)
- Verify S3 bucket permissions
- Check API Gateway CORS settings

### Dashboard Not Loading
- Verify API endpoint is accessible
- Check browser console for errors
- Ensure authentication is working
- Verify API returns correct JSON format

### Missing Data
- Check if documents have been processed by Textract
- Verify Lambda functions are executing correctly
- Check DynamoDB for stored data
- Review CloudWatch logs for errors

## Performance Optimization

- Applications are loaded in batches (default: 100)
- Parallel file uploads for faster processing
- Lazy loading of detailed views
- Optimized re-renders with React hooks

## Security Considerations

- All API calls require authentication
- S3 presigned URLs for secure uploads
- HTTPS-only communication
- User-specific data isolation

## Future Enhancements

- Real-time notifications for processing completion
- Bulk actions (approve/reject multiple applications)
- Advanced analytics and reporting
- Export to Excel/CSV
- Email notifications
- Document preview functionality
- OCR accuracy improvements
- Multi-language support

## Credits

Built for enterprise document processing and application management.
Powered by AWS services and React.
