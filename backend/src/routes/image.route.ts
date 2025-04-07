import { Router } from 'express';
import { ImageService } from '../services/image.service';

const router = Router();
const imageService = new ImageService();

router.get('/:imageID', async (req, res) => {
    const { imageID } = req.params;

    try {
        const image = await imageService.getImageWithPaths(imageID);
        res.status(200).json(image);
    } catch (err: any) {
        res.status(404).json({ error: err.message });
    }
});

router.get('/sketch/:imageID', async (req, res) => {
    const { imageID } = req.params;

    try {
        const image = await imageService.getImageOnly(imageID);
        res.status(200).json(image);
    } catch (err: any) {
        res.status(404).json({ error: err.message });
    }
});

router.post('/create', async (req, res) => {
    try {
        const result = await imageService.createSketch(req.body);
        res.status(201).json(result);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/:imageID', async (req, res) => {
    const { imageID } = req.params;

    try {
        await imageService.deleteSketch(imageID);
        res.status(200).json({ message: 'Image deleted successfully' });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

export default router;