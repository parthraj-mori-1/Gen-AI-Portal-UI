# Patient Summary Generator

A healthcare application for generating and downloading patient discharge summaries in PDF format.

## Features

- **Patient Selection**: Browse and select from available patients
- **PDF Generation**: Generate comprehensive discharge summaries
- **Secure Download**: Download PDFs directly to your device
- **Real-time Status**: Live updates on processing status
- **Responsive Design**: Works on desktop and mobile devices

## How to Use

1. **Select Patient**: Choose a patient from the dropdown list
2. **Generate PDF**: Click the "Download Discharge PDF" button
3. **Wait for Processing**: The system will generate the PDF (may take up to 60 seconds)
4. **Download**: The PDF will automatically download to your device

## Technical Details

- **Frontend**: React with modern UI components
- **Backend**: AWS Lambda function for PDF generation
- **Authentication**: Integrated with AWS Amplify
- **File Handling**: Secure blob-based PDF downloads

## API Configuration

The application uses the following environment variable:
- `REACT_APP_PATIENT_SUMMARY_API_URL`: Backend API endpoint

## Status Messages

- **Success**: Green messages indicate successful operations
- **Error**: Red messages show errors or issues
- **Loading**: Blue messages indicate processing in progress

## Troubleshooting

- If patients don't load, check the backend API connection
- PDF generation may take time for complex summaries
- Ensure popup blockers are disabled for downloads