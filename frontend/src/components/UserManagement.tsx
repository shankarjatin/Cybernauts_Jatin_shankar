import React, { useState } from 'react';
import CreateUserForm from './CreateUserForm';
import EditUserForm from './EditUserForm';


const UserManagement = () => {
    const [mode, setMode] = useState('create');  // 'create' or 'edit'

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <button onClick={() => setMode('create')} style={{ marginRight: '10px' }}>
                    Create User
                </button>
                <button onClick={() => setMode('edit')}>
                    Edit User
                </button>
            </div>
            {mode === 'create' ? (
                <CreateUserForm/>
            ) : (
                <EditUserForm />
            )}
        </div>
    );
};

export default UserManagement;
