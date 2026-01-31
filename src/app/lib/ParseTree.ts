import ParseTreeNode from "./ParseTreeNode";

export class ParseTree {
  root: ParseTreeNode | null = null;

  /** Tracking backtrack order */
  backtrackedNodeSize: number = 0;  // how many nodes backtracked so far
  currentBacktracked: number = -1;  // last backtracked priority index

  constructor(rootValue?: string) {
    if (rootValue) this.root = new ParseTreeNode(rootValue, 0);
  }

  /**
   * Mark a node as backtracked for the visualizer
   */
  markBacktrack(node: ParseTreeNode, reason?: "fail" | "leaf") {
    this.currentBacktracked++;
    node.backtracked = true;
    node.backtrackedPriorityIndex = this.currentBacktracked;
    node.deletedForUI = reason === "fail";       // hide if failure
    node.wasLeafBacktrack = reason === "leaf";   // leaf, not failure
    this.backtrackedNodeSize++;
  }

  /**
   * Moves up to the parent until a node with unexplored branches is found
   */
  climbUpUntilChoice(node: ParseTreeNode): ParseTreeNode | null {
    let current = node;
    while (current && current.backtracked) {
      current = current.parent!;
    }
    return current || null;
  }
}


/*
json sample for parse tree:
the example consider the Grammar: R->AA  and input string: rrbb using backtracking always trying first production and if that doesnt 
                                  A->rA
                                  A->b
                                                            works backtracks and try the 2nd and so on.

ParseTreeNodes
{
    {
        value: R
        actions: [1,8]
        die: false
    },
    {
        value: A
        actions: [2, 3]
        die: false
    },
    {
        value: r
        actions:null // it's a child node
        die: false
    },
    {
        value: A
        actions: [4, 5]
        die: false
    },
    {
        value: r
        actions: null 
        die: false
    },
    {
        value: A
        actions: [6, 7]
        die: false
    },
    {
        value: r
        actions: null
        die: true
    },
    {
        value: b
        actions: null
        die: false
    },
    {
        value: A
        actions: [9, 10]
        die: false
    },
    {
        value: r
        action: null
        die: true
    },
    {
        value: b
        action: null
        die: false
    }
}
*/