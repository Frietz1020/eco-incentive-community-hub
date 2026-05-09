import { useMemo } from "react";

/**
 * Animated blockchain-themed SVG background.
 * Renders interconnected nodes with flowing dashed links.
 */
export default function BlockchainBackground() {
  const nodes = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 28; i++) {
      pts.push({
        id: i,
        cx: 5 + Math.random() * 90,
        cy: 5 + Math.random() * 90,
        r: 3 + Math.random() * 4,
        delay: Math.random() * 4,
      });
    }
    return pts;
  }, []);

  const links = useMemo(() => {
    const edges = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].cx - nodes[j].cx;
        const dy = nodes[i].cy - nodes[j].cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 25) {
          edges.push({
            x1: nodes[i].cx,
            y1: nodes[i].cy,
            x2: nodes[j].cx,
            y2: nodes[j].cy,
            accent: Math.random() > 0.6,
            delay: Math.random() * 6,
          });
        }
      }
    }
    return edges;
  }, [nodes]);

  return (
    <div className="blockchain-bg" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {links.map((link, i) => (
          <line
            key={`link-${i}`}
            x1={`${link.x1}%`}
            y1={`${link.y1}%`}
            x2={`${link.x2}%`}
            y2={`${link.y2}%`}
            className={link.accent ? "chain-link-accent" : "chain-link"}
            style={{ animationDelay: `${-link.delay}s` }}
          />
        ))}
        {nodes.map((node) => (
          <circle
            key={`node-${node.id}`}
            cx={`${node.cx}%`}
            cy={`${node.cy}%`}
            r={node.r}
            className="chain-node"
            style={{ animationDelay: `${-node.delay}s` }}
          />
        ))}
      </svg>
    </div>
  );
}
