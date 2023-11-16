const API_KEY = "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";

// Get references to DOM elements
const userInputField = document.querySelector('.message-form input');
const messageContent = document.querySelector('.message-content');

// Initialize a variable to store the conversation summary
const conversationSummary = [];

async function sendMessage(message) {
  try {
    // Include the conversation summary in the system message
    const messages = [
      { role: "system", content: `Summary: ${conversationSummary.join(' ')}` },
      { role: "user", content: message }
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages
      })
    });

    const data = await response.json();

   conversationSummary.push(data.choices[0].message.content);

    // Display user message
    displayMessage(message, "user");

    // Display bot response, excluding the system message
    displayMessage(data.choices[0].message.content, "bot");

  } catch (error) {
    console.error("Error sending message:", error);
  }
}

function displayMessage(message, role) {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message", role);

  // Replace line breaks in the message content with <br> tags
  const messageContentHTML = message.replace(/\n/g, "<br>");

  messageContainer.innerHTML = `<div class="bubble">${messageContentHTML}</div>`;
  messageContent.appendChild(messageContainer);

  // Scroll to the bottom to show the latest message
  messageContent.scrollTop = messageContent.scrollHeight;
}



// Add an event listener to the input field to send user messages
userInputField.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && userInputField.value.trim() !== "") {
    const userMessage = userInputField.value;
    sendMessage(userMessage);
    conversationSummary.push(userMessage); // Add user message to the conversation summary
    userInputField.value = ""; // Clear the input field
  }
});

// Add an event listener to the paper plane button to send user messages without page refresh
const sendButton = document.querySelector('#sendButton');
sendButton.addEventListener("click", function (event) {
  event.preventDefault();
  const userMessage = userInputField.value;
  if (userMessage.trim() !== "") {
    sendMessage(userMessage);
    conversationSummary.push(userMessage);
    userInputField.value = "";
  }
});
