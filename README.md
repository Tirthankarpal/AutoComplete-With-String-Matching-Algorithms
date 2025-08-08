# Autocomplete with Algorithms

An interactive web application that demonstrates and compares multiple string search algorithms for city name autocompletion. Users can type a city name, select an algorithm, and instantly see autocomplete suggestions along with search time metrics. The app visualizes and compares the average performance of each algorithm with a live-updating chart.

**Live Demo:** [https://autocompletewithalgo.netlify.app/](https://autocompletewithalgo.netlify.app/)

---

## Features

- **Autocomplete Search:**  
  Type the name of a city and get instant suggestions from a large dataset of Indian cities.

- **Algorithm Selection:**  
  Choose between KMP, Z Algorithm, String Hashing, and Trie to see how each performs.

- **Performance Visualization:**  
  View real-time search times and average times for each algorithm in a dynamic bar chart.

- **Modern UI:**  
  Responsive and visually appealing interface built with custom CSS.

---

## Technologies Used

- **HTML, CSS, JavaScript**  
- **Chart.js** (for chart visualization)
- **JSON** (for city/state data)

---

## Algorithms Implemented

- **KMP (Knuth-Morris-Pratt) Algorithm**
- **Z Algorithm**
- **String Hashing (Rabin-Karp style)**
- **Trie Data Structure**

---

## How It Works

1. **Data Loading:**  
   Loads a large dataset of Indian cities from a JSON file.

2. **Autocomplete:**  
   As you type, the selected algorithm searches for matching city names and displays suggestions.

3. **Performance Tracking:**  
   Measures and displays the time taken for each search, updating average times and the chart.

---

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/autocomplete-with-algorithms.git
   ```
2. **Open `index.html` in your browser.**

---

## Project Structure

```
├──
