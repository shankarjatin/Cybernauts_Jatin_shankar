import React, { useEffect } from 'react';
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

const MainVisualization = () => {
    const dispatch = useDispatch();
    const users = useSelector((state: RootState) => state.users.users);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        // Set nodes and edges based on users
        const userNodes = users.map(user => ({
            id: user._id,
            type: 'default',
            data: { label: `${user.username} (${user.age})` },
            position: { x: Math.random() * 250, y: Math.random() * 250 }
        }));

        const hobbyNodes = users.flatMap(user =>
            user.hobbies.map((hobby, index) => ({
                id: `hobby-${user._id}-${index}`,
                type: 'default',
                data: { label: hobby },
                position: { x: Math.random() * 500, y: Math.random() * 500 }
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

    const onDrop = async (event) => {
        event.preventDefault();
        const hobby = event.dataTransfer.getData("application/reactflow");

        // Get node data
        const reactFlowBounds = event.target.getBoundingClientRect();
        const type = 'default';
        const position = {
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        };

        // Find closest node (simplistic approach)
        const closestNode = nodes.reduce((prev, node) => {
            const distance = Math.hypot(node.position.x - position.x, node.position.y - position.y);
            return distance < prev.distance ? { node, distance } : prev;
        }, { node: null, distance: Infinity }).node;

        if (closestNode) {
            const userToUpdate = users.find(u => u._id === closestNode.id);
            if (userToUpdate && !userToUpdate.hobbies.includes(hobby)) {
                const updatedHobbies = [...userToUpdate.hobbies, hobby];
                const updatedUser = await updateUser(userToUpdate._id, { ...userToUpdate, hobbies: updatedHobbies });
                dispatch(setUsers(users.map(u => u._id === updatedUser._id ? updatedUser : u)));
            }
        }
    };

    return (
        <ReactFlowProvider>
            <div style={{ height: '100vh' }} onDrop={onDrop} onDragOver={(event) => event.preventDefault()}>
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
            </div>
        </ReactFlowProvider>
    );
};

export default MainVisualization;
