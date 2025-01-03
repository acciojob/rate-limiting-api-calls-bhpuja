//your JS code here. If required.
const fetchButton = document.getElementById("fetch-button");
const clickCountDisplay = document.getElementById("click-count");
const resultsDiv = document.getElementById("results");

let clickCount = 0;
let apiCallsMade = 0;
const apiUrl = "https://jsonplaceholder.typicode.com/todos/1";

// Function to make the API call
function fetchData() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      resultsDiv.innerHTML = `
        <p><strong>ID:</strong> ${data.id}</p>
        <p><strong>Title:</strong> ${data.title}</p>
        <p><strong>Completed:</strong> ${data.completed}</p>
      `;
    })
    .catch((error) => {
      resultsDiv.innerHTML = `<p>Error fetching data: ${error}</p>`;
    });
}

// Rate limiter logic
let queue = [];
let lastApiCallTime = 0;

function rateLimiter(callback) {
  const currentTime = Date.now();

  // Check if we are within the 1-second window for 5 API calls
  if (currentTime - lastApiCallTime > 1000) {
    apiCallsMade = 0; // Reset API calls count every second
    lastApiCallTime = currentTime;
  }

  if (apiCallsMade < 5) {
    // Allow the API call and increment count
    apiCallsMade++;
    callback();
  } else {
    // Queue the call if more than 5 API calls are made in 1 second
    queue.push(callback);
    // Wait 1 second before retrying the calls
    setTimeout(() => {
      if (queue.length > 0) {
        queue.shift()(); // Execute the next API call in the queue
      }
    }, 1000);
  }
}

// Handle button click and rate limit
fetchButton.addEventListener("click", () => {
  clickCount++;
  clickCountDisplay.textContent = clickCount;

  // Use rateLimiter to control API call frequency
  rateLimiter(() => {
    fetchData();
  });

  // Reset click count after 10 seconds
  setTimeout(() => {
    clickCount = 0;
    clickCountDisplay.textContent = clickCount;
  }, 10000);
});
