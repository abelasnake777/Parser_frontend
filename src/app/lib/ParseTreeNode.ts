// export default class ParseTreeNode {
//   value: string;                      
//   level: number;                      
//   children: ParseTreeNode[] = [];     
//   parent: ParseTreeNode | null = null;
//   childIndex: number | null = null;   

//   /* Backtracking-related attributes */
//   backtracked: boolean = false;             // if this node was backtracked by traversal logic
//   backtrackedPriorityIndex: number = -1;     // -1 mean never backtracked
//   deletedForUI: boolean = false;             // hide in UI but keep in structure
//   reachedLeafWithoutMatch: boolean = false;  // true = leaf reached but input mismatch
//   wasLeafBacktrack: boolean = false;         // reached leaf and backtracked by design (not failure)

//   constructor(value: string, level = 0) {
//     this.value = value;
//     this.level = level;
//   }

//   addChild(node: ParseTreeNode) {
//     node.parent = this;
//     node.level = this.level + 1;
//     node.childIndex = this.children.length + 1;
//     this.children.push(node);
//   }
// }