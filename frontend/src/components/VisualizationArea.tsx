import React, { useEffect } from 'react';
import ReactFlow, { MiniMap, Controls, Background, OnConnect, Node, Edge } from 'react-flow-renderer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { setUsers, setLoading, setError, removeUser } from '../redux/userSlice';
import { fetchUsers, deleteUser } from '../services/api';
import { toast } from 'react-toastify';

const VisualizationArea: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.users.users);
  const loading = useSelector((state: RootState) => state.users.loading);
  const error = useSelector((state: RootState) => state.users.error);

  useEffect(() => {
    const loadUsers = async () => {
      dispatch(setLoading(true));
      try {
        const users = await fetchUsers();
        dispatch(setUsers(users));
      } catch (error) {
        dispatch(setError('Failed to fetch users'));
      } finally {
        dispatch(setLoading(false));
      }
    };
    loadUsers();
  }, [dispatch]);

  // Handle deleting a user
  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      dispatch(removeUser(userId));
      toast.success('User deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete user!');
    }
  };

  // React Flow nodes and edges
  const nodes = users.map((user) => ({
    id: user.id,
    data: { label: `${user.username} (${user.age})` },
    position: { x: Math.random() * 400, y: Math.random() * 400 },
  }));

  const edges = users.flatMap((user) =>
    user.hobbies.map((hobby, index) => ({
      id: `e${user.id}-${hobby}`,
      source: user.id,
      target: `${user.id}-${index}`,
      label: hobby,
    }))
  );

  // Handle connection of hobbies to users
  const onConnect = (params: OnConnect) => {
    console.log('Connected', params);
  };

  return (
    <div style={{ height: '600px' }}>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
      <div>
        {users.map(user => (
          <div key={user.id}>
            <button onClick={() => handleDeleteUser(user.id)}>Delete {user.username}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisualizationArea;
