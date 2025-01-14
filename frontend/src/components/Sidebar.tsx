import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Search } from 'lucide-react';

const Sidebar = () => {
    const [filter, setFilter] = useState('');
    const [draggedHobby, setDraggedHobby] = useState(null);
    const users = useSelector((state: RootState) => state.users.users);
    
    // Get unique hobbies
    const allHobbies = Array.from(new Set(users.flatMap(user => user.hobbies)));
    const filteredHobbies = allHobbies.filter(hobby => 
        hobby.toLowerCase().includes(filter.toLowerCase())
    );

    const handleDragStart = (event, hobby) => {
        event.dataTransfer.setData("application/reactflow-hobby", hobby);
        event.dataTransfer.effectAllowed = "move";
        setDraggedHobby(hobby);
    };

    const handleDragEnd = () => {
        setDraggedHobby(null);
    };

    return (
        <aside className="w-64 h-full bg-white shadow-lg border-r border-gray-200">
            <div className="p-4">
                <h2 className="text-lg font-semibold mb-4">Hobbies</h2>
                
                {/* Search input with icon */}
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search hobbies..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Hobbies list */}
                <div className="space-y-1">
                    {filteredHobbies.length > 0 ? (
                        filteredHobbies.map((hobby, index) => (
                            <div
                                key={index}
                                draggable
                                onDragStart={(e) => handleDragStart(e, hobby)}
                                onDragEnd={handleDragEnd}
                                className={`
                                    p-2 rounded-md cursor-move
                                    ${draggedHobby === hobby 
                                        ? 'bg-blue-100 border-2 border-blue-500' 
                                        : 'hover:bg-gray-100 border border-transparent'}
                                    transition-colors duration-150
                                `}
                            >
                                {hobby}
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-4">
                            No hobbies found
                        </div>
                    )}
                </div>

                {/* Helper text */}
                <div className="mt-4 text-xs text-gray-500 p-2 bg-gray-50 rounded-md">
                    Drag a hobby to a user node to add it
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;