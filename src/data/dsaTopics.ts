// Comprehensive DSA Topics with Professional Resources

export interface DSATopic {
  id: string;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: string;
  problemsCount: number;
  striverVideoUrl: string;
  striverSeriesUrl: string;
  blogUrl: string;
  leetcodeUrl: string;
  categoryColor: string;
  description: string;
  preparationPlan: {
    shortTerm: string[];
    longTerm: string[];
  };
  resources: {
    videos: { title: string; url: string; duration: string }[];
    articles: { title: string; url: string; readTime: string }[];
    practice: { platform: string; url: string; problems: number }[];
    notes: { title: string; url: string; type: string }[];
  };
  roadmapPosition: {
    phase: 'Beginner' | 'Intermediate' | 'Advanced';
    order: number;
  };
}

export const dsaTopics: DSATopic[] = [
  // Arrays & Strings (20 topics)
  {
    id: 'array-basics',
    title: 'Array Fundamentals',
    category: 'Arrays & Strings',
    difficulty: 'Easy',
    estimatedTime: '3 hours',
    problemsCount: 15,
    striverVideoUrl: 'https://www.youtube.com/watch?v=37E9ckMDdTk',
    striverSeriesUrl: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0rENwdL0n-E0TV6IXrvsjQr',
    blogUrl: 'https://www.geeksforgeeks.org/array-data-structure/',
    leetcodeUrl: 'https://leetcode.com/problems/two-sum/',
    categoryColor: '220 100% 60%',
    description: 'Master array operations, indexing, and basic algorithms',
    preparationPlan: {
      shortTerm: [
        'Understand array declaration and initialization',
        'Practice basic traversal and searching',
        'Solve 10 easy array problems daily',
        'Master time and space complexity analysis'
      ],
      longTerm: [
        'Complete 100+ array problems across all difficulties',
        'Master advanced array techniques',
        'Understand memory management in arrays',
        'Apply arrays in system design scenarios'
      ]
    },
    resources: {
      videos: [
        { title: 'Array Basics - Striver', url: 'https://www.youtube.com/watch?v=37E9ckMDdTk', duration: '45 min' },
        { title: 'Array Problems Playlist', url: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0rENwdL0n-E0TV6IXrvsjQr', duration: '10 hours' },
        { title: 'Arrays in C++ - CodeHelp', url: 'https://www.youtube.com/watch?v=mINNWlvbLLI', duration: '2 hours' }
      ],
      articles: [
        { title: 'Array Data Structure - GFG', url: 'https://www.geeksforgeeks.org/array-data-structure/', readTime: '15 min' },
        { title: 'Array Interview Questions', url: 'https://www.interviewbit.com/array-interview-questions/', readTime: '30 min' },
        { title: 'Arrays in Programming', url: 'https://www.programiz.com/dsa/array', readTime: '20 min' }
      ],
      practice: [
        { platform: 'LeetCode', url: 'https://leetcode.com/tag/array/', problems: 500 },
        { platform: 'HackerRank', url: 'https://www.hackerrank.com/domains/data-structures/arrays', problems: 50 },
        { platform: 'CodeChef', url: 'https://www.codechef.com/practice/arrays', problems: 100 },
        { platform: 'Codeforces', url: 'https://codeforces.com/problemset?tags=implementation', problems: 200 }
      ],
      notes: [
        { title: 'Array Cheat Sheet', url: 'https://www.techinterviewhandbook.org/algorithms/array/', type: 'PDF' },
        { title: 'Array Patterns', url: 'https://github.com/SeanPrashad/leetcode-patterns', type: 'GitHub' }
      ]
    },
    roadmapPosition: { phase: 'Beginner', order: 1 }
  },
  {
    id: 'two-pointers',
    title: 'Two Pointers Technique',
    category: 'Arrays & Strings',
    difficulty: 'Medium',
    estimatedTime: '4 hours',
    problemsCount: 25,
    striverVideoUrl: 'https://www.youtube.com/watch?v=OnLoX6Nhvmg',
    striverSeriesUrl: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0rENwdL0n-E0TV6IXrvsjQr',
    blogUrl: 'https://www.geeksforgeeks.org/two-pointers-technique/',
    leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/',
    categoryColor: '220 100% 60%',
    description: 'Efficient array traversal using two pointers approach',
    preparationPlan: {
      shortTerm: [
        'Understand left-right pointer movement',
        'Practice palindrome and pair sum problems',
        'Master fast-slow pointer technique',
        'Solve 15 two-pointer problems'
      ],
      longTerm: [
        'Apply two pointers in string problems',
        'Combine with sliding window technique',
        'Master three pointers approach',
        'Solve advanced optimization problems'
      ]
    },
    resources: {
      videos: [
        { title: 'Two Pointers - Complete Guide', url: 'https://www.youtube.com/watch?v=OnLoX6Nhvmg', duration: '1 hour' },
        { title: 'Two Pointers Problems', url: 'https://www.youtube.com/playlist?list=PLot-Xpze53leOBgcVsJBEGrHPd_7x_koV', duration: '3 hours' }
      ],
      articles: [
        { title: 'Two Pointers Technique - GFG', url: 'https://www.geeksforgeeks.org/two-pointers-technique/', readTime: '20 min' },
        { title: 'Two Pointers Pattern', url: 'https://emre.me/algorithms/two-pointers/', readTime: '15 min' }
      ],
      practice: [
        { platform: 'LeetCode', url: 'https://leetcode.com/tag/two-pointers/', problems: 150 },
        { platform: 'InterviewBit', url: 'https://www.interviewbit.com/courses/programming/topics/two-pointers/', problems: 25 }
      ],
      notes: [
        { title: 'Two Pointers Patterns', url: 'https://github.com/SeanPrashad/leetcode-patterns', type: 'GitHub' }
      ]
    },
    roadmapPosition: { phase: 'Beginner', order: 3 }
  },
  {
    id: 'sliding-window-basics',
    title: 'Sliding Window Basics',
    category: 'Sliding Window',
    difficulty: 'Easy',
    estimatedTime: '3 hours',
    problemsCount: 20,
    striverVideoUrl: 'https://www.youtube.com/watch?v=3I_3DLWKlkQ',
    striverSeriesUrl: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0rENwdL0n-E0TV6IXrvsjQr',
    blogUrl: 'https://www.geeksforgeeks.org/window-sliding-technique/',
    leetcodeUrl: 'https://leetcode.com/problems/maximum-average-subarray-i/',
    categoryColor: '60 100% 60%',
    description: 'Master fixed-size sliding window technique for optimal solutions',
    preparationPlan: {
      shortTerm: [
        'Understand window concept and movement',
        'Practice maximum/minimum in window problems',
        'Master subarray sum problems',
        'Solve 12 basic sliding window problems'
      ],
      longTerm: [
        'Combine with hash maps for complex problems',
        'Apply to string pattern matching',
        'Master variable size windows',
        'Optimize time complexity from O(n²) to O(n)'
      ]
    },
    resources: {
      videos: [
        { title: 'Sliding Window Technique', url: 'https://www.youtube.com/watch?v=3I_3DLWKlkQ', duration: '50 min' },
        { title: 'Sliding Window Problems', url: 'https://www.youtube.com/playlist?list=PLot-Xpze53ldVwtstag2TL4HQhAnC8ATf', duration: '4 hours' }
      ],
      articles: [
        { title: 'Sliding Window Technique - GFG', url: 'https://www.geeksforgeeks.org/window-sliding-technique/', readTime: '25 min' },
        { title: 'Sliding Window Pattern', url: 'https://medium.com/outco/how-to-solve-sliding-window-problems-28d67601a66', readTime: '20 min' }
      ],
      practice: [
        { platform: 'LeetCode', url: 'https://leetcode.com/tag/sliding-window/', problems: 80 },
        { platform: 'HackerRank', url: 'https://www.hackerrank.com/domains/algorithms/arrays-and-sorting', problems: 30 }
      ],
      notes: [
        { title: 'Sliding Window Cheat Sheet', url: 'https://github.com/SeanPrashad/leetcode-patterns', type: 'GitHub' }
      ]
    },
    roadmapPosition: { phase: 'Beginner', order: 4 }
  },
  {
    id: 'variable-window',
    title: 'Variable Size Window',
    category: 'Sliding Window',
    difficulty: 'Medium',
    estimatedTime: '4 hours',
    problemsCount: 18,
    striverVideoUrl: 'https://www.youtube.com/watch?v=9kdHxplyl5I',
    striverSeriesUrl: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0rENwdL0n-E0TV6IXrvsjQr',
    blogUrl: 'https://www.geeksforgeeks.org/longest-sub-array-sum-k/',
    leetcodeUrl: 'https://leetcode.com/problems/minimum-window-substring/',
    categoryColor: '60 100% 60%',
    description: 'Dynamic window sizing based on conditions and constraints',
    preparationPlan: {
      shortTerm: [
        'Master window expansion and contraction',
        'Practice longest/shortest subarray problems',
        'Understand condition-based window sizing',
        'Solve 15 variable window problems'
      ],
      longTerm: [
        'Apply to complex string matching',
        'Combine with multiple data structures',
        'Master optimization techniques',
        'Handle edge cases efficiently'
      ]
    },
    resources: {
      videos: [
        { title: 'Variable Size Sliding Window', url: 'https://www.youtube.com/watch?v=9kdHxplyl5I', duration: '1 hour' },
        { title: 'Advanced Sliding Window', url: 'https://www.youtube.com/playlist?list=PLot-Xpze53ldVwtstag2TL4HQhAnC8ATf', duration: '2 hours' }
      ],
      articles: [
        { title: 'Variable Size Window - GFG', url: 'https://www.geeksforgeeks.org/longest-sub-array-sum-k/', readTime: '20 min' },
        { title: 'Dynamic Window Sizing', url: 'https://leetcode.com/discuss/study-guide/657507/Sliding-Window-Technique-and-Question-Bank', readTime: '30 min' }
      ],
      practice: [
        { platform: 'LeetCode', url: 'https://leetcode.com/problems/minimum-window-substring/', problems: 50 },
        { platform: 'InterviewBit', url: 'https://www.interviewbit.com/courses/programming/topics/strings/', problems: 20 }
      ],
      notes: [
        { title: 'Variable Window Patterns', url: 'https://github.com/SeanPrashad/leetcode-patterns', type: 'GitHub' }
      ]
    },
    roadmapPosition: { phase: 'Intermediate', order: 2 }
  },
  {
    id: 'string-manipulation',
    title: 'String Manipulation',
    category: 'Arrays & Strings',
    difficulty: 'Medium',
    estimatedTime: '4 hours',
    problemsCount: 30,
    striverVideoUrl: 'https://www.youtube.com/watch?v=WJaij9ffOIY',
    striverSeriesUrl: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0rENwdL0n-E0TV6IXrvsjQr',
    blogUrl: 'https://www.geeksforgeeks.org/string-data-structure/',
    leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    categoryColor: '220 100% 60%',
    description: 'Master string operations, pattern matching, and text processing',
    preparationPlan: {
      shortTerm: [
        'Practice string traversal and manipulation',
        'Master palindrome detection algorithms',
        'Understand string hashing techniques',
        'Solve 20 string problems daily'
      ],
      longTerm: [
        'Apply advanced pattern matching algorithms',
        'Master KMP and Rabin-Karp algorithms',
        'Combine strings with dynamic programming',
        'Handle Unicode and encoding challenges'
      ]
    },
    resources: {
      videos: [
        { title: 'String Algorithms - Complete Course', url: 'https://www.youtube.com/watch?v=WJaij9ffOIY', duration: '3 hours' },
        { title: 'String Problems Playlist', url: 'https://www.youtube.com/playlist?list=PLot-Xpze53leF0FeHz2X0aG3zd0mr1AW_', duration: '6 hours' }
      ],
      articles: [
        { title: 'String Data Structure - GFG', url: 'https://www.geeksforgeeks.org/string-data-structure/', readTime: '25 min' },
        { title: 'String Algorithms Guide', url: 'https://www.hackerearth.com/practice/algorithms/string-algorithm/basics-of-string-manipulation/tutorial/', readTime: '40 min' }
      ],
      practice: [
        { platform: 'LeetCode', url: 'https://leetcode.com/tag/string/', problems: 400 },
        { platform: 'HackerRank', url: 'https://www.hackerrank.com/domains/algorithms/strings', problems: 60 },
        { platform: 'CodeChef', url: 'https://www.codechef.com/practice/strings', problems: 80 }
      ],
      notes: [
        { title: 'String Algorithms Cheat Sheet', url: 'https://www.techinterviewhandbook.org/algorithms/string/', type: 'PDF' }
      ]
    },
    roadmapPosition: { phase: 'Intermediate', order: 4 }
  },

  // Linked Lists (18 topics)
  {
    id: 'linked-list-basics',
    title: 'Linked List Fundamentals',
    category: 'Linked Lists',
    difficulty: 'Easy',
    estimatedTime: '3 hours',
    problemsCount: 15,
    striverVideoUrl: 'https://www.youtube.com/watch?v=Nq7ok-OyEpg',
    striverSeriesUrl: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0rAuz8tVcM0AymmhTRsfaLU',
    blogUrl: 'https://www.geeksforgeeks.org/data-structures/linked-list/',
    leetcodeUrl: 'https://leetcode.com/problems/design-linked-list/',
    categoryColor: '213 94% 68%',
    description: 'Master linked list concepts, node operations, and traversal techniques',
    preparationPlan: {
      shortTerm: [
        'Understand node structure and pointers',
        'Practice insertion and deletion operations',
        'Master traversal techniques',
        'Implement basic linked list operations'
      ],
      longTerm: [
        'Apply to complex data structure problems',
        'Master memory management concepts',
        'Combine with other data structures',
        'Optimize for performance and space'
      ]
    },
    resources: {
      videos: [
        { title: 'Linked List Basics - Striver', url: 'https://www.youtube.com/watch?v=Nq7ok-OyEpg', duration: '1 hour' },
        { title: 'Complete Linked List Series', url: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0rAuz8tVcM0AymmhTRsfaLU', duration: '8 hours' },
        { title: 'Linked List Implementation', url: 'https://www.youtube.com/watch?v=R9PTBwOzceo', duration: '45 min' }
      ],
      articles: [
        { title: 'Linked List Data Structure - GFG', url: 'https://www.geeksforgeeks.org/data-structures/linked-list/', readTime: '30 min' },
        { title: 'Linked List Interview Questions', url: 'https://www.interviewbit.com/linked-list-interview-questions/', readTime: '45 min' }
      ],
      practice: [
        { platform: 'LeetCode', url: 'https://leetcode.com/tag/linked-list/', problems: 120 },
        { platform: 'HackerRank', url: 'https://www.hackerrank.com/domains/data-structures/linked-lists', problems: 25 },
        { platform: 'CodeChef', url: 'https://www.codechef.com/practice/linked-lists', problems: 40 }
      ],
      notes: [
        { title: 'Linked List Cheat Sheet', url: 'https://www.techinterviewhandbook.org/algorithms/linked-list/', type: 'PDF' }
      ]
    },
    roadmapPosition: { phase: 'Beginner', order: 5 }
  },
  {
    id: 'fast-slow-pointers',
    title: 'Fast & Slow Pointers (Floyd\'s Algorithm)',
    category: 'Linked Lists',
    difficulty: 'Medium',
    estimatedTime: '4 hours',
    problemsCount: 20,
    striverVideoUrl: 'https://www.youtube.com/watch?v=354J83hX7RI',
    striverSeriesUrl: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0rAuz8tVcM0AymmhTRsfaLU',
    blogUrl: 'https://www.geeksforgeeks.org/detect-loop-in-a-linked-list/',
    leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle/',
    categoryColor: '213 94% 68%',
    description: 'Master cycle detection, middle element finding, and tortoise-hare algorithm',
    preparationPlan: {
      shortTerm: [
        'Understand Floyd\'s cycle detection algorithm',
        'Practice finding middle of linked list',
        'Master cycle detection and removal',
        'Solve 12 fast-slow pointer problems'
      ],
      longTerm: [
        'Apply to complex cycle problems',
        'Combine with other pointer techniques',
        'Master palindrome detection in linked lists',
        'Optimize space complexity solutions'
      ]
    },
    resources: {
      videos: [
        { title: 'Floyd\'s Cycle Detection', url: 'https://www.youtube.com/watch?v=354J83hX7RI', duration: '30 min' },
        { title: 'Fast Slow Pointers Playlist', url: 'https://www.youtube.com/playlist?list=PLot-Xpze53leF0FeHz2X0aG3zd0mr1AW_', duration: '2 hours' }
      ],
      articles: [
        { title: 'Floyd\'s Algorithm - GFG', url: 'https://www.geeksforgeeks.org/detect-loop-in-a-linked-list/', readTime: '20 min' },
        { title: 'Fast Slow Pointers Pattern', url: 'https://emre.me/algorithms/fast-slow-pointers/', readTime: '15 min' }
      ],
      practice: [
        { platform: 'LeetCode', url: 'https://leetcode.com/problems/linked-list-cycle/', problems: 30 },
        { platform: 'InterviewBit', url: 'https://www.interviewbit.com/courses/programming/topics/linked-lists/', problems: 15 }
      ],
      notes: [
        { title: 'Floyd\'s Algorithm Notes', url: 'https://github.com/SeanPrashad/leetcode-patterns', type: 'GitHub' }
      ]
    },
    roadmapPosition: { phase: 'Intermediate', order: 1 }
  },
  {
    id: 'linked-list-reversal',
    title: 'Linked List Reversal',
    category: 'Linked Lists',
    difficulty: 'Medium',
    estimatedTime: '3 hours',
    problemsCount: 16,
    striverVideoUrl: 'https://www.youtube.com/watch?v=iRtLEoL-r-g',
    striverSeriesUrl: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0rAuz8tVcM0AymmhTRsfaLU',
    blogUrl: 'https://www.geeksforgeeks.org/reverse-a-linked-list/',
    leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/',
    categoryColor: '213 94% 68%',
    description: 'Master iterative and recursive linked list reversal techniques',
    preparationPlan: {
      shortTerm: [
        'Master iterative reversal algorithm',
        'Understand recursive reversal approach',
        'Practice reversing in groups',
        'Solve 10 reversal problems'
      ],
      longTerm: [
        'Apply reversal in complex problems',
        'Combine with other linked list operations',
        'Master partial reversal techniques',
        'Optimize memory usage'
      ]
    },
    resources: {
      videos: [
        { title: 'Reverse Linked List - Striver', url: 'https://www.youtube.com/watch?v=iRtLEoL-r-g', duration: '25 min' },
        { title: 'Linked List Reversal Playlist', url: 'https://www.youtube.com/playlist?list=PLot-Xpze53lfQmTEztbgdp8ALEoydvnRQ', duration: '1.5 hours' }
      ],
      articles: [
        { title: 'Reverse Linked List - GFG', url: 'https://www.geeksforgeeks.org/reverse-a-linked-list/', readTime: '15 min' },
        { title: 'Reversal Techniques Guide', url: 'https://www.interviewbit.com/tutorial/reverse-linked-list/', readTime: '20 min' }
      ],
      practice: [
        { platform: 'LeetCode', url: 'https://leetcode.com/problems/reverse-linked-list/', problems: 25 },
        { platform: 'HackerRank', url: 'https://www.hackerrank.com/challenges/reverse-a-linked-list', problems: 8 }
      ],
      notes: [
        { title: 'Reversal Patterns', url: 'https://github.com/SeanPrashad/leetcode-patterns', type: 'GitHub' }
      ]
    },
    roadmapPosition: { phase: 'Intermediate', order: 5 }
  },

  // Stacks & Queues (15 topics)
  {
    id: 'stack-basics',
    title: 'Stack Fundamentals',
    category: 'Stacks & Queues',
    difficulty: 'Easy',
    estimatedTime: '3 hours',
    problemsCount: 18,
    striverVideoUrl: 'https://www.youtube.com/watch?v=GYptUgnIM_I',
    striverSeriesUrl: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0rAuz8tVcM0AymmhTRsfaLU',
    blogUrl: 'https://www.geeksforgeeks.org/stack-data-structure/',
    leetcodeUrl: 'https://leetcode.com/problems/implement-stack-using-queues/',
    categoryColor: '280 100% 70%',
    description: 'Master LIFO operations, stack implementation, and basic stack algorithms',
    preparationPlan: {
      shortTerm: [
        'Understand LIFO principle and operations',
        'Implement stack using arrays and linked lists',
        'Practice parentheses matching problems',
        'Master basic stack operations'
      ],
      longTerm: [
        'Apply stacks in expression evaluation',
        'Master monotonic stack problems',
        'Combine with other data structures',
        'Optimize for memory and performance'
      ]
    },
    resources: {
      videos: [
        { title: 'Stack Data Structure - Striver', url: 'https://www.youtube.com/watch?v=GYptUgnIM_I', duration: '45 min' },
        { title: 'Stack Problems Playlist', url: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0rAuz8tVcM0AymmhTRsfaLU', duration: '5 hours' }
      ],
      articles: [
        { title: 'Stack Data Structure - GFG', url: 'https://www.geeksforgeeks.org/stack-data-structure/', readTime: '25 min' },
        { title: 'Stack Interview Questions', url: 'https://www.interviewbit.com/stack-interview-questions/', readTime: '40 min' }
      ],
      practice: [
        { platform: 'LeetCode', url: 'https://leetcode.com/tag/stack/', problems: 200 },
        { platform: 'HackerRank', url: 'https://www.hackerrank.com/domains/data-structures/stacks', problems: 20 },
        { platform: 'CodeChef', url: 'https://www.codechef.com/practice/stacks', problems: 35 }
      ],
      notes: [
        { title: 'Stack Cheat Sheet', url: 'https://www.techinterviewhandbook.org/algorithms/stack/', type: 'PDF' }
      ]
    },
    roadmapPosition: { phase: 'Beginner', order: 6 }
  },
  {
    id: 'monotonic-stack',
    title: 'Monotonic Stack',
    category: 'Stacks & Queues',
    difficulty: 'Medium',
    estimatedTime: '4 hours',
    problemsCount: 22,
    striverVideoUrl: 'https://www.youtube.com/watch?v=T5bNZdN1E1Q',
    striverSeriesUrl: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0rAuz8tVcM0AymmhTRsfaLU',
    blogUrl: 'https://www.geeksforgeeks.org/next-greater-element/',
    leetcodeUrl: 'https://leetcode.com/problems/next-greater-element-i/',
    categoryColor: '280 100% 70%',
    description: 'Master next greater/smaller element problems using monotonic stack',
    preparationPlan: {
      shortTerm: [
        'Understand monotonic stack concept',
        'Practice next greater element problems',
        'Master increasing/decreasing stack patterns',
        'Solve 15 monotonic stack problems'
      ],
      longTerm: [
        'Apply to histogram and rectangle problems',
        'Combine with dynamic programming',
        'Master complex optimization problems',
        'Handle multiple stack variations'
      ]
    },
    resources: {
      videos: [
        { title: 'Monotonic Stack - Complete Guide', url: 'https://www.youtube.com/watch?v=T5bNZdN1E1Q', duration: '1 hour' },
        { title: 'Next Greater Element Series', url: 'https://www.youtube.com/playlist?list=PLot-Xpze53lfxD6l5pAGvCD4nPvWKU8Qo', duration: '3 hours' }
      ],
      articles: [
        { title: 'Monotonic Stack - GFG', url: 'https://www.geeksforgeeks.org/next-greater-element/', readTime: '30 min' },
        { title: 'Monotonic Stack Pattern', url: 'https://medium.com/@vishnuvardhan623/monotonic-stack-e9dcc4fa8c3e', readTime: '20 min' }
      ],
      practice: [
        { platform: 'LeetCode', url: 'https://leetcode.com/tag/monotonic-stack/', problems: 40 },
        { platform: 'InterviewBit', url: 'https://www.interviewbit.com/courses/programming/topics/stacks-and-queues/', problems: 12 }
      ],
      notes: [
        { title: 'Monotonic Stack Patterns', url: 'https://github.com/SeanPrashad/leetcode-patterns', type: 'GitHub' }
      ]
    },
    roadmapPosition: { phase: 'Intermediate', order: 3 }
  },
  {
    id: 'queue-basics',
    title: 'Queue Fundamentals',
    category: 'Stacks & Queues',
    difficulty: 'Easy',
    estimatedTime: '3 hours',
    problemsCount: 16,
    striverVideoUrl: 'https://www.youtube.com/watch?v=M6GnoUDpqEE',
    striverSeriesUrl: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0rAuz8tVcM0AymmhTRsfaLU',
    blogUrl: 'https://www.geeksforgeeks.org/queue-data-structure/',
    leetcodeUrl: 'https://leetcode.com/problems/implement-queue-using-stacks/',
    categoryColor: '280 100% 70%',
    description: 'Master FIFO operations, queue implementation, and circular queues',
    preparationPlan: {
      shortTerm: [
        'Understand FIFO principle and operations',
        'Implement queue using arrays and linked lists',
        'Practice circular queue problems',
        'Master dequeue operations'
      ],
      longTerm: [
        'Apply queues in BFS algorithms',
        'Master priority queue concepts',
        'Combine with other data structures',
        'Implement efficient queue variations'
      ]
    },
    resources: {
      videos: [
        { title: 'Queue Data Structure - Striver', url: 'https://www.youtube.com/watch?v=M6GnoUDpqEE', duration: '40 min' },
        { title: 'Queue Problems Playlist', url: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0rAuz8tVcM0AymmhTRsfaLU', duration: '3 hours' }
      ],
      articles: [
        { title: 'Queue Data Structure - GFG', url: 'https://www.geeksforgeeks.org/queue-data-structure/', readTime: '20 min' },
        { title: 'Queue Interview Questions', url: 'https://www.interviewbit.com/queue-interview-questions/', readTime: '35 min' }
      ],
      practice: [
        { platform: 'LeetCode', url: 'https://leetcode.com/tag/queue/', problems: 100 },
        { platform: 'HackerRank', url: 'https://www.hackerrank.com/domains/data-structures/queues', problems: 15 },
        { platform: 'CodeChef', url: 'https://www.codechef.com/practice/queues', problems: 25 }
      ],
      notes: [
        { title: 'Queue Cheat Sheet', url: 'https://www.techinterviewhandbook.org/algorithms/queue/', type: 'PDF' }
      ]
    },
    roadmapPosition: { phase: 'Beginner', order: 7 }
  },

  // Trees & Graphs (25 topics)
  {
    id: 'binary-tree-basics',
    title: 'Binary Tree Fundamentals',
    category: 'Trees & Graphs',
    difficulty: 'Easy',
    estimatedTime: '4 hours',
    problemsCount: 25,
    striverVideoUrl: 'https://www.youtube.com/watch?v=_ANrF3FJm7I',
    striverSeriesUrl: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0q8Hkd7bK2Bpryj2xVJk8Vk',
    blogUrl: 'https://www.geeksforgeeks.org/binary-tree-data-structure/',
    leetcodeUrl: 'https://leetcode.com/problems/binary-tree-inorder-traversal/',
    categoryColor: '120 100% 40%',
    description: 'Master binary tree structure, traversals, and basic operations',
    preparationPlan: {
      shortTerm: [
        'Understand tree terminology and structure',
        'Master inorder, preorder, postorder traversals',
        'Practice tree construction problems',
        'Solve 15 basic tree problems'
      ],
      longTerm: [
        'Apply trees in complex algorithms',
        'Master tree modification problems',
        'Combine with dynamic programming',
        'Optimize tree operations'
      ]
    },
    resources: {
      videos: [
        { title: 'Binary Tree Basics - Striver', url: 'https://www.youtube.com/watch?v=_ANrF3FJm7I', duration: '1 hour' },
        { title: 'Complete Tree Series', url: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0q8Hkd7bK2Bpryj2xVJk8Vk', duration: '15 hours' }
      ],
      articles: [
        { title: 'Binary Tree - GFG', url: 'https://www.geeksforgeeks.org/binary-tree-data-structure/', readTime: '35 min' },
        { title: 'Tree Interview Questions', url: 'https://www.interviewbit.com/tree-interview-questions/', readTime: '50 min' }
      ],
      practice: [
        { platform: 'LeetCode', url: 'https://leetcode.com/tag/tree/', problems: 300 },
        { platform: 'HackerRank', url: 'https://www.hackerrank.com/domains/data-structures/trees', problems: 40 },
        { platform: 'CodeChef', url: 'https://www.codechef.com/practice/trees', problems: 60 }
      ],
      notes: [
        { title: 'Tree Algorithms Cheat Sheet', url: 'https://www.techinterviewhandbook.org/algorithms/tree/', type: 'PDF' }
      ]
    },
    roadmapPosition: { phase: 'Beginner', order: 8 }
  },
  {
    id: 'graph-basics',
    title: 'Graph Fundamentals',
    category: 'Trees & Graphs',
    difficulty: 'Medium',
    estimatedTime: '5 hours',
    problemsCount: 30,
    striverVideoUrl: 'https://www.youtube.com/watch?v=M3_pLsDdeuU',
    striverSeriesUrl: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0rGEWe64KWas0Nryn7SCRWw',
    blogUrl: 'https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/',
    leetcodeUrl: 'https://leetcode.com/problems/number-of-islands/',
    categoryColor: '120 100% 40%',
    description: 'Master graph representation, traversal algorithms, and basic graph problems',
    preparationPlan: {
      shortTerm: [
        'Understand graph representation methods',
        'Master DFS and BFS algorithms',
        'Practice connected components problems',
        'Solve 20 basic graph problems'
      ],
      longTerm: [
        'Apply advanced graph algorithms',
        'Master shortest path algorithms',
        'Combine with dynamic programming',
        'Handle complex graph optimization'
      ]
    },
    resources: {
      videos: [
        { title: 'Graph Theory - Complete Course', url: 'https://www.youtube.com/watch?v=M3_pLsDdeuU', duration: '2 hours' },
        { title: 'Graph Algorithms Playlist', url: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0rGEWe64KWas0Nryn7SCRWw', duration: '20 hours' }
      ],
      articles: [
        { title: 'Graph Data Structure - GFG', url: 'https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/', readTime: '40 min' },
        { title: 'Graph Algorithms Guide', url: 'https://www.hackerearth.com/practice/algorithms/graphs/graph-representation/tutorial/', readTime: '45 min' }
      ],
      practice: [
        { platform: 'LeetCode', url: 'https://leetcode.com/tag/graph/', problems: 250 },
        { platform: 'HackerRank', url: 'https://www.hackerrank.com/domains/algorithms/graph-theory', problems: 50 },
        { platform: 'Codeforces', url: 'https://codeforces.com/problemset?tags=graphs', problems: 150 }
      ],
      notes: [
        { title: 'Graph Algorithms Cheat Sheet', url: 'https://www.techinterviewhandbook.org/algorithms/graph/', type: 'PDF' }
      ]
    },
    roadmapPosition: { phase: 'Intermediate', order: 6 }
  },

  // Dynamic Programming (20 topics)
  {
    id: 'dp-basics',
    title: 'Dynamic Programming Fundamentals',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    estimatedTime: '6 hours',
    problemsCount: 35,
    striverVideoUrl: 'https://www.youtube.com/watch?v=tyB0ztf0DNY',
    striverSeriesUrl: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0qUlt5H_kiKYaNSqJ81PMMY',
    blogUrl: 'https://www.geeksforgeeks.org/dynamic-programming/',
    leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/',
    categoryColor: '300 100% 50%',
    description: 'Master memoization, tabulation, and fundamental DP patterns',
    preparationPlan: {
      shortTerm: [
        'Understand overlapping subproblems concept',
        'Master memoization and tabulation',
        'Practice Fibonacci and climbing stairs',
        'Solve 25 basic DP problems'
      ],
      longTerm: [
        'Apply DP to optimization problems',
        'Master advanced DP patterns',
        'Combine with other algorithms',
        'Handle multi-dimensional DP'
      ]
    },
    resources: {
      videos: [
        { title: 'DP Complete Course - Striver', url: 'https://www.youtube.com/watch?v=tyB0ztf0DNY', duration: '3 hours' },
        { title: 'DP Playlist - Complete Series', url: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0qUlt5H_kiKYaNSqJ81PMMY', duration: '25 hours' }
      ],
      articles: [
        { title: 'Dynamic Programming - GFG', url: 'https://www.geeksforgeeks.org/dynamic-programming/', readTime: '45 min' },
        { title: 'DP Patterns Guide', url: 'https://leetcode.com/discuss/general-discussion/458695/dynamic-programming-patterns', readTime: '60 min' }
      ],
      practice: [
        { platform: 'LeetCode', url: 'https://leetcode.com/tag/dynamic-programming/', problems: 400 },
        { platform: 'HackerRank', url: 'https://www.hackerrank.com/domains/algorithms/dynamic-programming', problems: 80 },
        { platform: 'AtCoder', url: 'https://atcoder.jp/contests/dp', problems: 26 }
      ],
      notes: [
        { title: 'DP Patterns Cheat Sheet', url: 'https://www.techinterviewhandbook.org/algorithms/dynamic-programming/', type: 'PDF' }
      ]
    },
    roadmapPosition: { phase: 'Advanced', order: 1 }
  },

  // Searching & Sorting (12 topics)
  {
    id: 'binary-search',
    title: 'Binary Search',
    category: 'Searching & Sorting',
    difficulty: 'Medium',
    estimatedTime: '4 hours',
    problemsCount: 28,
    striverVideoUrl: 'https://www.youtube.com/watch?v=MHf6awe89xw',
    striverSeriesUrl: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0rENwdL0n-E0TV6IXrvsjQr',
    blogUrl: 'https://www.geeksforgeeks.org/binary-search/',
    leetcodeUrl: 'https://leetcode.com/problems/binary-search/',
    categoryColor: '45 100% 50%',
    description: 'Master binary search algorithm and its variations for efficient searching',
    preparationPlan: {
      shortTerm: [
        'Understand binary search algorithm',
        'Practice search in sorted arrays',
        'Master lower and upper bound concepts',
        'Solve 20 binary search problems'
      ],
      longTerm: [
        'Apply binary search on answers',
        'Master search in rotated arrays',
        'Combine with other algorithms',
        'Handle complex search scenarios'
      ]
    },
    resources: {
      videos: [
        { title: 'Binary Search - Complete Guide', url: 'https://www.youtube.com/watch?v=MHf6awe89xw', duration: '1 hour' },
        { title: 'Binary Search Playlist', url: 'https://www.youtube.com/playlist?list=PLot-Xpze53leNZQd0iINpD-MAhMOMzWvO', duration: '4 hours' }
      ],
      articles: [
        { title: 'Binary Search - GFG', url: 'https://www.geeksforgeeks.org/binary-search/', readTime: '25 min' },
        { title: 'Binary Search Patterns', url: 'https://leetcode.com/discuss/general-discussion/786126/python-powerful-ultimate-binary-search-template-solved-many-problems', readTime: '30 min' }
      ],
      practice: [
        { platform: 'LeetCode', url: 'https://leetcode.com/tag/binary-search/', problems: 150 },
        { platform: 'HackerRank', url: 'https://www.hackerrank.com/domains/algorithms/search', problems: 25 },
        { platform: 'CodeChef', url: 'https://www.codechef.com/practice/binary-search', problems: 40 }
      ],
      notes: [
        { title: 'Binary Search Template', url: 'https://github.com/SeanPrashad/leetcode-patterns', type: 'GitHub' }
      ]
    },
    roadmapPosition: { phase: 'Intermediate', order: 7 }
  },
  {
    id: 'sorting-algorithms',
    title: 'Sorting Algorithms',
    category: 'Searching & Sorting',
    difficulty: 'Medium',
    estimatedTime: '5 hours',
    problemsCount: 24,
    striverVideoUrl: 'https://www.youtube.com/watch?v=HGk_ypEuS24',
    striverSeriesUrl: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0rENwdL0n-E0TV6IXrvsjQr',
    blogUrl: 'https://www.geeksforgeeks.org/sorting-algorithms/',
    leetcodeUrl: 'https://leetcode.com/problems/sort-an-array/',
    categoryColor: '45 100% 50%',
    description: 'Master various sorting algorithms and their time/space complexities',
    preparationPlan: {
      shortTerm: [
        'Understand bubble, selection, insertion sort',
        'Master merge sort and quick sort',
        'Practice counting and radix sort',
        'Analyze time and space complexities'
      ],
      longTerm: [
        'Apply sorting in complex problems',
        'Master external sorting techniques',
        'Combine sorting with other algorithms',
        'Optimize for specific use cases'
      ]
    },
    resources: {
      videos: [
        { title: 'Sorting Algorithms - Complete Course', url: 'https://www.youtube.com/watch?v=HGk_ypEuS24', duration: '2 hours' },
        { title: 'Sorting Visualizations', url: 'https://www.youtube.com/watch?v=kPRA0W1kECg', duration: '30 min' }
      ],
      articles: [
        { title: 'Sorting Algorithms - GFG', url: 'https://www.geeksforgeeks.org/sorting-algorithms/', readTime: '40 min' },
        { title: 'Sorting Comparison Guide', url: 'https://www.interviewbit.com/tutorial/sorting-algorithms/', readTime: '35 min' }
      ],
      practice: [
        { platform: 'LeetCode', url: 'https://leetcode.com/tag/sorting/', problems: 180 },
        { platform: 'HackerRank', url: 'https://www.hackerrank.com/domains/algorithms/arrays-and-sorting', problems: 30 },
        { platform: 'CodeChef', url: 'https://www.codechef.com/practice/sorting', problems: 50 }
      ],
      notes: [
        { title: 'Sorting Algorithms Cheat Sheet', url: 'https://www.techinterviewhandbook.org/algorithms/sorting-searching/', type: 'PDF' }
      ]
    },
    roadmapPosition: { phase: 'Beginner', order: 2 }
  }
];

// Motivational quotes for DSA learning
export const motivationalQuotes = [
  "The only way to learn a new programming language is by writing programs in it. - Dennis Ritchie",
  "Code is like humor. When you have to explain it, it's bad. - Cory House",
  "First, solve the problem. Then, write the code. - John Johnson",
  "Experience is the name everyone gives to their mistakes. - Oscar Wilde",
  "In order to be irreplaceable, one must always be different. - Coco Chanel",
  "Java is to JavaScript what car is to Carpet. - Chris Heilmann",
  "Knowledge is power. - Francis Bacon",
  "The best error message is the one that never shows up. - Thomas Fuchs",
  "Simplicity is the ultimate sophistication. - Leonardo da Vinci",
  "Make it work, make it right, make it fast. - Kent Beck",
  "Clean code always looks like it was written by someone who cares. - Robert C. Martin",
  "Programming isn't about what you know; it's about what you can figure out. - Chris Pine",
  "The most important property of a program is whether it accomplishes the intention of its user. - C.A.R. Hoare",
  "Debugging is twice as hard as writing the code in the first place. - Brian Kernighan",
  "Code never lies, comments sometimes do. - Ron Jeffries"
];

// Coding platforms for practice
export const codingPlatforms = [
  {
    name: 'LeetCode',
    url: 'https://leetcode.com/',
    description: 'Premier platform for coding interviews',
    problems: '2000+',
    difficulty: 'Easy to Hard',
    features: ['Mock Interviews', 'Company Tags', 'Discussion Forum']
  },
  {
    name: 'HackerRank',
    url: 'https://www.hackerrank.com/',
    description: 'Comprehensive programming challenges',
    problems: '1000+',
    difficulty: 'Easy to Expert',
    features: ['Skill Certification', 'Job Matching', 'Contests']
  },
  {
    name: 'CodeChef',
    url: 'https://www.codechef.com/',
    description: 'Competitive programming platform',
    problems: '3000+',
    difficulty: 'Beginner to Advanced',
    features: ['Monthly Contests', 'Learning Modules', 'IDE']
  },
  {
    name: 'Codeforces',
    url: 'https://codeforces.com/',
    description: 'Russian competitive programming site',
    problems: '5000+',
    difficulty: 'Div 4 to Div 1',
    features: ['Regular Contests', 'Rating System', 'Editorials']
  },
  {
    name: 'AtCoder',
    url: 'https://atcoder.jp/',
    description: 'Japanese competitive programming',
    problems: '2000+',
    difficulty: 'Beginner to Advanced',
    features: ['Educational DP Contest', 'Beginner Contests', 'Library']
  },
  {
    name: 'InterviewBit',
    url: 'https://www.interviewbit.com/',
    description: 'Interview preparation platform',
    problems: '500+',
    difficulty: 'Easy to Hard',
    features: ['Structured Learning', 'Mock Interviews', 'Company Prep']
  }
];

// DSA Categories for filtering
export const dsaCategories = {
  'arrays-strings': {
    name: 'Arrays & Strings',
    icon: '🔢',
    color: '220 100% 60%'
  },
  'sliding-window': {
    name: 'Sliding Window',
    icon: '🪟',
    color: '60 100% 60%'
  },
  'linked-lists': {
    name: 'Linked Lists',
    icon: '🔗',
    color: '213 94% 68%'
  },
  'stacks-queues': {
    name: 'Stacks & Queues',
    icon: '📚',
    color: '280 100% 70%'
  },
  'trees-graphs': {
    name: 'Trees & Graphs',
    icon: '🌳',
    color: '120 100% 40%'
  },
  'dynamic-programming': {
    name: 'Dynamic Programming',
    icon: '💡',
    color: '300 100% 50%'
  },
  'searching-sorting': {
    name: 'Searching & Sorting',
    icon: '🔍',
    color: '45 100% 50%'
  }
};

// Learning resources and blogs
export const learningResources = [
  {
    category: 'YouTube Channels',
    resources: [
      { name: 'Striver', url: 'https://www.youtube.com/@takeUforward', description: 'Complete DSA course' },
      { name: 'CodeHelp - by Babbar', url: 'https://www.youtube.com/@CodeHelp', description: 'DSA in Hindi/English' },
      { name: 'Abdul Bari', url: 'https://www.youtube.com/@abdul_bari', description: 'Algorithm analysis' },
      { name: 'mycodeschool', url: 'https://www.youtube.com/@mycodeschool', description: 'Data structures basics' },
      { name: 'Tushar Roy', url: 'https://www.youtube.com/@tusharroy2525', description: 'Coding interview prep' }
    ]
  },
  {
    category: 'Websites & Blogs',
    resources: [
      { name: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/', description: 'Comprehensive programming portal' },
      { name: 'CP-Algorithms', url: 'https://cp-algorithms.com/', description: 'Advanced algorithms' },
      { name: 'Programiz', url: 'https://www.programiz.com/dsa', description: 'Beginner-friendly tutorials' },
      { name: 'Algorithm Visualizer', url: 'https://algorithm-visualizer.org/', description: 'Interactive algorithm learning' },
      { name: 'VisuAlgo', url: 'https://visualgo.net/', description: 'Algorithm visualizations' }
    ]
  },
  {
    category: 'Books',
    resources: [
      { name: 'Introduction to Algorithms (CLRS)', url: 'https://mitpress.mit.edu/books/introduction-algorithms-third-edition', description: 'Comprehensive algorithms textbook' },
      { name: 'Cracking the Coding Interview', url: 'https://www.crackingthecodinginterview.com/', description: 'Interview preparation guide' },
      { name: 'Elements of Programming Interviews', url: 'https://elementsofprogramminginterviews.com/', description: 'Problem-solving strategies' },
      { name: 'Competitive Programming 4', url: 'https://cpbook.net/', description: 'Competitive programming handbook' }
    ]
  }
];