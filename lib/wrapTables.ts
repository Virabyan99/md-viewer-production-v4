import { visit } from "unist-util-visit";

export function wrapTables() {
  return (tree: any) => {
    visit(tree, "element", (node: any, index: number | undefined, parent: any) => {
      if (node.tagName === "table" && typeof index === "number" && parent) {
        const wrapper = {
          type: "element",
          tagName: "div",
          properties: { className: ["relative", "overflow-x-auto"] },
          children: [
            {
              type: "element",
              tagName: "div",
              properties: {
                style: {
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  width: "24px",
                  background: "linear-gradient(to right, var(--background), transparent)",
                  pointerEvents: "none",
                },
              },
              children: [],
            },
            {
              type: "element",
              tagName: "div",
              properties: {
                style: {
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  right: 0,
                  width: "24px",
                  background: "linear-gradient(to left, var(--background), transparent)",
                  pointerEvents: "none",
                },
              },
              children: [],
            },
            node,
          ],
        };
        parent.children[index] = wrapper;
      }
    });
  };
}