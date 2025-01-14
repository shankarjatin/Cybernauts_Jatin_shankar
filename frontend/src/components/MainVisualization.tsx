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

        const hobby = event.dataTransfer.getData("application/reactflow-hobby");
        if (!hobby) return;

        // Get the position of the drop
        const reactFlowBounds = event.currentTarget.getBoundingClientRect();
        const position = {
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top
        };

        // Find the closest user node to the drop position
        const userNode = nodes.find(node => {
            if (!node.id.startsWith('hobby-')) {  // Only look at user nodes
                const nodeX = node.position.x;
                const nodeY = node.position.y;
                const distanceX = Math.abs(nodeX - position.x);
                const distanceY = Math.abs(nodeY - position.y);
                return distanceX < 100 && distanceY < 50;  // Adjust these thresholds as needed
            }
            return false;
        });

        if (userNode) {
            const user = users.find(u => u._id === userNode.id);
            if (user && !user.hobbies.includes(hobby)) {
                // Update user with new hobby
                const updatedHobbies = [...user.hobbies, hobby];
                updateUser(user._id, { ...user, hobbies: updatedHobbies })
                    .then(updatedUser => {
                        // Update Redux store
                        dispatch(setUsers(users.map(u => 
                            u._id === user._id ? { ...u, hobbies: updatedUser.hobbies } : u
                        )));

                        // Add new hobby node and edge
                        const newNodeId = `hobby-${user._id}-${user.hobbies.length}`;
                        const newNode = {
                            id: newNodeId,
                            type: 'default',
                            data: { label: hobby },
                            position: {
                                x: userNode.position.x + Math.random() * 100,
                                y: userNode.position.y + Math.random() * 100
                            }
                        };

                        const newEdge = {
                            id: `edge-${user._id}-${user.hobbies.length}`,
                            source: user._id,
                            target: newNodeId,
                            animated: true
                        };

                        setNodes(nds => [...nds, newNode]);
                        setEdges(eds => [...eds, newEdge]);
                    })
                    .catch(error => {
                        console.error('Failed to update user:', error);
                    });
            }
        }
    }, [nodes, users, dispatch, setNodes, setEdges]);

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