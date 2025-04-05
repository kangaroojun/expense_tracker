// routes/account.route.ts
import { Router } from 'express';
import { AccountService } from '../services/account.service';

const router = Router();
const accountService = new AccountService();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await accountService.register(email, password);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await accountService.login(email, password);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
});

export default router;
