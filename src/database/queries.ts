import setupDatabase from '../database/setupDatabase';
import { ImageResponseData } from './models/image';
export const db = setupDatabase();

export async function selectFromDatabase(query: string, params: any[] = []) {
    return new Promise(async (resolve, reject) => {
        (await db).all(query, params, (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}
export async function insertIntoDatabase(query: string, params: any[] = []) {
    return new Promise(async (resolve, reject) => {
        (await db).run(query, params, function (err) {
            if (err) {
                return reject(err);
            }
            resolve(this.lastID);
        });
    });
}

export async function updateDatabase(query: string, params: any[] = []) {
    return new Promise(async (resolve, reject) => {
        (await db).run(query, params, function (err) {
            if (err) {
                return reject(err);
            }
            resolve(this.changes);
        });
    });
}

export async function deleteFromDatabase(query: string, params: any[] = []) {
    return new Promise(async (resolve, reject) => {
        (await db).run(query, params, function (err) {
            if (err) {
                return reject(err);
            }
            resolve(this.changes);
        });
    });
}