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

    const userNodes = users.map((user, index) => ({
      id: user._id,
      type: "default",
      data: { label: `${user.username} (${user.age})` },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      style: {
        background: userColors[index % userColors.length],
        color: "#FFFFFF",
        border: "2px solid #FFFFFF",
        borderRadius: "8px",
        padding: "10px",
      },
    }));

    const hobbyNodes = users.flatMap((user) =>
      user.hobbies.map((hobby, index) => ({
        id: `hobby-${user._id}-${index}`,
        type: "default",
        data: { label: hobby },
        position: { x: Math.random() * 400, y: Math.random() * 400 },
        style: {
          background: "#8F77B5",
          color: "#FFFFFF",
          border: "2px solid #FFFFFF",
          borderRadius: "8px",
        },
      }))
    );

    const hobbyEdges = users.flatMap((user) =>
      user.hobbies.map((hobby, index) => ({
        id: `edge-${user._id}-${index}`,
        source: user._id,
        target: `hobby-${user._id}-${index}`,
        style: { stroke: "url(#gradient)" },
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
        {/* Gradient for edges */}
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF6347" />
            <stop offset="100%" stopColor="#6A5ACD" />
          </linearGradient>
        </defs>
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
