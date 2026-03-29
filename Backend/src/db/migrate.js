import {readFileSync} from 'fs';
import {join ,dirname} from 'path';
import {fileURLToPath} from 'url';
import {pool} from './index.js';

const __dirname = dirname (fileURLToPath(import.meta.url));

const runMigration = async() => {
    try {
        console.log('Running migration');
        const sql = readFileSync(join(__dirname,'migrations', 'sqlSchema.sql')).toString();
        await pool.query(sql);
        console.log('Migration completed successfully');
    } catch (error) {
        console.log(`Error running migration: ${error.message}`);
        
    }
};

runMigration();