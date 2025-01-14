import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createUser, updateUser } from '../services/api';
import { RootState } from '../redux/store';
import { setUsers } from '../redux/userSlice';

const UserForm = () => {
    const dispatch = useDispatch();
    const users = useSelector((state: RootState) => state.users.users);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [userDetails, setUserDetails] = useState({
        username: '',
        age: '',
        hobbies: []
    });
    const [isEditing, setIsEditing] = useState(false);

    const hobbyOptions = [
        "Reading", "Gaming", "Traveling", "Hiking", "Swimming", "Cooking",
        "Gardening", "Blogging", "Photography", "Drawing", "Yoga",
        "Dancing", "Cycling", "Fishing", "Boxing", "Running",
        "Tennis", "Chess", "Singing", "DIY"
    ];

    useEffect(() => {
        if (selectedUserId) {
            const selectedUser = users.find(user => user._id === selectedUserId);
            setUserDetails({
                username: selectedUser.username,
                age: selectedUser.age.toString(),
                hobbies: selectedUser.hobbies
            });
            setIsEditing(true);
        } else {
            setUserDetails({ username: '', age: '', hobbies: [] });
            setIsEditing(false);
        }
    }, [selectedUserId, users]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { username, age, hobbies } = userDetails;
        try {
            let response;
            if (isEditing) {
                response = await updateUser(selectedUserId, { username, age: parseInt(age, 10), hobbies });
                dispatch(setUsers(users.map(user => user._id === selectedUserId ? { ...user, ...response } : user)));
            } else {
                response = await createUser({ username, age: parseInt(age, 10), hobbies });
                dispatch(setUsers([...users, response]));
            }
            alert('User saved successfully!');
            resetForm();
        } catch (error) {
            console.error('Error saving user:', error);
            alert('Failed to save user. See console for details.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "hobbies") {
            const valueArray = Array.from(e.target.selectedOptions, option => option.value);
            setUserDetails(prev => ({ ...prev, hobbies: valueArray }));
        } else {
            setUserDetails(prev => ({ ...prev, [name]: value }));
        }
    };

    const resetForm = () => {
        setSelectedUserId('');
        setUserDetails({ username: '', age: '', hobbies: [] });
        setIsEditing(false);
    };

    return (
        <div>
            <select value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)}>
                <option value="">Create New User</option>
                {users.map(user => (
                    <option key={user._id} value={user._id}>{user.username}</option>
                ))}
            </select>
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
                <button type="submit">{isEditing ? 'Update User' : 'Create User'}</button>
                {isEditing && (
                    <button type="button" onClick={resetForm}>
                        Cancel Edit
                    </button>
                )}
            </form>
        </div>
    );
};

export default UserForm;
