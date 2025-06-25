export class VoiceRecognition {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.onResult = null;
    this.onError = null;
    this.onStart = null;
    this.onEnd = null;

    if ('webkitSpeechRecognition' in window) {
      this.recognition = new window.webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
      this.recognition = new window.SpeechRecognition();
    }

    if (this.recognition) {
      this.setupRecognition();
    }
  }

  setupRecognition() {
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.onStart) this.onStart();
    };

    this.recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (this.onResult) {
        this.onResult(finalTranscript, interimTranscript);
      }
    };

    this.recognition.onerror = (event) => {
      if (this.onError) this.onError(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onEnd) this.onEnd();
    };
  }

  start() {
    if (this.recognition && !this.isListening) {
      this.recognition.start();
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  isSupported() {
    return !!this.recognition;
  }
}

export class TextToSpeech {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.loadVoices();
  }

  loadVoices() {
    this.voices = this.synth.getVoices();
    if (this.voices.length === 0) {
      this.synth.onvoiceschanged = () => {
        this.voices = this.synth.getVoices();
      };
    }
  }

  speak(text, options = {}) {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set options
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;
    
    // Set voice
    if (options.voice && this.voices.length > 0) {
      const voice = this.voices.find(v => v.name === options.voice);
      if (voice) utterance.voice = voice;
    }

    this.synth.speak(utterance);
    return utterance;
  }

  stop() {
    this.synth.cancel();
  }

  getVoices() {
    return this.voices;
  }

  isSupported() {
    return 'speechSynthesis' in window;
  }
}