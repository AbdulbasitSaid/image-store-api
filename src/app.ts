import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import imageRoutes from "./routes/imageRoutes";

import swaggerDocs from './config/swaggerConfig';

dotenv.config();

const app = express();

app.use('/images', imageRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
