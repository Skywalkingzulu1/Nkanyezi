const chatDiv = document.getElementById("chat");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");

sendButton.addEventListener("click", async () => {
    const userMessage = userInput.value;
    if (userMessage.trim() !== "") {
        appendMessage("user", userMessage);
        userInput.value = "";

        try {
            const chatbotResponse = await getChatbotResponse(userMessage);
            appendMessage("chatbot", chatbotResponse);
        } catch (error) {
            console.error(error);
        }
    }
});

async function getChatbotResponse(message) {
    const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiODBiYTM3NzUtY2UxYi00NTI3LWIwMjktNWQxOTIyZmEyYTg5IiwidHlwZSI6ImFwaV90b2tlbiJ9.8nm8aXSAu_BLqfaf62tezxT8tNlG0NDHpTeAyXzKIXw"; // Replace with your actual API key
    const apiUrl = "https://api.edenai.run/v2/text/chat";

    const requestData = {
        providers: "openai",
        text: message,
        chatbot_global_action: "Act as an assistant",
        previous_history: [],
        temperature: 0.0,
        max_tokens: 150,
    };

    try {
        const response = await axios.post(apiUrl, requestData, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });

        console.log("API Response:", response.data);

        const messages = response.data.openai.message;
        let chatbotResponse = "";

        for (const message of messages) {
            if (message.role === "assistant") {
                chatbotResponse = message.message;
                break;
            }
        }

        if (chatbotResponse) {
            return chatbotResponse;
        } else {
            throw new Error("Assistant message not found in API response");
        }
    } catch (error) {
        console.error(error);
        return "An error occurred while getting the response.";
    }
}

function appendMessage(sender, message) {
    const messageDiv = document.createElement("div");
    messageDiv.className = sender;
    messageDiv.textContent = message;
    chatDiv.appendChild(messageDiv);
}
