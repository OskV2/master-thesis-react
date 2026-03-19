/**
 * BstVisualizationSVG — renders a BST as a tree diagram.
 *
 * Uses the serialized tree (flat node array with inOrderPos and depth)
 * to compute x/y positions. Draws edges then nodes on top.
 *
 * Props:
 *   step — current BST step object (has .tree, .highlighted, .path)
 *   height — SVG height
 */

import { motion } from "motion/react";

const COLORS = {
  node: "#3b82f6",         // blue — default
  highlighted: "#f59e0b",  // amber — currently active
  path: "#6366f1",         // indigo — traversal path
  found: "#10b981",        // emerald — found / placed
  edge: "#475569",         // slate-600
  text: "#f1f5f9",
};

const NODE_RADIUS = 22;
const TRANSITION = { type: "tween", duration: 0.3, ease: "easeInOut" };

export default function BstVisualizationSVG({ step, height = 450 }) {
  if (!step || !step.tree) return null;

  const tree = step.tree;
  const highlighted = step.highlighted ?? [];
  const path = step.path ?? [];

  if (tree.length === 0) {
    return (
      <svg width="100%" height={height} viewBox={`0 0 600 ${height}`}
        className="rounded-xl bg-surface-light border border-slate-700/50">
        <text x={300} y={height / 2} textAnchor="middle"
          fill="#64748b" fontSize={14} fontFamily="'JetBrains Mono', monospace">
          Drzewo puste
        </text>
      </svg>
    );
  }

  // Compute positions
  const maxDepth = Math.max(...tree.map((n) => n.depth));
  const totalNodes = tree.length;

  const paddingX = 40;
  const paddingY = 50;
  const width = Math.max(totalNodes * (NODE_RADIUS * 2 + 10) + paddingX * 2, 600);
  const levelHeight = Math.min(
    (height - paddingY * 2) / (maxDepth + 1),
    80
  );

  // x from inOrderPos, y from depth
  const xStep = (width - paddingX * 2) / (totalNodes + 1);

  const nodePositions = {};
  tree.forEach((node) => {
    const x = paddingX + (node.inOrderPos + 1) * xStep;
    const y = paddingY + node.depth * levelHeight + NODE_RADIUS;
    nodePositions[node.id] = { x, y, ...node };
  });

  function getNodeColor(nodeId) {
    if (highlighted.includes(nodeId)) {
      // Check step type for more specific coloring
      if (step.type.includes("place") || step.type.includes("found") || step.type.includes("done")) {
        return COLORS.found;
      }
      return COLORS.highlighted;
    }
    if (path.includes(nodeId)) return COLORS.path;
    return COLORS.node;
  }

  // Build edges
  const edges = [];
  tree.forEach((node) => {
    const from = nodePositions[node.id];
    if (node.leftId != null && nodePositions[node.leftId]) {
      const to = nodePositions[node.leftId];
      edges.push({ from, to, key: `${node.id}-${node.leftId}` });
    }
    if (node.rightId != null && nodePositions[node.rightId]) {
      const to = nodePositions[node.rightId];
      edges.push({ from, to, key: `${node.id}-${node.rightId}` });
    }
  });

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="rounded-xl bg-surface-light border border-slate-700/50"
    >
      {/* Edges */}
      {edges.map((edge) => (
        <motion.line
          key={edge.key}
          animate={{
            x1: edge.from.x,
            y1: edge.from.y,
            x2: edge.to.x,
            y2: edge.to.y,
          }}
          stroke={COLORS.edge}
          strokeWidth={2}
          transition={TRANSITION}
        />
      ))}

      {/* Nodes */}
      {tree.map((node) => {
        const pos = nodePositions[node.id];
        const color = getNodeColor(node.id);

        return (
          <g key={node.id}>
            <motion.circle
              animate={{
                cx: pos.x,
                cy: pos.y,
                fill: color,
              }}
              r={NODE_RADIUS}
              stroke={highlighted.includes(node.id) ? COLORS.highlighted : "transparent"}
              strokeWidth={highlighted.includes(node.id) ? 3 : 0}
              transition={TRANSITION}
            />
            <motion.text
              animate={{ x: pos.x, y: pos.y + 5 }}
              textAnchor="middle"
              fontSize={13}
              fontFamily="'JetBrains Mono', monospace"
              fontWeight="700"
              fill={COLORS.text}
              transition={TRANSITION}
            >
              {node.value}
            </motion.text>
          </g>
        );
      })}
    </svg>
  );
}