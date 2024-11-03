const express = require('express');
const ollama = require('ollama');
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = "thisisthekey" // Make sure to set this environment variable

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());

// Custom middleware to check API key
function apiKeyAuth(req, res, next) {
	const apiKey = req.header('x-api-key');
	if (apiKey && apiKey === API_KEY) {
		return next(); // API key is valid, proceed to the endpoint
	} else {
		return res.status(403).send({ error: 'Forbidden: Invalid API key' });
	}
}

// Apply the middleware to the /ask-query endpoint
app.post('/ask-query', apiKeyAuth, async (req, res) => {
	try {
		// Destructure messages from the request body
		const { messages } = req.body;

		// Check if messages is not an array or is empty
		if (!Array.isArray(messages) || messages.length === 0) {
			return res.status(400).send({ error: 'Messages array is required in the request body.' });
		}

		// Send the messages to the model
		const response = await ollama.default.chat({
			model: 'llama3.2',
			messages: messages,
		});

		// Send the response from the model back to the client
		res.send({ reply: response.message.content });
	} catch (error) {
		console.error('Error in /ask-query route:', error);
		res.status(500).send({ error: 'Something went wrong while processing your request.' });
	}
});
// Default error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send({ error: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
