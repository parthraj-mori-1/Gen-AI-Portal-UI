# VoiceBot - CloudTutor India

A real-time AI voice assistant powered by Google Gemini 2.5 Live API for Google Cloud Platform tutoring with Indian English accent.

## Features

- **Real-time Voice Interaction**: Ultra-low latency voice conversations using Gemini 2.5 Flash Native Audio
- **Indian Context**: Uses Indian analogies and examples for better understanding
- **Live Audio Visualization**: Real-time audio waveform visualization
- **Barge-in Support**: Natural interruption handling during conversations
- **Educational Focus**: Specialized in Google Cloud Platform concepts and tutorials

## Technology Stack

- **AI Model**: Google Gemini 2.5 Flash (`gemini-2.5-flash-native-audio-preview-09-2025`)
- **Audio Processing**: Web Audio API with native PCM streaming
- **Voice**: Indian English (Female) - "Kore" voice preset
- **Framework**: React with custom audio service layer

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install the required `@google/genai` package along with other dependencies.

### 2. Configure API Key

Add your Gemini API key to the `.env` file:

```env
REACT_APP_GEMINI_API_KEY=your-gemini-api-key-here
```

To get a Gemini API key:
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy and paste it into your `.env` file

### 3. Run the Application

```bash
npm start
```

Navigate to `/other/voicebot` in your portal to access the VoiceBot.

## Usage

1. Click the microphone button to start a conversation
2. Speak naturally about Google Cloud Platform topics
3. The AI tutor (Dhvani) will respond in real-time with explanations using Indian context
4. Click the microphone button again to disconnect

## Architecture

### Components

- **VoiceBot.js**: Main component handling UI and state management
- **Visualizer.js**: Audio waveform visualization component
- **geminiLiveService.js**: Service layer for Gemini Live API integration
- **audioUtils.js**: Audio processing utilities (PCM encoding/decoding)

### Audio Flow

1. **Input**: Microphone → Web Audio API → PCM encoding → Gemini Live API
2. **Output**: Gemini Live API → PCM decoding → Web Audio API → Speakers
3. **Visualization**: Output audio → AnalyserNode → Canvas rendering

## Key Features Explained

### Native Audio Processing

Unlike traditional voice assistants that convert Audio → Text → Audio (high latency), this uses native audio streaming for:
- Response times < 500ms
- Natural conversation flow
- Seamless interruption handling

### Indian Context Tutoring

The AI is instructed to:
- Use Indian analogies (e.g., Mumbai trains for Load Balancing)
- Speak with Indian English accent
- Keep responses conversational and short
- Stay focused on Google Cloud Platform topics

### Optimizations

- Buffer size reduced to 2048 samples (~128ms latency)
- Thinking budget set to 0 for faster responses
- Direct PCM streaming without transcoding

## Use Cases

- **EdTech**: Personalized 1:1 tutoring for technical skills
- **Customer Support**: Next-gen IVR systems with natural conversation
- **Sales & Retail**: Interactive shopping assistants
- **Field Operations**: Hands-free technical assistance

## Browser Compatibility

Requires modern browsers with:
- Web Audio API support
- MediaDevices API (microphone access)
- ES6+ JavaScript support

Tested on:
- Chrome 90+
- Edge 90+
- Safari 14+
- Firefox 88+

## Troubleshooting

### "API Key not found" Error
- Ensure `REACT_APP_GEMINI_API_KEY` is set in your `.env` file
- Restart the development server after adding the key

### Microphone Access Denied
- Check browser permissions for microphone access
- Ensure you're using HTTPS (required for microphone access)

### Connection Errors
- Verify your API key is valid and has Gemini Live API access
- Check your internet connection
- Ensure the Gemini Live API model is available in your region

## Credits

Built by Operisoft.com and AI expert team.
Powered by Google Gemini 2.5 Live API.
