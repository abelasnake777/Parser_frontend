import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ParseTreeNode } from "../lib/sampleParseTree";
import parseTreeNodes from "../lib/sampleParseTree";

const ParseTreeRenderer: React.FC = () => {
  const nodes: ParseTreeNode[] = parseTreeNodes;
  const [positions, setPositions] = useState<{ [key: number]: { x: number; y: number } }>({});
  const [visibleNodes, setVisibleNodes] = useState<Set<number>>(new Set());
  const [isDone, setIsDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // For custom dragging after animation is done
  const draggingNode = useRef<number | null>(null);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const children: number[][] = nodes.map((n) => n.actions ?? []);
  const parents: (number | null)[] = new Array(nodes.length).fill(null);
  for (let i = 0; i < nodes.length; i++) {
    for (let child of children[i]) {
      parents[child] = i;
    }
  }

  useLayoutEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const hSpacing = 100; // Increased for better tree look
      const vSpacing = 120;
      const tempPositions: { x: number; y: number }[] = new Array(nodes.length);

      function layout(node: number, depth: number, xOffset: number): number {
        let childX = xOffset;
        const childXs: number[] = [];
        for (let child of children[node]) {
          childX = layout(child, depth + 1, childX);
          childXs.push(tempPositions[child].x);
        }
        tempPositions[node] = { y: depth * vSpacing + 50, x: 0 };
        if (childXs.length > 0) {
          tempPositions[node].x = childXs.reduce((a, b) => a + b, 0) / childXs.length;
        } else {
          tempPositions[node].x = xOffset + hSpacing / 2;
          return xOffset + hSpacing;
        }
        return childX;
      }
      layout(0, 0, 0);

      let minX = Math.min(...tempPositions.map((p) => p.x));
      let treeWidth = Math.max(...tempPositions.map((p) => p.x)) - minX + 200;
      let shift = (containerWidth - treeWidth) / 2 - minX + 100;

      const finalPositions = Object.fromEntries(
        tempPositions.map((p, i) => [i, { x: p.x + shift, y: p.y }])
      );
      setPositions(finalPositions);
    }
  }, []);

  // Build animation steps
  type Step =
    | { type: "add"; node: number }
    | { type: "backtrack"; node: number }
    | { type: "delete"; node: number };

  const steps: Step[] = [];
  function buildSteps(current: number) {
    steps.push({ type: "add", node: current });
    for (let child of children[current]) {
      buildSteps(child);
    }
    steps.push({ type: "backtrack", node: current });
    if (nodes[current].die) {
      steps.push({ type: "delete", node: current });
    }
  }
  buildSteps(0);

  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (stepIndex >= steps.length) {
      setIsDone(true);
      return;
    }
    const step = steps[stepIndex];
    if (step.type === "add") {
      setVisibleNodes((prev) => new Set([...prev, step.node]));
      const animate = () => {
        const el = nodeRefs.current[step.node];
        if (el) {
          gsap.fromTo(
            el,
            { opacity: 0, scale: 0 },
            { opacity: 1, scale: 1, duration: 1.5, ease: "elastic.out(1,0.5)", onComplete: () => setStepIndex(stepIndex + 1) }
          );
        } else {
          setTimeout(animate, 50);
        }
      };
      animate();
    } else if (step.type === "backtrack") {
      const el = nodeRefs.current[step.node];
      if (el) {
        gsap.to(el, {
          scale: 1.2,
          backgroundColor: "#4a90e2",
          duration: 0.8,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
          onComplete: () => setStepIndex(stepIndex + 1),
        });
      } else {
        setStepIndex(stepIndex + 1);
      }
    } else if (step.type === "delete") {
      const el = nodeRefs.current[step.node];
      if (el) {
        gsap.to(el, {
          opacity: 0,
          scale: 0,
          rotation: 360,
          duration: 1.8,
          ease: "back.in",
          onComplete: () => {
            setVisibleNodes((prev) => {
              const newSet = new Set(prev);
              newSet.delete(step.node);
              return newSet;
            });
            setStepIndex(stepIndex + 1);
          },
        });
      } else {
        setStepIndex(stepIndex + 1);
      }
    }
  }, [stepIndex]);

  // Custom drag handlers (no external library)
  const handleMouseDown = (node: number) => (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDone) return;
    e.preventDefault();
    draggingNode.current = node;
    const pos = positions[node];
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (draggingNode.current !== null) {
      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;
      setPositions((prev) => ({
        ...prev,
        [draggingNode.current!]: { x: newX, y: newY },
      }));
    }
  };

  const handleMouseUp = () => {
    draggingNode.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: "#1f2937" }}
    >
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {Array.from(visibleNodes).map((node) => {
          const parentIdx = parents[node];
          if (parentIdx !== null && visibleNodes.has(parentIdx)) {
            const pPos = positions[parentIdx];
            const cPos = positions[node];
            if (pPos && cPos) {
              return (
                <line
                  key={`line-${node}`}
                  x1={pPos.x}
                  y1={pPos.y + 25}
                  x2={cPos.x}
                  y2={cPos.y - 25}
                  stroke="#333"
                  strokeWidth="3"
                  opacity="0.6"
                />
              );
            }
          }
          return null;
        })}
      </svg>

      {Array.from(visibleNodes).map((node) => {
        const pos = positions[node];
        if (!pos) return null;

        const isLeaf = children[node].length === 0;
        const isDie = nodes[node].die;

        let bgColor = "#ffffff";
        let textColor = "#000";
        if (isDie) {
          bgColor = "#ff4444"; // Red for nodes to be deleted
          textColor = "#fff";
        } else if (isLeaf) {
          bgColor = "#512b80ff"; // Purplish for leaves
          textColor = "#fff";
        }

        const nodeStyle: React.CSSProperties = {
            position: "absolute",
            left: pos.x - 30,
            top: pos.y - 30,
            width: 60,
            height: 60,
            backgroundColor: isDie ? "#dc2626" : isLeaf ? "#6e6d85ff" : "#2c313bff", // Red for die, blue shades for normal
            color: "#fff",
            border: "3px solid #333",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            fontWeight: "bold",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            cursor: isDone ? "grab" : "default",
            userSelect: "none",
            opacity: 0, // Start hidden for animation
        };


        return (
          <div
            key={node}
            style={nodeStyle}
            ref={(el) => {
            nodeRefs.current[node] = el;
            }}
            onMouseDown={handleMouseDown(node)}
          >
            {nodes[node].value}
          </div>
        );
      })}
    </div>
  );
};

export default ParseTreeRenderer;