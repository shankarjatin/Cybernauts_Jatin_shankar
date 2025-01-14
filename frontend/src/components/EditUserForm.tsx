import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateUser } from '../services/api';
import { setUsers } from '../redux/userSlice';

const EditUserForm = () => {
    const dispatch = useDispatch();
    const [userDetails, setUserDetails] = useState({
        username: '',
        age: '',
        hobbies: []
    });

    const hobbyOptions = [
        "Reading", "Gaming", "Traveling", "Hiking", "Swimming", "Cooking",
        "Gardening", "Blogging", "Photography", "Drawing", "Yoga",
        "Dancing", "Cycling", "Fishing", "Boxing", "Running",
        "Tennis", "Chess", "Singing", "DIY"
    ];

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!userDetails.username || !userDetails.age || userDetails.hobbies.length === 0) {
            alert('Please fill in all fields.');
            return;
        }

        const userData = {
            username: userDetails.username,
            newUsername: userDetails.username, // Assuming username remains the same for simplicity
            age: parseInt(userDetails.age, 10),
            hobbies: userDetails.hobbies
        };

        try {
            const updatedUser = await updateUser(userDetails.username, userData);
            dispatch(setUsers(users => users.map(user => 
                user.username === userDetails.username ? updatedUser : user
            )));
            alert('User updated successfully!');
            setUserDetails({ username: '', age: '', hobbies: [] });  // Reset form
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user. See console for details.');
        }
    };

    const handleChange = (e) => {
        if (e.target.name === "hobbies") {
            const valueArray = Array.from(e.target.selectedOptions, option => option.value);
            setUserDetails(prev => ({ ...prev, hobbies: valueArray }));
        } else {
            setUserDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="username"
                placeholder="Username"
                value={userDetails.username}
                onChange={handleChange}
                required
            />
            <input
                type="number"
                name="age"
                placeholder="Age"
                value={userDetails.age}
                onChange={handleChange}
                required
            />
            <select
                name="hobbies"
                multiple
                value={userDetails.hobbies}
                onChange={handleChange}
                style={{ width: '100%', height: '100px', overflow: 'auto' }}
            >
                {hobbyOptions.map(hobby => (
                    <option key={hobby} value={hobby}>{hobby}</option>
                ))}
            </select>
            <button type="submit">Update User</button>
        </form>
    );
};

export default EditUserForm;
