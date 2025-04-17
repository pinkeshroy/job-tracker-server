import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/jobs', ()=>{console.log("hello dev")});

app.get('/', (req, res) => {
  res.send('Job Tracker API is live 🚀');
});

export default app;
