import React from 'react';

const StoryBar = () => {
  const stories = [
    { id: 1, name: 'Умар', img: 'У' },
    { id: 2, name: 'Директор', img: 'Д' },
    { id: 3, name: 'Завуч', img: 'З' },
  ];

  return (
    <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', padding: '10px 0', scrollbarWidth: 'none' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
        <div style={{ width: '65px', height: '65px', borderRadius: '50%', border: '2px dashed #007bff', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#007bff', fontSize: '24px', cursor: 'pointer' }}>+</div>
        <span style={{ fontSize: '12px' }}>Моя</span>
      </div>
      
      {stories.map(s => (
        <div key={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '65px', height: '65px', borderRadius: '50%', background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', padding: '2px' }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: '#007bff' }}>
              {s.img}
            </div>
          </div>
          <span style={{ fontSize: '12px' }}>{s.name}</span>
        </div>
      ))}
    </div>
  );
};

export default StoryBar;