import { Request, Response } from 'express';
import db from '../database';
import { Item } from '../models/itemModel';

// Create a new resource
export const createItem = (req: Request, res: Response) => {
    const { name, description, price }: Item = req.body;

    if (!name || price === undefined) {
        return res.status(400).json({ error: 'Name and price are required fields.' });
    }

    const sql = `INSERT INTO items (name, description, price) VALUES (?, ?, ?)`;
    db.run(sql, [name, description, price], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, name, description, price });
    });
};

// List resources with basic filters
export const getItems = (req: Request, res: Response) => {
    const { name, minPrice, maxPrice } = req.query;

    let sql = `SELECT * FROM items WHERE 1=1`;
    const params: any[] = [];

    // Basic filters implementation
    if (name) {
        sql += ` AND name LIKE ?`;
        params.push(`%${name}%`);
    }
    if (minPrice) {
        sql += ` AND price >= ?`;
        params.push(minPrice);
    }
    if (maxPrice) {
        sql += ` AND price <= ?`;
        params.push(maxPrice);
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
};

// Get details of a resource
export const getItemById = (req: Request, res: Response) => {
    const { id } = req.params;

    const sql = `SELECT * FROM items WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Item not found.' });
        }
        res.status(200).json(row);
    });
};

// Update resource details
export const updateItem = (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, price }: Partial<Item> = req.body;

    const sql = `UPDATE items SET name = COALESCE(?, name), description = COALESCE(?, description), price = COALESCE(?, price) WHERE id = ?`;

    db.run(sql, [name, description, price, id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Item not found or no changes made.' });
        }
        res.status(200).json({ message: 'Item updated successfully.' });
    });
};

// Delete a resource
export const deleteItem = (req: Request, res: Response) => {
    const { id } = req.params;

    const sql = `DELETE FROM items WHERE id = ?`;
    db.run(sql, [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Item not found.' });
        }
        res.status(200).json({ message: 'Item deleted successfully.' });
    });
};
