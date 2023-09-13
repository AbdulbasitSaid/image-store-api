import express from 'express';
import { upload } from '../middlewares/uploadMiddleware';
import * as imageController from '../controllers/imageController';


const router = express();
router.use(express.json());
/**
 * @swagger
 * components:
 *   schemas:
 *     Image:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The image ID
 *         url:
 *           type: string
 *           description: The image URL
 *         name:
 *           type: string
 *           description: The image name
 *         description:
 *           type: string
 *           description: The image description
 */

/**
 * @swagger
 * /images:
 *   get:
 *     summary: Retrieve a list of images
 *     tags: [Images]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The page number
 *     responses:
 *       200:
 *         description: A list of images
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Image'
 *
 * components:
 *   schemas:
 *     Image:
 *       type: object
 *       required:
 *         - url
 *         - name
 *       properties:
 *         url:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 */

router.get('/', imageController.listImages);

/**
 * @swagger
 * /images:
 *   post:
 *     summary: Create a new image
 *     tags: [Images]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: The image was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Image'
 *       500:
 *         description: Internal error
 */
router.post('/', upload.single('image'), imageController.createImage);

/**
 * @swagger
 * /images/{id}:
 *   get:
 *     summary: Retrieve a single image by its ID
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: String ID of the image to retrieve
 *     responses:
 *       200:
 *         description: A single image
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Image'
 *       404:
 *         description: Image not found
 *       500:
 *         description: Internal error
 */
router.get('/:id', imageController.getImageById);

/**
 * @swagger
 * /images/{id}:
 *   put:
 *     summary: Update an image by its ID
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Numeric ID of the image to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: The image was successfully updated
 *       404:
 *         description: Image not found
 *       500:
 *         description: Internal error
 */
router.put('/:id', upload.single('image'), imageController.updateImageById);

/**
 * @swagger
 * /images/{id}:
 *   delete:
 *     summary: Delete a single image by its ID
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Numeric ID of the image to delete
 *     responses:
 *       200:
 *         description: The image was successfully deleted
 *       404:
 *         description: Image not found
 *       500:
 *         description: Internal error
 */
router.delete('/:id', imageController.deleteImageById);

export default router;
