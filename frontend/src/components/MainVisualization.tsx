import React, { useEffect, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ReactFlowProvider
} from 'react-flow-renderer';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { updateUser } from '../services/api';
import { setUsers } from '../redux/userSlice';

// Separate the flow content into its own component
const Flow = () => {
    const dispatch = useDispatch();
    const users = useSelector((state: RootState) => state.users.users);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        const userNodes = users.map(user => ({
            id: user._id,
            type: 'default',
            data: { label: `${user.username} (${user.age})` },
            position: { x: Math.random() * window.innerWidth * 0.8, y: Math.random() * window.innerHeight * 0.8 }
        }));

        const hobbyNodes = users.flatMap(user =>
            user.hobbies.map((hobby, index) => ({
                id: `hobby-${user._id}-${index}`,
                type: 'default',
                data: { label: hobby },
                position: { x: Math.random() * window.innerWidth * 0.8, y: Math.random() * window.innerHeight * 0.8 }
            }))
        );

        const hobbyEdges = users.flatMap(user =>
            user.hobbies.map((hobby, index) => ({
                id: `edge-${user._id}-${index}`,
                source: user._id,
                target: `hobby-${user._id}-${index}`,
                animated: true
            }))
        );

        setNodes([...userNodes, ...hobbyNodes]);
        setEdges(hobbyEdges);
    }, [users, setNodes, setEdges]);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback((event) => {
      event.preventDefault();
      event.stopPropagation(); // Ensure this event doesn't propagate further than intended
  
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - reactFlowBounds.left;
      const y = event.clientY - reactFlowBounds.top;
      const hobby = event.dataTransfer.getData("application/reactflow-hobby");
  
      // Assuming nodes are positioned absolutely within the React Flow container
      const closestNode = nodes.find(node => {
          const nodePosition = node.position;
          const nodeBounds = {
              x: nodePosition.x,
              y: nodePosition.y,
              width: 250,  // Assuming default width if not provided by node data
              height: 100  // Assuming default height
          };
          return x >= nodeBounds.x && x <= nodeBounds.x + nodeBounds.width &&
                 y >= nodeBounds.y && y <= nodeBounds.y + nodeBounds.height;
      });
  
      if (closestNode && hobby) {
          const userToUpdate = users.find(user => user._id === closestNode.id);
          if (userToUpdate) {
              const updatedHobbies = [...userToUpdate.hobbies, hobby];
              updateUser(userToUpdate._id, { ...userToUpdate, hobbies: updatedHobbies })
                  .then(updatedUser => {
                      dispatch(setUsers(users.map(u => u._id === userToUpdate._id ? updatedUser : u)));
                      setNodes(ns => ns.map(n => n.id === closestNode.id ? { ...n, data: { ...n.data, label: `${updatedUser.username} (${updatedUser.age})` } } : n));
                  })
                  .catch(error => {
                      console.error('Error updating user with new hobby:', error);
                      alert('Failed to update user. See console for details.');
                  });
          }
      }
  }, [nodes, users, dispatch, setNodes]);
  
    return (
        <div style={{ height: '100vh' }} onDrop={onDrop} onDragOver={onDragOver}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
                className="bg-teal-50"
            >
                <MiniMap />
                <Controls />
                <Background />
            </ReactFlow>
        </div>
    );
};

// Main component that wraps the Flow with ReactFlowProvider
const MainVisualization = () => {
    return (
        <ReactFlowProvider>
            <Flow />
        </ReactFlowProvider>
    );
};

export default MainVisualization;