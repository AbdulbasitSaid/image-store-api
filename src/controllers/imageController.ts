import { Response, Request } from 'express';
import { deleteFromFirebase, editFromFirebase, uploadToFirebase } from '../middlewares/uploadMiddleware';
import setupDatabase from '../database/setupDatabase';
import { selectFromDatabase, insertIntoDatabase, updateDatabase, deleteFromDatabase } from '../database/queries';
import { ImageResponseData } from '../database/models/image';
const { v4: uuidv4 } = require('uuid');

export const db = setupDatabase();
type ResponseMeta = {

    totalRecords: number,
    per_page: number
    next_page: number | null,
    prev_page: number | null,
    last_page: number,
    links: ResponseLinks
}
type ResponseLinks = {
    self: string,
    next: string | null,
    prev: string | null,
    first: string,
    last: string
}
type PageConstraints = {
    page: number,
    pageSize: number,
    offset: number,
    apiUrl: string
}

export async function listImages(req: Request, res: Response) {
    // Logic for listing images
    let pageConstraints: PageConstraints = { page: Number(req.query.page) || 1, pageSize: 10, offset: 0, apiUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}` };
    pageConstraints.offset = (pageConstraints.page - 1) * pageConstraints.pageSize;

    let responseMeta: ResponseMeta = { totalRecords: 0, per_page: pageConstraints.pageSize, next_page: null, last_page: 1, prev_page: null, links: { self: '', next: '', prev: '', first: '', last: '' }, };
    await selectFromDatabase('SELECT COUNT(*) as total FROM images', []).then((rows) => {
        responseMeta.totalRecords = rows[0].total;
        responseMeta.prev_page = pageConstraints.page > 1 ? pageConstraints.page - 1 : null;
        responseMeta.last_page = Math.ceil(responseMeta.totalRecords / pageConstraints.pageSize);
        responseMeta.next_page = pageConstraints.page < responseMeta.last_page ? pageConstraints.page + 1 : null;
        responseMeta.links.self = `${pageConstraints.apiUrl}?page=${pageConstraints.page}`;
        responseMeta.links.next = responseMeta.next_page != null ? `${pageConstraints.apiUrl}?page=${responseMeta.next_page}` : null;
        responseMeta.links.prev = responseMeta.prev_page != null ? `${pageConstraints.apiUrl}?page=${responseMeta.prev_page}` : null;
        responseMeta.links.first = `${pageConstraints.apiUrl}?page=${1}`;
        responseMeta.links.last = responseMeta.last_page < 1 ? `${pageConstraints.apiUrl}?page=${1}` : `${pageConstraints.apiUrl}?page=${responseMeta.last_page}`;

    });
    selectFromDatabase('SELECT * FROM images LIMIT ? OFFSET ?', [pageConstraints.pageSize, pageConstraints.offset]).then((rows) => {
        res.json({
            data: rows, meta: responseMeta
        });
    });
}

export async function createImage(req: Request, res: Response) {
    // Logic for creating a new image
    const { name, description } = req.body;
    const id = uuidv4();
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const url = await uploadToFirebase(req.file, id);
    if (url)
        await insertIntoDatabase('INSERT INTO images (id, url, name, description) VALUES (?, ?,?,?)', [id, url, name, description]);
    res.json({ message: 'Image uploaded and added', data: { id, url, name, description } });
}


export async function getImageById(req: Request, res: Response) {
    // Logic for getting a single image by ID
    try {
        const responseData = await selectFromDatabase('SELECT * FROM images WHERE id = ?', [req.params.id]);
        res.json({ data: responseData[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function updateImageById(req: Request, res: Response) {
    // Logic for updating an image by ID
    const { name, description, url, id } = req.body;
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    let oldUrl = await getImageById(req, res);
    await editFromFirebase(oldUrl.url, req.file);
}

export async function deleteImageById(req: Request, res: Response) {
    // Logic for deleting an image by ID
    try {
        let row = await selectFromDatabase('SELECT * FROM images WHERE id = ?', [req.params.id]);
        await deleteFromDatabase('DELETE FROM images WHERE id = ?', [req.params.id]);
        await deleteFromFirebase(row[0].url);
        res.json({ message: 'Image deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
