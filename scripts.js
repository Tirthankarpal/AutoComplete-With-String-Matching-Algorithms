let statesData = [];
let kmpTimes = [];
let zTimes = [];
let hashingTimes = [];
let trieTimes = [];
let kmpCount = 0;
let zCount = 0;
let hashingCount = 0;
let trieCount = 0;
let averageTimesChart;

async function fetchData() {
  try {
    const response = await fetch("data.json");
    const jsonData = await response.json();
    statesData = jsonData.states;
    console.log("Data loaded successfully:", statesData);
    let cityCount = 0;
    for (const state of statesData) {
      cityCount += state.cities.length;
    }
    const cityCountElement = document.getElementById("city-count");
    cityCountElement.textContent = `Total Cities/Data: ${cityCount}`;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchData();

// KMP Algorithm
function kmpSearch(text, pattern) {
  const lps = computeLPSArray(pattern);
  let i = 0;
  let j = 0;
  while (i < text.length) {
    if (pattern[j] === text[i]) {
      i++;
      j++;
    }
    if (j === pattern.length) {
      return true;
    } else if (i < text.length && pattern[j] !== text[i]) {
      if (j !== 0) {
        j = lps[j - 1];
      } else {
        i++;
      }
    }
  }
  return false;
}

function computeLPSArray(pattern) {
  const lps = Array(pattern.length).fill(0);
  let len = 0;
  let i = 1;
  while (i < pattern.length) {
    if (pattern[i] === pattern[len]) {
      len++;
      lps[i] = len;
      i++;
    } else {
      if (len !== 0) {
        len = lps[len - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
  }
  return lps;
}

// Z Algorithm
function zSearch(text, pattern) {
  const concat = pattern + "$" + text;
  const Z = getZArray(concat);
  for (let i = 0; i < Z.length; i++) {
    if (Z[i] === pattern.length) {
      return true;
    }
  }
  return false;
}

function getZArray(s) {
  const Z = Array(s.length).fill(0);
  let L = 0,
    R = 0,
    K;
  for (let i = 1; i < s.length; i++) {
    if (i > R) {
      L = R = i;
      while (R < s.length && s[R] === s[R - L]) {
        R++;
      }
      Z[i] = R - L;
      R--;
    } else {
      K = i - L;
      if (Z[K] < R - i + 1) {
        Z[i] = Z[K];
      } else {
        L = i;
        while (R < s.length && s[R] === s[R - L]) {
          R++;
        }
        Z[i] = R - L;
        R--;
      }
    }
  }
  return Z;
}

// String Hashing
function stringHashingSearch(text, pattern) {
  const p = 31;
  const m = 1e9 + 9;
  const S = text.length;
  const P = pattern.length;
  let patternHash = 0;
  let currentHash = 0;
  let pPow = 1;
  for (let i = 0; i < P; i++) {
    patternHash =
      (patternHash + (pattern.charCodeAt(i) - "a".charCodeAt(0) + 1) * pPow) %
      m;
    currentHash =
      (currentHash + (text.charCodeAt(i) - "a".charCodeAt(0) + 1) * pPow) % m;
    if (i < P - 1) pPow = (pPow * p) % m;
  }
  for (let i = 0; i + P - 1 < S; i++) {
    if (patternHash === currentHash) {
      if (text.substr(i, P) === pattern) {
        return true;
      }
    }
    if (i + P < S) {
      currentHash =
        (currentHash - (text.charCodeAt(i) - "a".charCodeAt(0) + 1) + m) % m;
      currentHash = (currentHash / p) % m;
      currentHash =
        (currentHash +
          (text.charCodeAt(i + P) - "a".charCodeAt(0) + 1) * pPow) %
        m;
    }
  }
  return false;
}

// Trie Data Structure
class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let node = this.root;
    for (const char of word) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
  }

  startsWith(prefix) {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children[char]) {
        return [];
      }
      node = node.children[char];
    }
    return this.collectAllWords(node, prefix);
  }

  collectAllWords(node, prefix) {
    let words = [];
    if (node.isEndOfWord) {
      words.push(prefix);
    }
    for (const char in node.children) {
      words = words.concat(
        this.collectAllWords(node.children[char], prefix + char)
      );
    }
    return words;
  }
}

const trie = new Trie();

// Function to initialize trie with cities data
function initializeTrie() {
  for (const state of statesData) {
    for (const city of state.cities) {
      trie.insert(city.toLowerCase());
    }
  }
}

// Autocomplete Function
function autocomplete() {
  const input = document
    .getElementById("autocomplete-input")
    .value.toLowerCase();
  const algorithm = document.getElementById("algorithm").value;
  const suggestions = [];
  const timeTakenElement = document.getElementById("time-taken");

  if (input === "") {
    displaySuggestions(suggestions);
    timeTakenElement.textContent = "";
    return;
  }

  let startTime = performance.now();
  let algorithmTimes;

  if (algorithm === "kmp") {
    algorithmTimes = kmpTimes;
    kmpCount++;
    for (const state of statesData) {
      for (const city of state.cities) {
        if (kmpSearch(city.toLowerCase(), input)) {
          suggestions.push(city);
        }
      }
    }
  } else if (algorithm === "z") {
    algorithmTimes = zTimes;
    zCount++;
    for (const state of statesData) {
      for (const city of state.cities) {
        if (zSearch(city.toLowerCase(), input)) {
          suggestions.push(city);
        }
      }
    }
  } else if (algorithm === "hashing") {
    algorithmTimes = hashingTimes;
    hashingCount++;
    for (const state of statesData) {
      for (const city of state.cities) {
        if (stringHashingSearch(city.toLowerCase(), input)) {
          suggestions.push(city);
        }
      }
    }
  } else if (algorithm === "trie") {
    algorithmTimes = trieTimes;
    trieCount++;
    suggestions.push(...trie.startsWith(input));
  }

  let endTime = performance.now();
  let timeTaken = endTime - startTime;
  algorithmTimes.push(timeTaken);

  const averageTime = calculateAverage(algorithmTimes, algorithm);

  console.log(
    `Algorithm: ${algorithm}, Time taken: ${timeTaken.toFixed(
      2
    )} ms, Average Time: ${averageTime} ms`
  );

  timeTakenElement.textContent = `Time taken: ${timeTaken.toFixed(
    2
  )} ms, Average Time: ${averageTime} ms`;

  displaySuggestions(suggestions);
}

// Function to calculate average time
function calculateAverage(times, algorithm) {
  if (times.length === 0) return "Not used yet";
  const sum = times.reduce((acc, curr) => acc + curr, 0);
  const average = sum / times.length;
  return average.toFixed(2) + " ms";
}

window.autocomplete = autocomplete;

function displaySuggestions(suggestions) {
  const suggestionsList = document.getElementById("suggestions");
  suggestionsList.innerHTML = "";
  for (const suggestion of suggestions) {
    const listItem = document.createElement("li");
    listItem.textContent = suggestion;
    suggestionsList.appendChild(listItem);
  }
}

// Display average times continuously
setInterval(() => {
  document.getElementById("kmp-average").textContent = calculateAverage(
    kmpTimes,
    "KMP"
  );
  document.getElementById("z-average").textContent = calculateAverage(
    zTimes,
    "Z"
  );
  document.getElementById("hashing-average").textContent = calculateAverage(
    hashingTimes,
    "Hashing"
  );
  document.getElementById("trie-average").textContent = calculateAverage(
    trieTimes,
    "Trie"
  );

  // Update the average times in the chart
  updateAverageTimesChart();
}, 1000); // Update every second

function updateAverageTimesChart() {
  averageTimesChart.data.datasets[0].data = [
    parseFloat(calculateAverage(kmpTimes, "KMP")),
    parseFloat(calculateAverage(zTimes, "Z")),
    parseFloat(calculateAverage(hashingTimes, "Hashing")),
    parseFloat(calculateAverage(trieTimes, "Trie")),
  ];
  averageTimesChart.update();
}

setTimeout(() => {
  initializeTrie();
}, 1000);

function initializeChart() {
  const ctx = document.getElementById("average-times-chart").getContext("2d");
  averageTimesChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["KMP", "Z", "Hashing", "Trie"],
      datasets: [
        {
          label: "Average Search Time (ms)",
          data: [NaN, NaN, NaN, NaN], // Initialize with default values
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)", // KMP color
            "rgba(54, 162, 235, 0.2)", // Z color
            "rgba(255, 206, 86, 0.2)", // Hashing color
            "rgba(75, 192, 192, 0.2)", // Trie color
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
          ],
          borderWidth: 1,
          datalabels: {
            anchor: "end",
            align: "end",
            formatter: function (value, context) {
              return value + " ms";
            },
            color: "#333",
            font: {
              weight: "bold",
            },
          },
        },
      ],
    },
    options: {
      plugins: {
        datalabels: {
          display: true,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          borderRadius: 4,
          padding: {
            top: 2,
            bottom: 2,
            left: 6,
            right: 6,
          },
        },
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              callback: function (value) {
                return value + " ms";
              },
            },
          },
        ],
      },
    },
  });
}

initializeChart();
