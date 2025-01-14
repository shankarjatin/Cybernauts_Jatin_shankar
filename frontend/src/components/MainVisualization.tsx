import React, { useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ReactFlowProvider
} from 'react-flow-renderer';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const MainVisualization = () => {
    const users = useSelector((state: RootState) => state.users.users);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
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

    return (
        <ReactFlowProvider>
            <div style={{ height: '100vh' }}>
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
