import app from './src/app.js';
import {config} from './src/config/env.js';
import {connectDB} from './src/db/index.js';

const start = async () => {
    await connectDB();
    app.listen(config.port, () => {
        console.log(`Server is running on port ${config.port}`);
    
    })

};

start();