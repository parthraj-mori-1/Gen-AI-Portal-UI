import { GoogleGenAI } from "@google/genai";
import { base64ToUint8Array, createPcmBlob, decodeAudioData, PCM_SAMPLE_RATE } from "../utils/audioUtils";

const LiveStatus = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  ERROR: 'error',
};

const Modality = {
  AUDIO: 'AUDIO',
  TEXT: 'TEXT',
};

export class GeminiLiveService {
  constructor(apiKey) {
    this.ai = new GoogleGenAI({ apiKey });
    this.inputAudioContext = null;
    this.outputAudioContext = null;
    this.inputSource = null;
    this.processor = null;
    this.outputNode = null;
    this.analyser = null;
    this.nextStartTime = 0;
    this.sources = new Set();
    this.sessionPromise = null;
    this.stream = null;
  }

  async connect(callbacks) {
    try {
      callbacks.onStatusChange(LiveStatus.CONNECTING);

      // Initialize Audio Contexts
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.inputAudioContext = new AudioContext({ sampleRate: PCM_SAMPLE_RATE });
      this.outputAudioContext = new AudioContext({ sampleRate: 24000 });
      
      // Analyser for visualization
      this.analyser = this.outputAudioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.outputNode = this.outputAudioContext.createGain();
      this.outputNode.connect(this.analyser);
      this.analyser.connect(this.outputAudioContext.destination);

      callbacks.onAudioData(this.analyser);

      // Get Microphone Stream
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Connect to Gemini
      this.sessionPromise = this.ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            console.log("Gemini Live Connected");
            callbacks.onStatusChange(LiveStatus.CONNECTED);
            this.startAudioInput();
          },
          onmessage: async (message) => {
            // Handle Audio Output
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && this.outputAudioContext && this.outputNode) {
              const audioData = base64ToUint8Array(base64Audio);
              
              // Sync start time
              this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioContext.currentTime);

              const audioBuffer = await decodeAudioData(
                audioData,
                this.outputAudioContext,
                24000,
                1
              );

              const source = this.outputAudioContext.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(this.outputNode);
              
              source.addEventListener('ended', () => {
                this.sources.delete(source);
              });

              source.start(this.nextStartTime);
              this.nextStartTime += audioBuffer.duration;
              this.sources.add(source);
            }

            // Handle Interruption
            const interrupted = message.serverContent?.interrupted;
            if (interrupted) {
              console.log("Interrupted by user");
              this.sources.forEach(source => {
                try { source.stop(); } catch (e) {}
              });
              this.sources.clear();
              this.nextStartTime = 0;
            }
          },
          onclose: () => {
            console.log("Gemini Live Closed");
            callbacks.onStatusChange(LiveStatus.DISCONNECTED);
          },
          onerror: (err) => {
            console.error("Gemini Live Error", err);
            callbacks.onError(err.toString());
            callbacks.onStatusChange(LiveStatus.ERROR);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          },
          // Optimization: Disable thinking for lower latency
          thinkingConfig: { thinkingBudget: 0 },
          systemInstruction: `
            You are Dhvani, a friendly and expert Google Cloud Platform (GCP) tutor for Indian students. 
            Speak with a clear Indian English accent.
            
            CORE INSTRUCTIONS:
            1. Use Indian analogies (e.g., Mumbai trains for Load Balancing, Tiffins for Storage Buckets).
            2. Keep responses SHORT and CONVERSATIONAL.
            3. STRICTLY LIMIT discussion to Google Cloud Platform.
            
            OFF-TOPIC HANDLING:
            If the user asks about ANY topic outside of GCP (cricket, movies, politics, weather, general life), you must POLITELY REFUSE and BRIDGE back to cloud concepts.
            
            Examples of Smart Bridging:
            - User: "Who won the match yesterday?"
              Dhvani: "I'm not sure about the score, but just like a cricket team needs a captain, a project needs IAM roles. Shall we discuss those?"
            - User: "How do I make Biryani?"
              Dhvani: "That requires a special recipe! Just like deploying an app requires a specific manifest file in Kubernetes. Let's look at GKE."
            - User: "Tell me a joke."
              Dhvani: "I'm better at cloud architecture than comedy! But speaking of reliability, have you checked out Cloud Spanner?"
              
            Always remain polite, warm, but firm on the topic.
          `,
        }
      });

    } catch (error) {
      console.error("Connection failed", error);
      callbacks.onError(error.message || "Failed to connect");
      callbacks.onStatusChange(LiveStatus.ERROR);
    }
  }

  startAudioInput() {
    if (!this.inputAudioContext || !this.stream) return;

    this.inputSource = this.inputAudioContext.createMediaStreamSource(this.stream);
    
    // Optimization: Reduced buffer size from 4096 to 2048 to lower input latency (~128ms)
    this.processor = this.inputAudioContext.createScriptProcessor(2048, 1, 1);
    
    this.processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      const pcmBlob = createPcmBlob(inputData);
      
      this.sessionPromise?.then(session => {
        session.sendRealtimeInput({ media: pcmBlob });
      }).catch(err => {
        console.error("Error sending audio input", err);
      });
    };

    this.inputSource.connect(this.processor);
    this.processor.connect(this.inputAudioContext.destination);
  }

  async disconnect() {
    // Stop Microphone
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    // Stop Processing
    if (this.processor && this.inputSource) {
      this.inputSource.disconnect();
      this.processor.disconnect();
    }

    // Close Contexts
    if (this.inputAudioContext) await this.inputAudioContext.close();
    if (this.outputAudioContext) await this.outputAudioContext.close();
    
    // Reset state
    this.sources.forEach(s => { try { s.stop(); } catch(e){} });
    this.sources.clear();
    this.nextStartTime = 0;
  }
}
