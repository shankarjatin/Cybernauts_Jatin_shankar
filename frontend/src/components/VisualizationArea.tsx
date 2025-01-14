import React, { useEffect, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  Elements,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { setUsers } from '../redux/userSlice';
import { fetchUsers } from '../services/api';

const VisualizationArea: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.users.users);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    fetchUsers().then(data => {
      dispatch(setUsers(data));
      const userNodes = data.map(user => ({
        id: user.id,
        type: 'default',
        data: { label: `${user.username} (Age: ${user.age})` },
        position: { x: Math.random() * 400, y: Math.random() * 400 }
      }));
      const hobbyNodes = data.flatMap(user =>
        user.hobbies.map((hobby, index) => ({
          id: `hobby-${user.id}-${index}`,
          type: 'default',
          data: { label: hobby },
          position: { x: Math.random() * 400 + 100, y: Math.random() * 400 }
        }))
      );
      const hobbyEdges = data.flatMap(user =>
        user.hobbies.map((hobby, index) => ({
          id: `edge-${user.id}-${index}`,
          source: user.id,
          target: `hobby-${user.id}-${index}`,
          type: 'smoothstep',
        }))
      );
      setNodes([...userNodes, ...hobbyNodes]);
      setEdges(hobbyEdges);
    });
  }, [dispatch]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  );
};

export default VisualizationArea;
