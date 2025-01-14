import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createUser } from '../services/api';
import { setUsers } from '../redux/userSlice';

const CreateUserForm = () => {
    const dispatch = useDispatch();
     const [user, setUser] = useState({
          _id: '',
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
        const userData = {
            username: user.username,
            age: parseInt(user.age, 10),
            hobbies: user.hobbies
        };

        try {
            let response;
          
                response = await createUser(userData);
            
            if (response) {
                dispatch(setUsers([...users, response]));
                alert('User saved successfully!');
                setUser({ _id: '', username: '', age: '', hobbies: [] });
                
            } else {
                throw new Error('No data returned from API');
            }
        } catch (error) {
            console.error('Error saving user:', error);
            alert('Failed to save user. See console for details.');
        }
    };

    const handleChange = (e) => {
        if (e.target.name === "hobbies") {
            const valueArray = Array.from(e.target.selectedOptions, option => option.value);
            setUser({ ...user, hobbies: valueArray });
        } else {
            setUser({ ...user, [e.target.name]: e.target.value });
        }
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
            <select
                name="hobbies"
                multiple
                value={user.hobbies}
                onChange={handleChange}
                style={{ width: '100%', height: '100px', overflow: 'auto' }}
            >
                {hobbyOptions.map(hobby => (
                    <option key={hobby} value={hobby}>{hobby}</option>
                ))}
            </select>
            <button type="submit">Create User</button>
        </form>
    );
};

export default CreateUserForm;
