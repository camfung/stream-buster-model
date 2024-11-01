
const express = require('express');
const ollama = require('ollama');
const cors = require("cors")

const app = express();
const PORT = process.env.PORT || 3000

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors())

// Define the /ask-query endpoint
app.post('/ask-query', async (req, res) => {
	try {
		const { query } = req.body;

		if (!query) {
			return res.status(400).send({ error: 'Query is required in the request body.' });
		}

		// Send the query to the model
		const response = await ollama.default.chat({
			model: 'llama3.2',
			messages: [{ role: 'user', content: query }],
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
