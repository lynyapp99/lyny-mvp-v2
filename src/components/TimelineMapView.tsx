import { useState, useRef, useCallback, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Map, Clock, Users, Heart, Play, Home as HomeIcon, Target, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IOSButton } from "@/components/ui/ios-button";
import { type TimelineMemory } from "@/data/timelineMemories";
import TimelineMapCard from "./TimelineMapCard";

interface TimelineMapViewProps {
  memories: TimelineMemory[];
  onMemoryClick: (memory: TimelineMemory) => void;
  onBack: () => void;
  timelineTitle: string;
}

type LayoutType = "linha" | "mapa" | "constelacao";

interface MapNode {
  id: string;
  memory: TimelineMemory;
  x: number;
  y: number;
  size: number;
  cluster?: string;
}

const TimelineMapView = ({ memories, onMemoryClick, onBack, timelineTitle }: TimelineMapViewProps) => {
  const [layout, setLayout] = useState<LayoutType>("linha");
  const [nodes, setNodes] = useState<MapNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);
  const [isTourActive, setIsTourActive] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const transformRef = useRef<any>(null);
  const lastTapRef = useRef<number>(0);

  // Calculate node positions based on layout
  const calculateLayout = useCallback((layoutType: LayoutType) => {
    const newNodes: MapNode[] = [];
    const sortedMemories = [...memories].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    switch (layoutType) {
      case "linha": {
        // Timeline layout - horizontal by time
        const spacing = 280;
        const yBase = 400;
        sortedMemories.forEach((memory, index) => {
          newNodes.push({
            id: memory.id,
            memory,
            x: 200 + index * spacing,
            y: yBase + (index % 2 === 0 ? -60 : 60),
            size: memory.milestone ? 140 : 100,
          });
        });
        break;
      }

      case "mapa": {
        // Geographic layout - by location coordinates
        sortedMemories.forEach((memory, index) => {
          const coords = memory.content.location?.coordinates;
          if (coords) {
            // Convert lat/lng to canvas coordinates
            // Normalize to canvas space (simplified projection)
            const x = ((coords[0] + 180) / 360) * 3000 + 500;
            const y = ((90 - coords[1]) / 180) * 2000 + 300;
            newNodes.push({
              id: memory.id,
              memory,
              x,
              y,
              size: memory.milestone ? 140 : 100,
            });
          } else {
            // No location - cluster at center
            newNodes.push({
              id: memory.id,
              memory,
              x: 1500 + (index % 5) * 120,
              y: 800 + Math.floor(index / 5) * 120,
              size: 80,
            });
          }
        });
        break;
      }

      case "constelacao": {
        // Constellation layout - by people/feelings similarity
        const clusters: { [key: string]: MapNode[] } = {};
        
        sortedMemories.forEach((memory) => {
          const author = memory.authorName;
          if (!clusters[author]) clusters[author] = [];
          
          const clusterNodes = clusters[author];
          const angle = (clusterNodes.length / 6) * Math.PI * 2;
          const radius = 200 + clusterNodes.length * 40;
          const centerX = 1200 + Object.keys(clusters).indexOf(author) * 600;
          const centerY = 800;
          
          newNodes.push({
            id: memory.id,
            memory,
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
            size: memory.milestone ? 140 : 100,
            cluster: author,
          });
          
          clusterNodes.push(newNodes[newNodes.length - 1]);
        });
        break;
      }
    }

    setNodes(newNodes);
  }, [memories]);

  useEffect(() => {
    calculateLayout(layout);
  }, [layout, calculateLayout]);

  // Tour functionality
  const startTour = useCallback(() => {
    const milestones = nodes.filter(n => n.memory.milestone);
    if (milestones.length === 0) {
      setIsTourActive(true);
      setTourIndex(0);
      return;
    }
    
    setIsTourActive(true);
    setTourIndex(0);
    
    // Animate to first milestone
    if (transformRef.current && milestones[0]) {
      const { centerView } = transformRef.current;
      centerView(milestones[0].x, milestones[0].y, 1.5);
    }
  }, [nodes]);

  const nextTourStop = useCallback(() => {
    const milestones = nodes.filter(n => n.memory.milestone);
    const nextIndex = (tourIndex + 1) % Math.max(milestones.length, nodes.length);
    setTourIndex(nextIndex);
    
    const target = milestones[nextIndex] || nodes[nextIndex];
    if (target && transformRef.current) {
      const { centerView } = transformRef.current;
      centerView(target.x, target.y, 1.5);
      setSelectedNode(target);
    }
    
    if (nextIndex === 0) {
      setIsTourActive(false);
    }
  }, [nodes, tourIndex]);

  useEffect(() => {
    if (isTourActive) {
      const timer = setTimeout(nextTourStop, 3000);
      return () => clearTimeout(timer);
    }
  }, [isTourActive, nextTourStop]);

  const handleNodeClick = (node: MapNode, event: React.MouseEvent) => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;
    
    if (timeSinceLastTap < 300) {
      // Double tap - zoom in
      if (transformRef.current) {
        const { centerView } = transformRef.current;
        centerView(node.x, node.y, 2);
      }
    } else {
      // Single tap - show card
      setSelectedNode(node);
    }
    
    lastTapRef.current = now;
  };

  const handleRecenter = () => {
    if (transformRef.current) {
      transformRef.current.resetTransform();
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-background/95 to-transparent">
        <div className="flex items-center gap-3 mb-4">
          <IOSButton variant="ghost" size="icon" onClick={onBack}>
            <List size={20} />
          </IOSButton>
          <h1 className="text-lg font-semibold flex-1">{timelineTitle}</h1>
        </div>

        {/* Layout chips */}
        <div className="flex gap-2">
          <button
            onClick={() => setLayout("linha")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              layout === "linha"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground"
            }`}
          >
            <Clock size={14} />
            Linha
          </button>
          <button
            onClick={() => setLayout("mapa")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              layout === "mapa"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground"
            }`}
          >
            <Map size={14} />
            Mapa
          </button>
          <button
            onClick={() => setLayout("constelacao")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              layout === "constelacao"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground"
            }`}
          >
            <Users size={14} />
            Constelação
          </button>
        </div>
      </div>

      {/* Canvas */}
      <TransformWrapper
        ref={transformRef}
        initialScale={1}
        minScale={0.5}
        maxScale={4}
        limitToBounds={false}
        centerOnInit={true}
        wheel={{ smoothStep: 0.005 }}
        doubleClick={{ disabled: true }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <TransformComponent
              wrapperClass="!w-full !h-full"
              contentClass="!w-full !h-full"
            >
              <svg
                width="4000"
                height="3000"
                className="bg-muted/20"
                style={{ cursor: "grab" }}
              >
                {/* Connection lines */}
                {layout === "linha" && nodes.map((node, i) => {
                  if (i === 0) return null;
                  const prev = nodes[i - 1];
                  return (
                    <line
                      key={`line-${node.id}`}
                      x1={prev.x}
                      y1={prev.y}
                      x2={node.x}
                      y2={node.y}
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      strokeOpacity="0.3"
                      strokeDasharray="5,5"
                    />
                  );
                })}

                {/* Cluster connections for constellation */}
                {layout === "constelacao" && nodes.map((node, i) => {
                  return nodes
                    .filter(n => n.cluster === node.cluster && n.id !== node.id)
                    .map(target => (
                      <line
                        key={`cluster-${node.id}-${target.id}`}
                        x1={node.x}
                        y1={node.y}
                        x2={target.x}
                        y2={target.y}
                        stroke="hsl(var(--primary))"
                        strokeWidth="1"
                        strokeOpacity="0.2"
                      />
                    ));
                })}

                {/* Nodes */}
                {nodes.map((node) => {
                  const coverImage = node.memory.content.photos?.[0];
                  const isSelected = selectedNode?.id === node.id;
                  
                  return (
                    <g
                      key={node.id}
                      onClick={(e) => handleNodeClick(node, e as any)}
                      className="cursor-pointer transition-transform hover:scale-110"
                      style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                    >
                      {/* Glow for milestones */}
                      {node.memory.milestone && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={node.size / 2 + 10}
                          fill="hsl(var(--primary))"
                          fillOpacity="0.15"
                          className="animate-pulse"
                        />
                      )}
                      
                      {/* Node circle */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.size / 2}
                        fill={coverImage ? "none" : "hsl(var(--card))"}
                        stroke={isSelected ? "hsl(var(--primary))" : "hsl(var(--border))"}
                        strokeWidth={isSelected ? "4" : "3"}
                      />
                      
                      {/* Image clip */}
                      {coverImage && (
                        <>
                          <defs>
                            <clipPath id={`clip-${node.id}`}>
                              <circle cx={node.x} cy={node.y} r={node.size / 2 - 2} />
                            </clipPath>
                          </defs>
                          <image
                            href={coverImage}
                            x={node.x - node.size / 2}
                            y={node.y - node.size / 2}
                            width={node.size}
                            height={node.size}
                            clipPath={`url(#clip-${node.id})`}
                            preserveAspectRatio="xMidYMid slice"
                          />
                        </>
                      )}

                      {/* Milestone star */}
                      {node.memory.milestone && (
                        <g transform={`translate(${node.x - 10}, ${node.y - node.size / 2 - 28})`}>
                          <circle r="12" cx="10" cy="10" fill="hsl(var(--primary))" />
                          <path
                            d="M10 4l1.8 3.6 4 .6-2.9 2.8.7 4L10 13.2 6.4 15l.7-4L4.2 8.2l4-.6L10 4z"
                            fill="hsl(var(--primary-foreground))"
                          />
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            </TransformComponent>

            {/* Controls */}
            <div className="absolute right-4 bottom-24 flex flex-col gap-2 z-10">
              <IOSButton
                size="icon"
                onClick={() => zoomIn()}
                className="bg-card shadow-lg"
              >
                +
              </IOSButton>
              <IOSButton
                size="icon"
                onClick={() => zoomOut()}
                className="bg-card shadow-lg"
              >
                −
              </IOSButton>
              <IOSButton
                size="icon"
                onClick={handleRecenter}
                className="bg-card shadow-lg"
              >
                <Target size={18} />
              </IOSButton>
              <IOSButton
                size="icon"
                onClick={startTour}
                className={`bg-card shadow-lg ${isTourActive ? "bg-primary text-primary-foreground" : ""}`}
              >
                <Play size={18} />
              </IOSButton>
            </div>
          </>
        )}
      </TransformWrapper>

      {/* Floating card */}
      {selectedNode && (
        <TimelineMapCard
          memory={selectedNode.memory}
          onClose={() => setSelectedNode(null)}
          onOpen={() => onMemoryClick(selectedNode.memory)}
        />
      )}
    </div>
  );
};

export default TimelineMapView;
