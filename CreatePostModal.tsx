import React, { useState } from 'react';
import { X, Camera, Image } from 'lucide-react';

const CreatePostModal = ({ onClose, onCreatePost }: { onClose: () => void, onCreatePost: (post: { text: string, image?: string }) => void }) => {
  const [postText, setPostText] = useState('');
  const [postImage, setPostImage] = useState(''); // Сюда будем сохранять URL картинки

  const handleSubmit = () => {
    if (postText.trim() || postImage.trim()) {
      onCreatePost({ text: postText, image: postImage });
      onClose(); // Закрываем окно после создания поста
    }
  };

  return (
    <div className="modal-overlay">
      <div className="create-post-modal">
        <div className="modal-header">
          <h3>Предложить новость</h3>
          <X onClick={onClose} style={{cursor: 'pointer'}} />
        </div>
        
        <textarea 
          placeholder="Что у тебя нового?"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
        ></textarea>

        {postImage && (
          <div className="image-preview">
            <img src={postImage} alt="Предпросмотр" />
            <X size={20} className="remove-image" onClick={() => setPostImage('')} />
          </div>
        )}

        <div className="modal-actions">
          <button className="media-btn" onClick={() => setPostImage('https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&auto=format&fit=crop&q=60')}>
            <Image size={20} /> Фото
          </button>
          {/* Пока что видео будет подставлять то же фото */}
          <button className="media-btn" onClick={() => setPostImage('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&auto=format&fit=crop&q=60')}>
            <Camera size={20} /> Видео
          </button>
          <button className="post-submit-btn" onClick={handleSubmit}>Опубликовать</button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;