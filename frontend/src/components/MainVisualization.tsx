import React, { useEffect, useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
} from "react-flow-renderer";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { updateUser } from "../services/api";
import { setUsers } from "../redux/userSlice";
const Flow = () => {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.users.users);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const userColors = ["#6A5ACD", "#FF6347", "#2E8B57", "#FFD700", "#20B2AA"];
    const gridSpacing = 200; // Spacing between nodes
    const gridWidth = Math.ceil(Math.sqrt(users.length)); // Number of nodes per row

    // Create user nodes with grid-based positions
    const userNodes = users.map((user, index) => ({
      id: user._id,
      type: "default",
      data: { label: `${user.username} (${user.age})` },
      position: {
        x: (index % gridWidth) * gridSpacing,
        y: Math.floor(index / gridWidth) * gridSpacing,
      },
      style: {
        background: userColors[index % userColors.length],
        color: "#FFFFFF",
        border: "2px solid #FFFFFF",
        borderRadius: "8px",
        padding: "10px",
      },
    }));

    // Create hobby nodes, positioned below their respective user nodes
    const hobbyNodes = users.flatMap((user, userIndex) =>
      user.hobbies.map((hobby, hobbyIndex) => ({
        id: `hobby-${user._id}-${hobbyIndex}`,
        type: "default",
        data: { label: hobby },
        position: {
          x: (userIndex % gridWidth) * gridSpacing + hobbyIndex * 50,
          y: Math.floor(userIndex / gridWidth) * gridSpacing + gridSpacing,
        },
        style: {
          background: "#8F77B5",
          color: "#FFFFFF",
          border: "2px solid #FFFFFF",
          borderRadius: "8px",
        },
      }))
    );

    // Create edges between user nodes and hobby nodes
    const hobbyEdges = users.flatMap((user) =>
      user.hobbies.map((hobby, index) => ({
        id: `edge-${user._id}-${index}`,
        source: user._id,
        target: `hobby-${user._id}-${index}`,
        animated: true,
        style: { stroke: "yellow", strokeWidth: 2 },
      }))
    );

    setNodes([...userNodes, ...hobbyNodes]);
    setEdges(hobbyEdges);
  }, [users, setNodes, setEdges]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const hobby = event.dataTransfer.getData("application/reactflow-hobby");
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - reactFlowBounds.left;
      const y = event.clientY - reactFlowBounds.top;

      const closestNode = nodes.find((node) => {
        const nodeX = node.position.x;
        const nodeY = node.position.y;
        return (
          x >= nodeX &&
          x <= nodeX + 150 &&
          y >= nodeY &&
          y <= nodeY + 40 &&
          !node.id.startsWith("hobby-")
        );
      });

      if (closestNode && hobby) {
        const userToUpdate = users.find((user) => user._id === closestNode.id);
        if (userToUpdate && !userToUpdate.hobbies.includes(hobby)) {
          const updatedHobbies = [...userToUpdate.hobbies, hobby];
          updateUser(userToUpdate._id, { ...userToUpdate, hobbies: updatedHobbies })
            .then((updatedUser) => {
              dispatch(
                setUsers(
                  users.map((u) =>
                    u._id === userToUpdate._id
                      ? { ...u, hobbies: updatedUser.hobbies }
                      : u
                  )
                )
              );

              // Add new hobby node and edge
              const newNodeId = `hobby-${userToUpdate._id}-${updatedHobbies.length - 1}`;
              const newNode = {
                id: newNodeId,
                type: "default",
                data: { label: hobby },
                position: {
                  x: closestNode.position.x + Math.random() * 50,
                  y: closestNode.position.y + Math.random() * 50,
                },
                style: {
                  background: "#8F77B5",
                  color: "#FFFFFF",
                  border: "2px solid #FFFFFF",
                  borderRadius: "8px",
                },
              };

              const newEdge = {
                id: `edge-${userToUpdate._id}-${updatedHobbies.length - 1}`,
                source: closestNode.id,
                target: newNodeId,
                animated: true,
                style: { stroke: "yellow", strokeWidth: 2 },
              };

              setNodes((nds) => [...nds, newNode]);
              setEdges((eds) => [...eds, newEdge]);
            })
            .catch((error) => {
              console.error("Error updating user with new hobby:", error);
            });
        }
      }
    },
    [nodes, users, dispatch]
  );

  return (
    <div
      style={{ height: "100%", backgroundColor: "#1E1E2F" }}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <MiniMap nodeColor={(node) => node.style.background || "#8F77B5"} />
        <Controls />
        <Background color="#8F77B5" gap={16} />
      </ReactFlow>
    </div>
  );
};

const MainVisualization = () => {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
};

export default MainVisualization;
