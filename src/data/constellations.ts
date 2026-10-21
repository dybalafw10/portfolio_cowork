export interface ConstellationCluster {
  id: string;
  organization: string;
  placement: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  width: number;
  height: number;
  nodes: { id: string; x: number; y: number }[];
  edges: [string, string][];
}

// Coordinates are local fractions, not independent line endpoints.
// Each cluster is an open tree: connected, with no cycles or cross-cluster edges.
export const constellationClusters: ConstellationCluster[] = [
  {
    id: "weather",
    organization: "weather",
    placement: "top-left",
    width: 154,
    height: 70,
    nodes: [
      { id: "a", x: 0.03, y: 0.7 },
      { id: "b", x: 0.29, y: 0.43 },
      { id: "c", x: 0.55, y: 0.55 },
      { id: "d", x: 0.78, y: 0.12 },
      { id: "e", x: 0.98, y: 0.25 },
    ],
    edges: [
      ["a", "b"],
      ["b", "c"],
      ["c", "d"],
      ["d", "e"],
    ],
  },
  {
    id: "science",
    organization: "science",
    placement: "top-right",
    width: 132,
    height: 84,
    nodes: [
      { id: "a", x: 0, y: 0.2 },
      { id: "b", x: 0.23, y: 0.55 },
      { id: "c", x: 0.45, y: 0.32 },
      { id: "d", x: 0.62, y: 0.7 },
      { id: "e", x: 0.97, y: 0.85 },
      { id: "f", x: 0.73, y: 0.05 },
    ],
    edges: [
      ["a", "b"],
      ["b", "c"],
      ["c", "d"],
      ["d", "e"],
      ["c", "f"],
    ],
  },
  {
    id: "kiat",
    organization: "kiat",
    placement: "bottom-left",
    width: 145,
    height: 88,
    nodes: [
      { id: "a", x: 0.03, y: 0.13 },
      { id: "b", x: 0.27, y: 0.39 },
      { id: "c", x: 0.41, y: 0.93 },
      { id: "d", x: 0.69, y: 0.6 },
      { id: "e", x: 0.96, y: 0.8 },
    ],
    edges: [
      ["a", "b"],
      ["b", "c"],
      ["b", "d"],
      ["d", "e"],
    ],
  },
  {
    id: "mg",
    organization: "mg",
    placement: "bottom-right",
    width: 158,
    height: 76,
    nodes: [
      { id: "a", x: 0.04, y: 0.72 },
      { id: "b", x: 0.27, y: 0.42 },
      { id: "c", x: 0.45, y: 0.63 },
      { id: "d", x: 0.58, y: 0.24 },
      { id: "e", x: 0.83, y: 0.04 },
      { id: "f", x: 0.97, y: 0.3 },
      { id: "g", x: 0.93, y: 0.87 },
    ],
    edges: [
      ["a", "b"],
      ["b", "c"],
      ["c", "d"],
      ["d", "e"],
      ["e", "f"],
      ["c", "g"],
    ],
  },
];
