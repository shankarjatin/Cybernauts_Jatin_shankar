import React from 'react';
import { Hobby } from '../types/hobby';

const Sidebar: React.FC = () => {
  const hobbies: Hobby[] = [
    { id: '1', name: 'Reading' },
    { id: '2', name: 'Coding' },
    { id: '3', name: 'Music' },
    { id: '4', name: 'Gaming' },
  ];

  const handleDragStart = (e: React.DragEvent, hobby: Hobby) => {
    e.dataTransfer.setData('hobby', JSON.stringify(hobby));
  };

  return (
    <div style={{ width: '300px', padding: '10px', border: '1px solid #ddd' }}>
      <h3>Available Hobbies</h3>
      {hobbies.map((hobby) => (
        <div
          key={hobby.id}
          draggable
          onDragStart={(e) => handleDragStart(e, hobby)}
          style={{ padding: '10px', marginBottom: '5px', backgroundColor: '#f0f0f0' }}
        >
          {hobby.name}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
