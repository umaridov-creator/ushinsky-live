import { useState } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';

interface CreatePostModalProps {
  onClose: () => void;
  onCreatePost: (post: { text: string; image?: string }) => void;
}

export default function CreatePostModal({ onClose, onCreatePost }: CreatePostModalProps) {
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onCreatePost({ text, image: imageUrl });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-bold text-lg">Новый пост</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <textarea
            className="w-full h-32 p-2 border rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Что у вас нового?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="mt-4">
            <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <ImageIcon size={16} /> Ссылка на фото (необязательно)
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg text-sm"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={!text.trim()}
            className="w-full mt-6 py-3 bg-indigo-600 text-white font-bold rounded-xl disabled:opacity-50 hover:bg-indigo-700 transition-colors"
          >
            Опубликовать
          </button>
        </form>
      </div>
    </div>
  );
}
