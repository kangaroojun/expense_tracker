// routes/account.route.ts
import { Router } from 'express';
import { IdeaService } from '../services/idea.service';

const router = Router();
const ideaService = new IdeaService();

router.post('/create', async (req, res) => {
    try {
        const result = await ideaService.createIdea(req.body);
        res.status(201).json(result);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

// router.patch('/update', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const result = await ideaService.updateIdea(email, password);
//         res.status(200).json(result);
//     } catch (err: any) {
//         res.status(401).json({ error: err.message });
//     }
// });

export default router;
