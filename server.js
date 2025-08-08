require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

//Serve static files (like index.html) from the "public" folder
app.use(express.static('public'));

app.use(cors());
app.use(bodyParser.json());

app.post('/api/generate', async (req, res) => {
  const startTime = Date.now();
  const { model, messages } = req.body;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ model, messages })
    });

    const data = await response.json();
    const endTime = Date.now(); // End timer
    const duration = ((endTime - startTime)/1000).toFixed(2);

     res.json({
      ...data,
      duration
      
    });


  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
