import React from 'react';
import useSpeechInput from '../hooks/useSpeechInput';

export default function MicButton({ onResult, className = '' }) {
  const { listening, error, supported, toggle } = useSpeechInput(onResult);

  if (!supported) return null;

  return (
    <div className="relative flex items-center">
      <button
        type="button"
        onClick={toggle}
        title={listening ? 'Stop recording' : 'Start voice input'}
        className={`flex items-center justify-center rounded-lg transition-all duration-200 ${
          listening
            ? 'bg-red-500 text-white shadow-md scale-105'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
        } ${className}`}
      >
        {listening ? (
          /* Animated mic-off icon */
          <span className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            Listening...
          </span>
        ) : (
          <span className="p-2 text-base">🎤</span>
        )}
      </button>

      {/* Error tooltip */}
      {error && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs rounded-lg px-3 py-1.5 whitespace-nowrap shadow-lg z-10">
          {error}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-red-600" />
        </div>
      )}
    </div>
  );
}
