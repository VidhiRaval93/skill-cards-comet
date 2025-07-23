// server.ts
import express from 'express';
import cors from 'cors';
import { runSkill } from './comet_control';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/run-skill', async (req, res) => {
  const { prompt, mode } = req.body;
  
  console.log(`🚀 Received run-skill request with prompt: "${prompt}" in ${mode} mode`);
  
  if (!prompt || !mode) {
    console.error('❌ Missing prompt or mode in request');
    return res.status(400).json({ 
      error: 'Missing prompt or mode',
      received: { prompt: !!prompt, mode: !!mode }
    });
  }
  
  if (!['browser', 'assistant'].includes(mode)) {
    console.error(`❌ Invalid mode: ${mode}`);
    return res.status(400).json({ 
      error: 'Invalid mode. Must be "browser" or "assistant"',
      received: mode 
    });
  }
  
  try {
    console.log(`⚙️ Executing skill in ${mode} mode...`);
    const result = await runSkill(prompt, mode);
    console.log('✅ Skill executed successfully');
    res.json({ 
      status: '✅ Skill executed successfully', 
      mode: mode,
      result 
    });
  } catch (err) {
    console.error('❌ Error executing skill:', err.message);
    res.status(500).json({ 
      status: '❌ Failed to run skill', 
      error: err.message,
      mode: mode
    });
  }
});

app.get('/health', (_, res) => {
  console.log('🏥 Health check requested');
  res.send('OK');
});

app.get('/status', (_, res) => {
  res.json({
    status: 'running',
    endpoints: {
      '/run-skill': 'POST - Execute skills in Comet',
      '/health': 'GET - Health check',
      '/status': 'GET - Server status'
    },
    modes: ['browser', 'assistant']
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend listening on http://localhost:${PORT}`);
  console.log(`📡 Run skill endpoint: http://localhost:${PORT}/run-skill`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
}); 