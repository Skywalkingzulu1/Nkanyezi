const chatDiv = document.getElementById("chat");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
let conversationHistory = []; // Initialize conversation history

sendButton.addEventListener("click", async () => {
    const userMessage = userInput.value;
    if (userMessage.trim() !== "") {
        // Append user message to the conversation history with "role" set to "user"
        conversationHistory.push({ role: "user", message: userMessage });
        userInput.value = "";

        // Call the chatbot API with the current conversation history
        const chatbotResponse = await getChatbotResponse(userMessage, conversationHistory);

        // Append chatbot response to the conversation history with "role" set to "assistant"
        conversationHistory.push({ role: "assistant", message: chatbotResponse });

        // Update the UI to display the conversation
        updateUI();
    }
});

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
        temperature: 1.0,
        max_tokens: 150,
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
