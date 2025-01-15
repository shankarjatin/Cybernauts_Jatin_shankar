import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUser, updateUser } from "../services/api";
import { RootState } from "../redux/store";
import { setUsers } from "../redux/userSlice";
import { toast } from "react-toastify";

interface UserFormProps {
  compact?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ compact = false }) => {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.users.users);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [userDetails, setUserDetails] = useState({
    username: "",
    age: "",
    hobbies: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const hobbyOptions = [
    "Reading",
    "Gaming",
    "Traveling",
    "Hiking",
    "Swimming",
    "Cooking",
    "Gardening",
    "Blogging",
    "Photography",
    "Drawing",
    "Yoga",
    "Dancing",
    "Cycling",
    "Fishing",
    "Boxing",
    "Running",
    "Tennis",
    "Chess",
    "Singing",
    "DIY",
  ];

  useEffect(() => {
    if (selectedUserId) {
      const selectedUser = users.find((user) => user._id === selectedUserId);
      setUserDetails({
        username: selectedUser?.username || "",
        age: selectedUser?.age?.toString() || "",
        hobbies: selectedUser?.hobbies || [],
      });
      setIsEditing(true);
    } else {
      setUserDetails({ username: "", age: "", hobbies: [] });
      setIsEditing(false);
    }
  }, [selectedUserId, users]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { username, age, hobbies } = userDetails;

    try {
      let response;
      if (isEditing) {
        response = await updateUser(selectedUserId, {
          username,
          age: parseInt(age, 10),
          hobbies,
        });
        dispatch(
          setUsers(
            users.map((user) =>
              user._id === selectedUserId ? { ...user, ...response } : user
            )
          )
        );
        toast.success("User updated successfully!");
      } else {
        response = await createUser({
          username,
          age: parseInt(age, 10),
          hobbies,
        });
        dispatch(setUsers([...users, response]));
        toast.success("User created successfully!");
      }
      resetForm();
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Failed to save user. Please try again.");
    }
  };

  const handleCheckboxChange = (hobby) => {
    setUserDetails((prevDetails) => {
      const newHobbies = prevDetails.hobbies.includes(hobby)
        ? prevDetails.hobbies.filter((h) => h !== hobby)
        : [...prevDetails.hobbies, hobby];
      return { ...prevDetails, hobbies: newHobbies };
    });
  };

  const resetForm = () => {
    setSelectedUserId("");
    setUserDetails({ username: "", age: "", hobbies: [] });
    setIsEditing(false);
  };

  return (
    <div
      className={`${
        compact ? "bg-transparent" : "bg-[#2A2A40] shadow-lg"
      } rounded-lg p-4 w-full flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4`}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-wrap items-center gap-4"
      >
        {/* Select User for Editing */}
        <div className="flex-1">
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="px-3 py-2 border border-[#8F77B5] bg-[#1E1E2F] text-[#FFFFFF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8F77B5] w-full"
          >
            <option value="">Create New User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>

        {/* Username Input */}
        <div className="flex-1">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={userDetails.username}
            onChange={(e) =>
              setUserDetails({ ...userDetails, username: e.target.value })
            }
            className="px-3 py-2 border border-[#8F77B5] bg-[#1E1E2F] text-[#FFFFFF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8F77B5] w-full"
            required
          />
        </div>

        {/* Age Input */}
        <div className="flex-1">
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={userDetails.age}
            onChange={(e) =>
              setUserDetails({ ...userDetails, age: e.target.value })
            }
            className="px-3 py-2 border border-[#8F77B5] bg-[#1E1E2F] text-[#FFFFFF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8F77B5] w-full"
            required
          />
        </div>

        {/* Hobbies Dropdown */}
        <div className="flex-1 relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="px-3 py-2 border border-[#8F77B5] bg-[#1E1E2F] text-[#FFFFFF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8F77B5] w-full"
          >
            Select Hobbies
          </button>
          {dropdownOpen && (
            <div className="absolute mt-2 bg-[#2A2A40] border border-[#8F77B5] rounded-md shadow-lg w-full z-20 max-h-40 overflow-y-auto">
              <ul className="p-2">
                {hobbyOptions.map((hobby) => (
                  <li key={hobby} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={userDetails.hobbies.includes(hobby)}
                      onChange={() => handleCheckboxChange(hobby)}
                      className="h-4 w-4 text-[#8F77B5] focus:ring-[#8F77B5]"
                    />
                    <span className="text-[#FFFFFF]">{hobby}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="px-4 py-2 bg-[#8F77B5] text-[#FFFFFF] rounded-md hover:bg-[#A8A3D1] focus:outline-none focus:ring-2 focus:ring-[#A8A3D1] w-full"
        >
          {isEditing ? "Update User" : "Create User"}
        </button>
      </form>
    </div>
  );
};

export default UserForm;
