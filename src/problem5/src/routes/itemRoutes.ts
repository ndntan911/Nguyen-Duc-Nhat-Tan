import { Router } from 'express';
import {
    createItem,
    getItems,
    getItemById,
    updateItem,
    deleteItem
} from '../controllers/itemController';

const router = Router();

// Route to create a new resource
router.post('/items', createItem);

// Route to list resources with basic filters
router.get('/items', getItems);

// Route to get details of a resource
router.get('/items/:id', getItemById);

// Route to update resource details
router.put('/items/:id', updateItem);

// Route to delete a resource
router.delete('/items/:id', deleteItem);

export default router;
