import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { Hobby } from '../types/hobby';
import { setHobbies } from '../redux/hobbySlice';

const Sidebar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const hobbies = useSelector((state: RootState) => state.hobbies.hobbies);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchHobbies = async () => {
      const fetchedHobbies = await fetchHobbies();
      dispatch(setHobbies(fetchedHobbies));
    };
    fetchHobbies();
  }, [dispatch]);

  const handleDragStart = (e: React.DragEvent, hobby: Hobby) => {
    e.dataTransfer.setData('hobby', JSON.stringify(hobby));
  };

  const filteredHobbies = hobbies.filter((hobby) =>
    hobby.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ width: '300px', padding: '10px', border: '1px solid #ddd' }}>
      <h3>Available Hobbies</h3>
      <input
        type="text"
        placeholder="Search hobbies"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
      />
      {filteredHobbies.map((hobby) => (
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
