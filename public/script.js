const chatDiv = document.getElementById("chat");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
let conversationHistory = []; // Initialize conversation history
let currentUsername = "";

const maxHistoryLength = 10; // Define the maximum number of messages to retain in history


sendButton.addEventListener("click", async () => {
    const userMessage = userInput.value;
    if (userMessage.trim() !== "") {
        // Append user message to the conversation history with "role" set to "user"
        conversationHistory.push({ role: "user", message: userMessage }); // Do not include the username here

        // Limit the conversation history to the maximum length
        if (conversationHistory.length > maxHistoryLength) {
            conversationHistory.shift(); // Remove the oldest message
        }

        userInput.value = "";

        // Call the chatbot API with the current conversation history
        const chatbotResponse = await getChatbotResponse(userMessage, conversationHistory);

        // Append chatbot response to the conversation history with "role" set to "assistant"
        conversationHistory.push({ role: "assistant", message: chatbotResponse }); // Do not include the username here

        // Save the conversation to restdb.io, linking the username to each message
        saveConversationToRestDB(conversationHistory);

        // Update the UI to display the conversation
        updateUI();
    }
});

// Function to save the conversation history to restdb.io
// Function to save the conversation history to restdb.io
function saveConversationToRestDB(history) {
    const apiKey = "265a3cb410e1b1ace0303ec60467a38932fe2"; // Replace with your actual restdb.io API key
    const apiUrl = "https://nkanyezi-2737.restdb.io/rest/conversation"; // Adjust the URL as needed

    // Create a modified array without the "username" property
    const historyWithoutUsername = history.map(({ role, message }) => ({
        role: getCookie("username"),
        message,
    }));

    // Send the conversation data to restdb.io using an AJAX POST request
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-apikey': apiKey,
        },
        body: JSON.stringify(historyWithoutUsername), // Send the modified conversation history without usernames
    })
    .then(response => response.json())
    .then(newDocument => {
        console.log('New document created:', newDocument);
    })
    .catch(error => {
        console.error('Error creating document:', error);
    });
}

function appendMessage(sender, message) {
    const messageContainer = document.createElement("div"); // Create a container div

    if (sender === "user") {
        messageContainer.className = "user-message"; // Apply a class for user messages
    } else {
        messageContainer.className = "assistant-message"; // Apply a class for assistant messages
    }

    const messageDiv = document.createElement("div");
    messageDiv.textContent = message;
    messageContainer.appendChild(messageDiv);

    const separator = document.createElement("hr"); // Create a horizontal rule
    messageContainer.appendChild(separator); // Append the separator

    chatDiv.appendChild(messageContainer);
}

async function getChatbotResponse(message, history) {
    const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiODBiYTM3NzUtY2UxYi00NTI3LWIwMjktNWQxOTIyZmEyYTg5IiwidHlwZSI6ImFwaV90b2tlbiJ9.8nm8aXSAu_BLqfaf62tezxT8tNlG0NDHpTeAyXzKIXw"; // Replace with your actual API key
    const apiUrl = "https://api.edenai.run/v2/text/chat";

    const requestData = {
        providers: "openai",
        text: message,
        chatbot_global_action: "Act as an assistant",
        previous_history: history, // Pass the entire conversation history
        temperature: 0.0,
        max_tokens: 990,
    };

    try {
        const response = await axios.post(apiUrl, requestData, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });

        const responseData = response.data;

        console.log(responseData); // For debugging

        // Check if the response has content under "openai.generated_text"
        if (responseData && responseData.openai && responseData.openai.generated_text) {
            return responseData.openai.generated_text;
        } else {
            throw new Error("Invalid response from the chatbot API");
        }
    } catch (error) {
        console.error(error);
        return "An error occurred while getting the response.";
    }
}

function updateUI() {
    chatDiv.innerHTML = ""; // Clear the chat

    conversationHistory.forEach(({ role, message }) => {
        appendMessage(role, message);
    });
}

// Your existing code...

// Add an event listener for the "Paste from Document" button
const pasteButton = document.getElementById("pasteButton");

pasteButton.addEventListener("click", async () => {
    try {
        // Read the clipboard contents
        const clipboardText = await navigator.clipboard.readText();

        // Set the clipboard text as the user's message and trigger a chatbot response
        userInput.value = clipboardText;

        // Simulate a click on the "Send" button to send the message
        sendButton.click();
    } catch (error) {
        console.error("Error reading clipboard:", error);
    }
});
