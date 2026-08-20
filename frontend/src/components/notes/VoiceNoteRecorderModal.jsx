import React, { useState, useEffect } from 'react';
import { Mic, Square, Save, X, RotateCcw } from 'lucide-react';

export default function VoiceNoteRecorderModal({ isOpen, onClose, onSave }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const r = new SpeechRecognition();
      r.continuous = true;
      r.interimResults = true;
      r.lang = 'en-US';

      r.onresult = (event) => {
        let final = '';
        for (let i = 0; i < event.results.length; ++i) {
          final += event.results[i][0].transcript;
        }
        setTranscript(final);
      };

      r.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };

      setRecognition(r);
    }
  }, []);

  const toggleRecording = () => {
    if (!recognition) return alert('Speech Recognition not supported in this browser.');
    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      setTranscript('');
      recognition.start();
      setIsRecording(true);
    }
  };

  const handleSave = () => {
    if (onSave) onSave(transcript);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Mic className="w-5 h-5 text-indigo-500" />
            Voice Note Recorder
          </h2>
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center">
          <button 
            onClick={toggleRecording}
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 mb-6 border-4 ${
              isRecording 
              ? 'bg-red-500 hover:bg-red-600 border-red-200 dark:border-red-900 animate-pulse' 
              : 'bg-indigo-600 hover:bg-indigo-700 border-indigo-200 dark:border-indigo-900'
            } text-white`}
          >
            {isRecording ? <Square className="w-8 h-8 fill-current" /> : <Mic className="w-8 h-8" />}
          </button>
          
          <div className="w-full min-h-[120px] max-h-48 overflow-y-auto bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
            {transcript || (
              <span className="text-slate-400 italic flex justify-center items-center h-full text-center">
                {isRecording ? 'Listening...' : 'Tap the microphone to start recording'}
              </span>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between">
          <button 
            onClick={() => setTranscript('')}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors font-medium text-sm"
          >
            <RotateCcw className="w-4 h-4" /> Clear
          </button>
          <button 
            onClick={handleSave}
            disabled={!transcript.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm shadow-md"
          >
            <Save className="w-4 h-4" /> Save Note
          </button>
        </div>
      </div>
    </div>
  );
}
