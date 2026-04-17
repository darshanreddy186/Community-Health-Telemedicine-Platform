import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import MicButton from '../components/MicButton';

let socket;

export default function Chat() {
  const { roomId } = useParams();
  const { auth } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const bottomRef = useRef();

  useEffect(() => {
    api.get(`/messages/${roomId}`).then(r => setMessages(r.data));

    socket = io(process.env.REACT_APP_SOCKET_URL);
    socket.emit('joinRoom', roomId);
    socket.on('receiveMessage', (msg) => setMessages(prev => [...prev, msg]));

    return () => socket.disconnect();
  }, [roomId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = () => {
    if (!text.trim()) return;
    socket.emit('sendMessage', {
      roomId,
      sender: auth.user.id,
      senderName: auth.user.name,
      text
    });
    setText('');
  };

  return (
    <div className="mt-6 flex flex-col h-[70vh]">
      <h2 className="text-xl font-bold mb-4">Chat</h2>
      <div className="flex-1 border rounded p-4 overflow-y-auto space-y-2 bg-gray-50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.senderName === auth.user.name ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${m.senderName === auth.user.name ? 'bg-blue-500 text-white' : 'bg-white border'}`}>
              <p className="font-semibold text-xs mb-1 opacity-70">{m.senderName}</p>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2 mt-3">
        <input className="input flex-1" placeholder="Type a message..." value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()} />
        <MicButton onResult={(t) => setText(prev => prev ? prev + ' ' + t : t)} />
        <button onClick={send} className="btn">Send</button>
      </div>
    </div>
  );
}
