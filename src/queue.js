import 'dotenv/config';

import Queue from './lib/Queue';

Queue.processQueue();

console.log('[Queue] Connect => Press CTRL+C to stop it!');
