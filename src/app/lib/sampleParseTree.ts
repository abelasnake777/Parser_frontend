export interface ParseTreeNode {
  value: string;
  actions: number[] | null;
  die: boolean;
}

const parseTreeNodes: ParseTreeNode[] = [
  { value: "R", actions: [1, 8], die: false },
  { value: "A", actions: [2, 3], die: false },
  { value: "r", actions: null, die: false },
  { value: "A", actions: [4, 5], die: false },
  { value: "r", actions: null, die: false },
  { value: "A", actions: [6, 7], die: false },
  { value: "r", actions: null, die: true },
  { value: "b", actions: null, die: false },
  { value: "A", actions: [9, 10], die: false },
  { value: "r", actions: null, die: true },
  { value: "b", actions: null, die: false }
];

export default parseTreeNodes;


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