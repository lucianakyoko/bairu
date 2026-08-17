import node from "@bairu/config-eslint/node";

export default [
  ...node,
  {
    ignores: ["dist/**", "node_modules/**"],
  },
];
