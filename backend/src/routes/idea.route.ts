// routes/account.route.ts
import { Router } from 'express';
import { IdeaService } from '../services/idea.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();
const ideaService = new IdeaService();

router.get('/', async (req, res) => {
    try {
        const ideas = await ideaService.getAllIdeasWithImages();
        res.status(200).json(ideas);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:ideaID', async (req, res) => {
    const { ideaID } = req.params;

    try {
        const idea = await ideaService.getIdeaWithSketch(ideaID);
        res.status(200).json(idea);
    } catch (err: any) {
        res.status(404).json({ error: err.message });
    }
});

router.post('/create', async (req: AuthenticatedRequest, res) => {
  try {
    const userID = req.user?.userID;
    if (!userID) throw new Error('Unauthorized');

    const result = await ideaService.createIdea({
      ...req.body,
      userID, // Inject userID from token
    });

    res.status(201).json(result);
  } catch (err: any) {
    console.log('Received data:', req.body);
    res.status(400).json({ error: err.message });
  }
});


router.patch('/:ideaID', async (req, res) => {
    const { ideaID } = req.params;

    try {
        await ideaService.updateIdea(ideaID, req.body);
        res.status(200).json({ message: 'Idea updated successfully' });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/:ideaID', async (req, res) => {
    const { ideaID } = req.params;

    try {
        await ideaService.deleteIdea(ideaID);
        res.status(200).json({ message: 'Idea deleted successfully' });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
