export const languages = {
  bash: "Bash",
  c: "C",
  "c++": "C++",
  csharp: "C#",
  clojure: "Clojure",
  crystal: "Crystal",
  css: "CSS",
  diff: "Diff",
  dockerfile: "Docker",
  elm: "Elm",
  elixir: "Elixir",
  erlang: "Erlang",
  graphql: "GraphQL",
  go: "Go",
  haskell: "Haskell",
  html: "HTML",
  java: "Java",
  javascript: "JavaScript/JSX",
  json: "JSON",
  kotlin: "Kotlin",
  lisp: "Lisp",
  lua: "Lua",
  markdown: "Markdown",
  matlab: "MATLAB/Octave",
  pascal: "Pascal",
  plaintext: "Plaintext",
  powershell: "Powershell",
  objectivec: "Objective C",
  php: "PHP",
  python: "Python",
  ruby: "Ruby",
  rust: "Rust",
  scala: "Scala",
  scss: "SCSS",
  sql: "SQL",
  swift: "Swift",
  toml: "TOML",
  typescript: "TypeScript/TSX",
  xml: "XML",
  yaml: "YAML",
};

export const themes = {
  hyper: {
    background: "bg-gradient-to-br from-fuchsia-500 via-red-600 to-orange-400",
    theme:
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/atom-one-dark.min.css",
  },
  oceanic: {
    background: "bg-gradient-to-br from-green-300 via-blue-500 to-purple-600",
    theme:
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/base16/material-darker.min.css",
  },
  candy: {
    background: "bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400",
    theme:
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/base16/chalk.min.css",
  },
  sublime: {
    background: "bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500",
    theme:
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github-dark.min.css",
  },
  horizon: {
    background: "bg-gradient-to-br from-orange-500 to-yellow-300",
    theme:
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/monokai-sublime.min.css",
  },
  coral: {
    background: "bg-gradient-to-br from-blue-400 to-emerald-400",
    theme:
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/tokyo-night-dark.min.css",
  },
  peach: {
    background: "bg-gradient-to-br from-rose-400 to-orange-300",
    theme:
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/base16/zenburn.min.css",
  },
  flamingo: {
    background: "bg-gradient-to-br from-pink-400 to-pink-600",
    theme:
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/panda-syntax-dark.min.css",
  },
  gotham: {
    background: "bg-gradient-to-br from-gray-700 via-gray-900 to-black",

    theme:
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/base16/black-metal-dark-funeral.min.css",
  },
  ice: {
    background: "bg-gradient-to-br from-rose-100 to-teal-100",
    theme:
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/base16/ashes.min.css",
  },
};

export const fonts = {
  jetBrainsMono: {
    name: "JetBrains Mono",
    src: "https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap",
  },
  inconsolata: {
    name: "Inconsolata",
    src: "https://fonts.googleapis.com/css2?family=Inconsolata&display=swap",
  },
  firaCode: {
    name: "Fira Code",
    src: "https://fonts.googleapis.com/css2?family=Fira+Code&display=swap",
  },
  cascadiaCode: {
    name: "Cascadia Code",
    src: "https://cdn.jsdelivr.net/npm/@fontsource/cascadia-code@4.2.1/index.min.css",
  },
  victorMono: {
    name: "Victor Mono",
    src: "https://fonts.googleapis.com/css2?family=Victor+Mono&display=swap",
  },
  sourceCodePro: {
    name: "Source Code Pro",
    src: "https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap",
  },
  ibmPlexMono: {
    name: "IBM Plex Mono",
    src: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&display=swap",
  },
  robotoMono: {
    name: "Roboto Mono",
    src: "https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap",
  },
  ubuntuMono: {
    name: "Ubuntu Mono",
    src: "https://fonts.googleapis.com/css2?family=Ubuntu+Mono&display=swap",
  },
  spaceMono: {
    name: "Space Mono",
    src: "https://fonts.googleapis.com/css2?family=Space+Mono&display=swap",
  },
  courierPrime: {
    name: "Courier Prime",
    src: "https://fonts.googleapis.com/css2?family=Courier+Prime&display=swap",
  },
  anonymousPro: {
    name: "Anonymous Pro",
    src: "https://fonts.googleapis.com/css2?family=Anonymous+Pro&display=swap",
  },
  oxygenMono: {
    name: "Oxygen Mono",
    src: "https://fonts.googleapis.com/css2?family=Oxygen+Mono&display=swap",
  },
  redHatMono: {
    name: "Red Hat Mono",
    src: "https://fonts.googleapis.com/css2?family=Red+Hat+Mono&display=swap",
  },
};

export const codeSnippets = [
  {
    language: "python",
    code: "def two_sum(nums, target):\n  num_map = {}\n  for i, num in enumerate(nums):\n    complement = target - num\n    if complement in num_map:\n      return [num_map[complement], i]\n    num_map[num] = i\n  return []\n\nnums = [2, 7, 11, 15]\ntarget = 9\nprint(two_sum(nums, target))  # Output: [0, 1]",
  },
  {
    language: "javascript",
    code: "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nconst twoSum = (nums, target) => {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n};\n\nconsole.log(twoSum([2, 7, 11, 15], 9));  // Output: [0, 1]",
  },
  {
    language: "java",
    code: "import java.util.HashMap;\nimport java.util.Map;\nimport java.util.Arrays;\n\nclass TwoSum {\n  public static int[] twoSum(int[] nums, int target) {\n    Map<Integer, Integer> map = new HashMap<>();\n    for (int i = 0; i < nums.length; i++) {\n      int complement = target - nums[i];\n      if (map.containsKey(complement)) {\n        return new int[] { map.get(complement), i };\n      }\n      map.put(nums[i], i);\n    }\n    return new int[] {};\n  }\n\n  public static void main(String[] args) {\n    int[] nums = { 2, 7, 11, 15 };\n    int target = 9;\n    System.out.println(Arrays.toString(twoSum(nums, target)));\n  }\n}",
  },
  {
    language: "c",
    code: '#include <stdio.h>\n#include <stdlib.h>\n\n/**\n * Note: The returned array must be malloced, assume caller calls free().\n */\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n  int* result = malloc(2 * sizeof(int));\n  *returnSize = 2;\n  \n  for (int i = 0; i < numsSize; i++) {\n    for (int j = i + 1; j < numsSize; j++) {\n      if (nums[i] + nums[j] == target) {\n        result[0] = i;\n        result[1] = j;\n        return result;\n      }\n    }\n  }\n  \n  *returnSize = 0;\n  return NULL;\n}\n\nint main() {\n  int nums[] = {2, 7, 11, 15};\n  int target = 9;\n  int returnSize;\n  int* result = twoSum(nums, 4, target, &returnSize);\n  \n  if (returnSize > 0) {\n    printf("[%d, %d]\\n", result[0], result[1]);\n  } else {\n    printf("No solution found\\n");\n  }\n  \n  free(result);\n  return 0;\n}',
  },
  {
    language: "ruby",
    code: '# @param {Integer[]} nums\n# @param {Integer} target\n# @return {Integer[]}\ndef two_sum(nums, target)\n  map = {}\n  nums.each_with_index do |num, i|\n    complement = target - num\n    if map.key?(complement)\n      return [map[complement], i]\n    end\n    map[num] = i\n  end\n  []\nend\n\nputs two_sum([2, 7, 11, 15], 9).inspect # Output: [0, 1]',
  },
  {
    language: "swift",
    code: "func twoSum(_ nums: [Int], _ target: Int) -> [Int] {\n  var map = [Int: Int]()\n  for (i, num) in nums.enumerated() {\n    let complement = target - num\n    if let complementIndex = map[complement] {\n      return [complementIndex, i]\n    }\n    map[num] = i\n  }\n  return []\n}\n\nprint(twoSum([2, 7, 11, 15], 9)) // Output: [0, 1]",
  },
  {
    language: "csharp",
    code: "using System;\nusing System.Collections.Generic;\n\npublic class Solution {\n  public static int[] TwoSum(int[] nums, int target) {\n    Dictionary<int, int> map = new Dictionary<int, int>();\n    for (int i = 0; i < nums.Length; i++) {\n      int complement = target - nums[i];\n      if (map.ContainsKey(complement)) {\n        return new int[] { map[complement], i };\n      }\n      if (!map.ContainsKey(nums[i])) {\n        map.Add(nums[i], i);\n      }\n    }\n    return new int[] { };\n  }\n\n  public static void Main() {\n    int[] result = TwoSum(new int[] { 2, 7, 11, 15 }, 9);\n    Console.WriteLine($\"[{result[0]}, {result[1]}]\");\n  }\n}",
  },
  {
    language: "php",
    code: "<?php\nfunction twoSum($nums, $target) {\n  $map = [];\n  for ($i = 0; $i < count($nums); $i++) {\n    $complement = $target - $nums[$i];\n    if (isset($map[$complement])) {\n      return [$map[$complement], $i];\n    }\n    $map[$nums[$i]] = $i;\n  }\n  return [];\n}\n\n$nums = [2, 7, 11, 15];\n$target = 9;\nprint_r(twoSum($nums, $target)); // Output: [0, 1]\n?>",
  },
  {
    language: "go",
    code: 'package main\n\nimport (\n  "fmt"\n)\n\nfunc twoSum(nums []int, target int) []int {\n  numMap := make(map[int]int)\n  for i, num := range nums {\n    complement := target - num\n    if idx, found := numMap[complement]; found {\n      return []int{idx, i}\n    }\n    numMap[num] = i\n  }\n  return []int{}\n}\n\nfunc main() {\n  nums := []int{2, 7, 11, 15}\n  target := 9\n  fmt.Println(twoSum(nums, target)) // Output: [0 1]\n}',
  },
  {
    language: "rust",
    code: 'use std::collections::HashMap;\n\nfn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {\n  let mut map = HashMap::new();\n  \n  for (i, &num) in nums.iter().enumerate() {\n    let complement = target - num;\n    if let Some(&j) = map.get(&complement) {\n      return vec![j as i32, i as i32];\n    }\n    map.insert(num, i);\n  }\n  \n  vec![]\n}\n\nfn main() {\n  let nums = vec![2, 7, 11, 15];\n  let target = 9;\n  println!("{:?}", two_sum(nums, target)); // Output: [0, 1]\n}',
  },
];
