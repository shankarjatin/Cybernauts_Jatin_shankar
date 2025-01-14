import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUsers } from '../redux/userSlice';
import { createUser } from '../services/api';
import { User } from '../types/user';
import { toast } from 'react-toastify';

const UserForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [age, setAge] = useState(18);
  const [hobbies, setHobbies] = useState<string[]>([]);
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !age || hobbies.length === 0) {
      toast.error('All fields are required!');
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      username,
      age,
      hobbies,
    };

    try {
      const createdUser = await createUser(newUser);
      dispatch(setUsers([createdUser])); // Add user to store
      toast.success('User created successfully!');
      setUsername('');
      setAge(18);
      setHobbies([]);
    } catch (error) {
      toast.error('Failed to create user!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Age:</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          required
        />
      </div>
      <div>
        <label>Hobbies:</label>
        <input
          type="text"
          value={hobbies.join(', ')}
          onChange={(e) => setHobbies(e.target.value.split(', '))}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default UserForm;
