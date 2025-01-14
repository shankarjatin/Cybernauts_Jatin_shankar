import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Search } from "lucide-react";

const Sidebar = ({ className }: { className: string }) => {
  const [filter, setFilter] = useState("");
  const [isOpen, setIsOpen] = useState(true); // Toggle for mobile
  const users = useSelector((state: RootState) => state.users.users);

  const allHobbies = Array.from(new Set(users.flatMap((user) => user.hobbies)));
  const filteredHobbies = allHobbies.filter((hobby) =>
    hobby.toLowerCase().includes(filter.toLowerCase())
  );

  const handleDragStart = (event, hobby) => {
    event.dataTransfer.setData("application/reactflow-hobby", hobby);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside
      className={`${
        isOpen ? "block" : "hidden"
      } md:block sticky top-0 w-full md:w-72 h-screen bg-[#1E1E2F] shadow-md ${className}`}
    >
      <div className="p-6">
        <h2 className="text-xl font-bold text-[#FFFFFF] mb-6">Hobbies</h2>

        {/* Search input */}
        <div className="relative mb-6">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8F77B5]"
            size={20}
          />
          <input
            type="text"
            placeholder="Search hobbies..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#8F77B5] rounded-md bg-[#2A2A40] text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#8F77B5]"
          />
        </div>

        {/* Hobbies list */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {filteredHobbies.length > 0 ? (
            filteredHobbies.map((hobby, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, hobby)}
                className="p-3 bg-[#2A2A40] text-[#FFFFFF] rounded-md cursor-move border border-transparent hover:bg-[#8F77B5] hover:text-[#1E1E2F] transition-all duration-150"
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
        <div className="mt-6 text-xs text-[#FFFFFF] p-3 bg-[#2A2A40] border border-[#8F77B5] rounded-md">
          Drag a hobby to a user node to add it.
        </div>
      </div>

      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="block md:hidden p-4 text-[#FFFFFF] bg-[#8F77B5] w-full"
      >
        {isOpen ? "Close" : "Open"} Sidebar
      </button>
    </aside>
  );
};

export default Sidebar;
