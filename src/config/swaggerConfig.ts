import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Image API',
            version: '1.0.0',
            description: 'API for Image Operations',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT}`,
            },
        ],
    },
    apis: ['./src/routes/*.ts'], // path to the API docs
};

const specs = swaggerJsdoc(options);
export default specs;
