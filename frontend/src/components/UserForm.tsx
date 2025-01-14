import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createUser, updateUser } from '../services/api';
import { RootState } from '../redux/store';
import { setUsers } from '../redux/userSlice';

const UserForm = () => {
    const dispatch = useDispatch();
    const users = useSelector((state: RootState) => state.users.users);  // Fetching users from Redux store
    const [user, setUser] = useState({
        _id: '', // For updates
        username: '',
        age: '',
        hobbies: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const userData = {
            username: user.username,
            age: parseInt(user.age, 10),
            hobbies: user.hobbies.split(',').map(hobby => hobby.trim())
        };

        try {
            let response;
            if (isEditing) {
                response = await updateUser(user._id, userData);
            } else {
                response = await createUser(userData);
            }

            if (response) {
                dispatch(setUsers([...users, response]));  // Update users array in Redux store
                alert('User saved successfully!');
                setUser({ _id: '', username: '', age: '', hobbies: '' }); // Reset form
                setIsEditing(false); // Reset editing state
            } else {
                throw new Error('No data returned from API');
            }
        } catch (error) {
            console.error('Error saving user:', error);
            alert('Failed to save user. See console for details.');
        }
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="username"
                placeholder="Username"
                value={user.username}
                onChange={handleChange}
                required
            />
            <input
                type="number"
                name="age"
                placeholder="Age"
                value={user.age}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="hobbies"
                placeholder="Hobbies (comma-separated)"
                value={user.hobbies}
                onChange={handleChange}
            />
            <button type="submit">{isEditing ? 'Update' : 'Create'} User</button>
        </form>
    );
};

export default UserForm;
