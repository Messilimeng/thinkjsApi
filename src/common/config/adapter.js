const fileCache = require('think-cache-file');
const nunjucks = require('think-view-nunjucks');
const fileSession = require('think-session-file');
const mysql = require('think-model-mysql');
const { Console, File, DateFile } = require('think-logger3');
const path = require('path');
const isDev = think.env === 'development';
const socketio = require('think-websocket-socket.io');
const redisCache = require('think-cache-redis');

/**
 * cache adapter config
 * @type {Object}
 */
exports.cache = {
    type: 'file',
    common: {
        timeout: 5 * 24 * 60 * 60 * 1000 // millisecond
    },
    file: {
        handle: fileCache,
        cachePath: path.join(think.ROOT_PATH, 'runtime/cache'), // absoulte path is necessarily required
        pathDepth: 1,
        gcInterval: 24 * 60 * 60 * 1000 // gc interval
    },
    // redis: {
    //     handle: redisCache,
    //     port: 6379,
    //     host: '127.0.0.1',
    //     password: ''
    // }
};
// 也可以使用ioredis库
// exports.cache = {
//     type: 'redis',
//     common: {
//         timeout: 24 * 3600 * 1000// millisecond
//     },
//     redis: {
//         handle: redisCache,
//         port: 6379,
//         host: '127.0.0.1',
//         password: ''
//     }
// };

/**
 * model adapter config
 * @type {Object}
 */
exports.model = {
    type: 'mysql',
    common: {
        logConnect: isDev,
        logSql: isDev,
        logger: msg => think.logger.info(msg)
    },
    mysql: {
        handle: mysql,
        database: '',
        prefix: '',
        encoding: 'utf8',
        host: '127.0.0.1',
        port: '3306',
        user: 'root',
        password: 'root',
        dateStrings: true
    }
};

/**
 * session adapter config
 * @type {Object}
 */
exports.session = {
    type: 'file',
    common: {
        cookie: {
            name: 'thinkjs',
            keys: ['123'],
            signed: true
        }
    },
    file: {
        handle: fileSession,
        sessionPath: path.join(think.ROOT_PATH, 'runtime/session')

    }
};

/**
 * view adapter config
 * @type {Object}
 */
exports.view = {
    type: 'nunjucks',
    common: {
        viewPath: path.join(think.ROOT_PATH, 'view'),
        sep: '/',
        extname: '.html'
    },
    nunjucks: {
        handle: nunjucks
    }
};

/**
 * logger adapter config
 * @type {Object}
 */
exports.logger = {
    type: isDev ? 'console' : 'dateFile',
    console: {
        handle: Console
    },
    file: {
        handle: File,
        backups: 10, // max chunk number
        absolute: true,
        maxLogSize: 50 * 1024, // 50M
        filename: path.join(think.ROOT_PATH, 'logs/app.log')
    },
    dateFile: {
        handle: DateFile,
        level: 'ALL',
        absolute: true,
        pattern: '-yyyy-MM-dd',
        alwaysIncludePattern: true,
        filename: path.join(think.ROOT_PATH, 'logs/app.log')
    }
};

/**
 * websocket
 */
exports.websocket = {
    type: 'socketio',
    common: {
        // common config
    },
    socketio: {
        handle: socketio,
        // allowOrigin: '127.0.0.1:8360',  // 默认所有的域名都允许访问
        path: '/socket.io', // 默认 '/socket.io'
        adapter: null, // 默认无 adapter
        messages: [{
            open: '/socket/index/open',
            online: '/socket/index/online',
            addUser: '/socket/index/addUser',
            sendMsg: '/socket/index/sendMsg',
            close: '/socket/index/close'
        }]
    }
};
