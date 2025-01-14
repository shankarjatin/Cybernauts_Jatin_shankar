import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUser, updateUser } from "../services/api";
import { RootState } from "../redux/store";
import { setUsers } from "../redux/userSlice";

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
        username: selectedUser.username,
        age: selectedUser.age.toString(),
        hobbies: selectedUser.hobbies,
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
      } else {
        response = await createUser({
          username,
          age: parseInt(age, 10),
          hobbies,
        });
        dispatch(setUsers([...users, response]));
      }
      alert("User saved successfully!");
      resetForm();
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Failed to save user. See console for details.");
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
      } rounded-lg p-4`}
    >
      <form
        onSubmit={handleSubmit}
        className="flex items-center space-x-4"
      >
        {/* Select User for Edit */}
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="px-3 py-2 border border-[#8F77B5] bg-[#1E1E2F] text-[#FFFFFF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8F77B5]"
        >
          <option value="">Create New User</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.username}
            </option>
          ))}
        </select>

        {/* Username Input */}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={userDetails.username}
          onChange={(e) =>
            setUserDetails({ ...userDetails, username: e.target.value })
          }
          className="px-3 py-2 border border-[#8F77B5] bg-[#1E1E2F] text-[#FFFFFF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8F77B5]"
          required
        />

        {/* Age Input */}
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={userDetails.age}
          onChange={(e) =>
            setUserDetails({ ...userDetails, age: e.target.value })
          }
          className="px-3 py-2 border border-[#8F77B5] bg-[#1E1E2F] text-[#FFFFFF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8F77B5]"
          required
        />

        {/* Hobbies Dropdown */}
        <div className="relative">
          <button
            type="button"
            className="px-3 py-2 border border-[#8F77B5] bg-[#1E1E2F] text-[#FFFFFF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8F77B5]"
          >
            Select Hobbies
          </button>
          <div className="absolute mt-2 bg-[#2A2A40] border border-[#8F77B5] rounded-md shadow-lg w-48">
            <ul className="p-2 max-h-40 overflow-y-auto">
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
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="px-4 py-2 bg-[#8F77B5] text-[#FFFFFF] rounded-md hover:bg-[#A8A3D1] focus:outline-none focus:ring-2 focus:ring-[#A8A3D1]"
        >
          {isEditing ? "Update User" : "Create User"}
        </button>
      </form>
    </div>
  );
};

export default UserForm;
