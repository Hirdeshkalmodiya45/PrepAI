export interface DSAProblem {
  id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
  description: string
  examples: { input: string; output: string; explanation?: string }[]
  constraints: string[]
  boilerplate: string
  solutionSnippet?: string
}

export interface GATESubject {
  id: string
  title: string
  weightage: string
  topics: { name: string; completed: boolean }[]
}

export interface InterviewPreset {
  id: string
  role: string
  type: "Technical" | "System Design" | "HR"
  questions: { id: string; question: string; expectedKeywords: string[]; hints: string }[]
}

export interface EnglishScenario {
  id: string
  title: string
  description: string
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  vocabulary: string[]
  tips: string[]
  template: string
}

export const dsaProblems: DSAProblem[] = [
  {
    id: "dsa-1",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays & Hashing",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
    ],
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9"],
    boilerplate: `function twoSum(nums: number[], target: number): number[] {
    // Write your code here
    return [];
};`,
    solutionSnippet: `function twoSum(nums: number[], target: number): number[] {
    const map = new Map<number, number>();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement)!, i];
        }
        map.set(nums[i], i);
    }
    return [];
}`
  },
  {
    id: "dsa-2",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    category: "Arrays & Hashing",
    description: "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`-th day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
    examples: [
      { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5." },
      { input: "prices = [7,6,4,3,1]", output: "0" }
    ],
    constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
    boilerplate: `function maxProfit(prices: number[]): number {
    // Write your code here
    return 0;
};`
  },
  {
    id: "dsa-3",
    title: "Container With Most Water",
    difficulty: "Medium",
    category: "Two Pointers",
    description: "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i`-th line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.",
    examples: [
      { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49", explanation: "The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water the container can contain is 49." }
    ],
    constraints: ["n == height.length", "2 <= n <= 10^5", "0 <= height[i] <= 10^4"],
    boilerplate: `function maxArea(height: number[]): number {
    // Write your code here
    return 0;
};`
  },
  {
    id: "dsa-4",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "Sliding Window",
    description: "Given a string `s`, find the length of the longest substring without repeating characters.",
    examples: [
      { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: "1" }
    ],
    constraints: ["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces."],
    boilerplate: `function lengthOfLongestSubstring(s: string): number {
    // Write your code here
    return 0;
};`
  },
  {
    id: "dsa-5",
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stacks & Queues",
    description: "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    examples: [
      { input: 's = "()"', output: "true" },
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" }
    ],
    constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'."],
    boilerplate: `function isValid(s: string): boolean {
    // Write your code here
    return false;
};`
  },
  {
    id: "dsa-6",
    title: "Invert Binary Tree",
    difficulty: "Easy",
    category: "Trees",
    description: "Given the `root` of a binary tree, invert the tree, and return its root.",
    examples: [
      { input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]" }
    ],
    constraints: ["The number of nodes in the tree is in the range [0, 100].", "-100 <= Node.val <= 100"],
    boilerplate: `/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */

function invertTree(root: TreeNode | null): TreeNode | null {
    // Write your code here
    return null;
};`
  },
  {
    id: "dsa-7",
    title: "Climbing Stairs",
    difficulty: "Easy",
    category: "Dynamic Programming",
    description: "You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    examples: [
      { input: "n = 2", output: "2", explanation: "There are two ways: 1. 1 step + 1 step, 2. 2 steps" },
      { input: "n = 3", output: "3" }
    ],
    constraints: ["1 <= n <= 45"],
    boilerplate: `function climbStairs(n: number): number {
    // Write your code here
    return 0;
};`
  },
  {
    id: "dsa-8",
    title: "Merge Triplets to Form Target Triplet",
    difficulty: "Medium",
    category: "Greedy",
    description: "You are given a 2D integer array `triplets` and an integer array `target` of length 3.\n\nDetermine if it is possible to obtain `target` by applying a greedy merging operations on the triplets.",
    examples: [
      { input: "triplets = [[2,5,3],[1,8,4],[1,7,5]], target = [2,7,5]", output: "true" }
    ],
    constraints: ["1 <= triplets.length <= 10^5", "triplets[i].length == target.length == 3"],
    boilerplate: `function mergeTriplets(triplets: number[][], target: number[]): boolean {
    // Write your code here
    return false;
};`
  }
]

export const gateSyllabus: GATESubject[] = [
  {
    id: "gate-math",
    title: "Engineering Mathematics",
    weightage: "13-15 Marks",
    topics: [
      { name: "Linear Algebra (Matrices, Eigenvalues, Eigenvectors)", completed: false },
      { name: "Calculus (Limits, Continuity, Partial Derivatives)", completed: false },
      { name: "Probability & Statistics (Mean, Median, Conditional Probability)", completed: false },
      { name: "Mathematical Logic (Propositional & First-Order Logic)", completed: false },
      { name: "Combinatorics (Counting, Recurrence Relations)", completed: false }
    ]
  },
  {
    id: "gate-digital",
    title: "Digital Logic",
    weightage: "4-6 Marks",
    topics: [
      { name: "Boolean Algebra & K-Maps", completed: false },
      { name: "Combinational Circuits (Multiplexers, Decoders)", completed: false },
      { name: "Sequential Circuits (Latches, Flip-Flops, Registers)", completed: false },
      { name: "Number Representations & Codes", completed: false }
    ]
  },
  {
    id: "gate-coa",
    title: "Computer Organization & Architecture",
    weightage: "6-8 Marks",
    topics: [
      { name: "Machine Instructions & Addressing Modes", completed: false },
      { name: "ALU & Data Path Control", completed: false },
      { name: "Instruction Pipelining & Hazards", completed: false },
      { name: "Memory Hierarchy (Cache, Virtual Memory)", completed: false },
      { name: "I/O Interface & DMA transfer", completed: false }
    ]
  },
  {
    id: "gate-programming",
    title: "Programming & Data Structures",
    weightage: "10-12 Marks",
    topics: [
      { name: "Programming in C (Pointers, Recursion, Parameter passing)", completed: false },
      { name: "Arrays, Stacks, Queues & Linked Lists", completed: false },
      { name: "Trees (Binary Trees, BST, AVL Trees)", completed: false },
      { name: "Graphs & Graph Representations", completed: false }
    ]
  },
  {
    id: "gate-algorithms",
    title: "Algorithms",
    weightage: "8-10 Marks",
    topics: [
      { name: "Asymptotic Analysis & Recurrences", completed: false },
      { name: "Sorting & Searching Algorithms", completed: false },
      { name: "Divide and Conquer, Greedy & Dynamic Programming", completed: false },
      { name: "Graph Traversals (BFS, DFS, Dijkstra, MST)", completed: false }
    ]
  },
  {
    id: "gate-toc",
    title: "Theory of Computation",
    weightage: "8-10 Marks",
    topics: [
      { name: "Regular Languages (DFA, NFA, Regular Expressions)", completed: false },
      { name: "Context-Free Languages (CFG, PDA)", completed: false },
      { name: "Turing Machines & Decidability", completed: false }
    ]
  },
  {
    id: "gate-compiler",
    title: "Compiler Design",
    weightage: "4-6 Marks",
    topics: [
      { name: "Lexical Analysis & Parsing (LL, LR, LALR)", completed: false },
      { name: "Syntax-Directed Translation", completed: false },
      { name: "Intermediate Code Generation & Optimization", completed: false }
    ]
  },
  {
    id: "gate-os",
    title: "Operating Systems",
    weightage: "8-10 Marks",
    topics: [
      { name: "System Calls, Processes & Threads", completed: false },
      { name: "CPU Scheduling Algorithms", completed: false },
      { name: "Inter-Process Communication & Semaphores", completed: false },
      { name: "Deadlock Detection, Prevention & Avoidance", completed: false },
      { name: "Memory Management & Paging", completed: false },
      { name: "File Systems & Disk Scheduling", completed: false }
    ]
  },
  {
    id: "gate-dbms",
    title: "Databases (DBMS)",
    weightage: "6-8 Marks",
    topics: [
      { name: "ER-Model & Relational Algebra", completed: false },
      { name: "SQL Queries & Structured Joins", completed: false },
      { name: "Database Normalization (1NF, 2NF, 3NF, BCNF)", completed: false },
      { name: "Transactions & Concurrency Control (2PL)", completed: false }
    ]
  },
  {
    id: "gate-cn",
    title: "Computer Networks",
    weightage: "8-10 Marks",
    topics: [
      { name: "OSI & TCP/IP Protocol Stacks", completed: false },
      { name: "Data Link Layer (Flow/Error Control, CSMA/CD)", completed: false },
      { name: "Network Layer (Routing Algorithms, IPv4, Subnetting)", completed: false },
      { name: "Transport Layer (TCP, UDP, Congestion Control)", completed: false },
      { name: "Application Protocols (HTTP, DNS, SMTP)", completed: false }
    ]
  }
]

export const interviewPresets: InterviewPreset[] = [
  {
    id: "role-frontend",
    role: "Frontend Engineer",
    type: "Technical",
    questions: [
      {
        id: "q-fe-1",
        question: "Explain the virtual DOM and how React reconciliation works.",
        expectedKeywords: ["virtual DOM", "reconciliation", "diffing", "fiber", "render", "keys"],
        hints: "Mention how React compares the previous virtual tree with the new one and batches update calls to optimize layout reflows."
      },
      {
        id: "q-fe-2",
        question: "What is the difference between client-side rendering (CSR) and server-side rendering (SSR)?",
        expectedKeywords: ["CSR", "SSR", "SEO", "hydration", "bundle size", "FCP", "TTI"],
        hints: "Compare initial load time, search engine friendliness (SEO), rendering location (server vs browser) and JavaScript bundle hydration."
      },
      {
        id: "q-fe-3",
        question: "How do you optimize a React application's rendering performance?",
        expectedKeywords: ["memo", "useMemo", "useCallback", "lazy load", "suspense", "code splitting", "virtualization"],
        hints: "Focus on preventing unnecessary re-renders, caching heavy computations, and loading only what is needed dynamically."
      }
    ]
  },
  {
    id: "role-backend",
    role: "Backend Engineer",
    type: "Technical",
    questions: [
      {
        id: "q-be-1",
        question: "How do database indexes improve query speeds, and what are their drawbacks?",
        expectedKeywords: ["index", "B-tree", "write performance", "disk space", "lookup", "explain plan"],
        hints: "Explain indexing structure, read vs write performance trade-offs, and index maintenance costs."
      },
      {
        id: "q-be-2",
        question: "Explain the difference between SQL (Relational) and NoSQL (Document/Key-Value) databases.",
        expectedKeywords: ["SQL", "NoSQL", "ACID", "schema", "scaling", "horizontal", "vertical", "joins"],
        hints: "Focus on transaction reliability (ACID compliance), schema flexibility, join complexity, and scaling limits."
      }
    ]
  },
  {
    id: "role-sysdesign",
    role: "System Design Engineer",
    type: "System Design",
    questions: [
      {
        id: "q-sd-1",
        question: "How would you design a rate limiter for a public API gateway?",
        expectedKeywords: ["rate limiter", "token bucket", "leaky bucket", "redis", "sliding window", "distributed"],
        hints: "Outline algorithms (like Token Bucket), caching with Redis, scalability, handling concurrency, and return status codes (429)."
      },
      {
        id: "q-sd-2",
        question: "Explain CDN caching strategies and how they improve content delivery speeds globally.",
        expectedKeywords: ["CDN", "caching", "edge server", "TTL", "cache invalidation", "latency"],
        hints: "Discuss geographical routing, reducing server load, Time-to-Live settings, and push vs pull content delivery methods."
      }
    ]
  },
  {
    id: "role-hr",
    role: "Software Developer",
    type: "HR",
    questions: [
      {
        id: "q-hr-1",
        question: "Tell me about a time you faced a difficult conflict within a team project and how you resolved it.",
        expectedKeywords: ["conflict", "communication", "compromise", "collaboration", "resolution", "STAR method"],
        hints: "Utilize the STAR framework: Situation, Task, Action, Result. Highlight active listening, focus on factual goals, and building team consensus."
      },
      {
        id: "q-hr-2",
        question: "Why should we hire you over other candidates for this engineering role?",
        expectedKeywords: ["learning", "adaptability", "passion", "problem solver", "growth mindset", "impact"],
        hints: "Align your technical abilities, cultural fit, willingness to learn new technologies, and focus on delivering business value."
      }
    ]
  }
]

export const englishScenarios: EnglishScenario[] = [
  {
    id: "eng-1",
    title: "The Professional Elevator Pitch",
    description: "Practice your 60-second introduction to a potential recruiter, detailing your background, core strengths, and goals.",
    duration: "1 minute",
    difficulty: "Intermediate",
    vocabulary: ["proactive", "proficient", "collaborated", "orchestrated", "milestone", "leveraged"],
    tips: [
      "Keep a confident, steady pace of around 130-150 words per minute.",
      "Use strong action verbs instead of passive phrases (e.g. 'I led' rather than 'I was involved in').",
      "Conclude with a clear statement of what you're looking for."
    ],
    template: "Hello, my name is [Name]. I am a final-year [Major] student specializing in [Field]. Recently, I built a [Project Name] which solved [Problem statement] and achieved a [specific result]. I'm passionate about [technology] and am looking for a challenging role in [Domain] where I can contribute to..."
  },
  {
    id: "eng-2",
    title: "Explaining a Project Architecture",
    description: "Practice explaining a complex technical system to a non-technical manager or recruiter.",
    duration: "2 minutes",
    difficulty: "Advanced",
    vocabulary: ["scalability", "robust", "microservices", "redundancy", "bottleneck", "optimization"],
    tips: [
      "Avoid excessive technical jargon. Use analogies to explain server load or network queues.",
      "Structure your explanation: Context -> Problem -> Design Choice -> Impact."
    ],
    template: "The project is a [Type of App] designed to [Core Purpose]. At a high level, the system consists of three main parts: the user interface, the API gateway, and the databases. We chose to implement [Technology X] because it allowed us to..."
  },
  {
    id: "eng-3",
    title: "Discussing a Mistake or Failure",
    description: "Answering the standard behavioral question: 'Tell me about a time you failed.'",
    duration: "1.5 minutes",
    difficulty: "Intermediate",
    vocabulary: ["oversight", "rectified", "retrospective", "accountability", "constructive feedback"],
    tips: [
      "Take accountability quickly; do not blame others or external factors.",
      "Spend 20% of the time explaining the mistake, and 80% on the recovery action and what you learned."
    ],
    template: "During my internship, I was tasked with [Task]. However, due to a misunderstanding of [Concept], I [Mistake]. Once I realized, I immediately notified my mentor and we [Recovery Action]. This taught me the importance of..."
  }
]
