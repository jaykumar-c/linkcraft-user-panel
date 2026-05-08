import { useState } from 'react';
import { useAiStream } from '../../hooks/useAiStream';

export function BioGenerator() {
  const { text, isStreaming, error, generateBio, setText } = useAiStream();
  const [name, setName] = useState('');
  const [profession, setProfession] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');

  const handleGenerate = () => {
    generateBio({ name, profession, tone, length });
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow border border-gray-100 w-full max-w-2xl mx-auto mt-8">
      <h3 className="text-xl font-semibold mb-4">AI Bio Generator</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input 
            type="text" 
            className="w-full border rounded p-2"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Jane Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Profession</label>
          <input 
            type="text" 
            className="w-full border rounded p-2"
            value={profession}
            onChange={e => setProfession(e.target.value)}
            placeholder="e.g. Software Engineer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tone</label>
          <select className="w-full border rounded p-2" value={tone} onChange={e => setTone(e.target.value)}>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="humorous">Humorous</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Length</label>
          <select className="w-full border rounded p-2" value={length} onChange={e => setLength(e.target.value)}>
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
        </div>
      </div>

      <button 
        onClick={handleGenerate}
        disabled={isStreaming || !name || !profession}
        className="w-full bg-blue-600 text-white py-2 rounded font-medium disabled:opacity-50 hover:bg-blue-700 transition"
      >
        {isStreaming ? 'Generating...' : 'Generate Bio'}
      </button>

      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

      {(text || isStreaming) && (
        <div className="mt-6">
          <label className="block text-sm font-medium mb-1">Generated Bio (Edit as needed)</label>
          <textarea 
            className="w-full border rounded p-3 h-32 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={text}
            onChange={e => setText(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
