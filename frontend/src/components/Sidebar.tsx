import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const Sidebar = () => {
    const [filter, setFilter] = useState('');
    const users = useSelector((state: RootState) => state.users.users);
    const allHobbies = Array.from(new Set(users.flatMap(user => user.hobbies)));
    const filteredHobbies = allHobbies.filter(hobby => hobby.toLowerCase().includes(filter.toLowerCase()));

    const handleDragStart = (event, hobby) => {
        event.dataTransfer.setData("application/reactflow", hobby);
        event.dataTransfer.effectAllowed = "move";
    };

    return (
        <aside style={{ width: '250px', padding: '20px', background: '#f0f0f0' }}>
            <input
                type="text"
                placeholder="Search hobbies"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{ marginBottom: '10px', width: '100%', padding: '5px' }}
            />
            <ul>
                {filteredHobbies.map((hobby, index) => (
                    <li key={index} draggable onDragStart={(e) => handleDragStart(e, hobby)}>
                        {hobby}
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default Sidebar;
