import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUser, updateUser } from "../services/api";
import { RootState } from "../redux/store";
import { setUsers } from "../redux/userSlice";

const UserForm = () => {
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
    <div className="w-full h-500 bg-[#FBF5E5] flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 flex items-center w-3/4"
      >
        {/* Left Section */}
        <div className="w-1/3 p-4 space-y-4">
          <h2 className="text-xl font-bold text-[#212121]">
            {isEditing ? "Edit User" : "Create User"}
          </h2>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full px-4 py-2 border border-[#C890A7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#A35C7A]"
          >
            <option value="">Create New User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={userDetails.username}
            onChange={(e) =>
              setUserDetails({ ...userDetails, username: e.target.value })
            }
            className="w-full px-4 py-2 border border-[#C890A7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#A35C7A]"
            required
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={userDetails.age}
            onChange={(e) =>
              setUserDetails({ ...userDetails, age: e.target.value })
            }
            className="w-full px-4 py-2 border border-[#C890A7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#A35C7A]"
            required
          />
        </div>

        {/* Right Section */}
        <div className="w-2/3 p-4">
          <label className="block text-[#212121] mb-2">Hobbies:</label>
          <div className="grid grid-cols-3 gap-4 max-h-40 overflow-y-auto">
            {hobbyOptions.map((hobby) => (
              <label key={hobby} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={userDetails.hobbies.includes(hobby)}
                  onChange={() => handleCheckboxChange(hobby)}
                  className="h-4 w-4 text-[#A35C7A] focus:ring-[#A35C7A]"
                />
                <span className="text-[#212121]">{hobby}</span>
              </label>
            ))}
          </div>
          <div className="mt-6 flex space-x-4">
            <button
              type="submit"
              className="px-6 py-2 bg-[#A35C7A] text-white rounded-md hover:bg-[#C890A7] focus:outline-none focus:ring-2 focus:ring-[#C890A7]"
            >
              {isEditing ? "Update User" : "Create User"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-200 text-[#212121] rounded-md hover:bg-gray-300 focus:outline-none"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
