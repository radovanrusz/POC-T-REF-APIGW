/* eslint-disable max-lines */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/*
 * https://github.com/winstonjs/winston/tree/master/examples
 *
 */

const winston = require('winston');
const {createLogger, format, transports} = require('winston');
const {combine, timestamp, label, prettyPrint, printf} = format;
const logPath = './logs/api-gateway.log'
const appFormat1 = printf(({level, message, label, timestamp}) => `${timestamp} [${label}] ${level}: ${message}`);

winston.loggers.add('app', {
    transports: [
        new transports.Console({
            format: combine(
                label({label: 'app'}),
                timestamp(),
                winston.format.colorize(),
                appFormat1
            )
        }),
        new winston.transports.File({
            filename: logPath,
            prettyPrint: true,
            maxsize: 10242880,
            maxFiles: 1,
            format: combine(
                label({label: 'app'}),
                timestamp(),
                appFormat1
            )
        })
    ]
});

winston.loggers.add('jwt_validator', {
    transports: [
        new transports.Console({
            format: combine(
                label({label: 'jwt_validator'}),
                timestamp(),
                winston.format.colorize(),
                appFormat1
            )
        }),
        new winston.transports.File({
            filename: logPath,
            prettyPrint: true,
            maxsize: 10242880, 
            maxFiles: 1,
            format: combine(
                label({label: 'jwt_validator'}),
                timestamp(),
                appFormat1
            )
        })
    ]
});

winston.loggers.add('mail', {
    transports: [
        new transports.Console({
            format: combine(
                label({label: 'mail'}),
                timestamp(),
                winston.format.colorize(),
                appFormat1
            )
        }),
        new winston.transports.File({
            filename: logPath,
            prettyPrint: true,
            maxsize: 10242880, 
            maxFiles: 1,
            format: combine(
                label({label: 'mail'}),
                timestamp(),
                appFormat1
            )
        })
    ]
});

winston.loggers.add('admin-services', {
    transports: [
        new transports.Console({
            format: combine(
                label({label: 'admin-services'}),
                timestamp(),
                winston.format.colorize(),
                appFormat1
            )
        }),
        new winston.transports.File({
            filename: logPath,
            prettyPrint: true,
            maxsize: 10242880, 
            maxFiles: 1,
            format: combine(
                label({label: 'admin-services'}),
                timestamp(),
                appFormat1
            )
        })
    ]
});

winston.loggers.add('sec-admin-services', {
    transports: [
        new transports.Console({
            format: combine(
                label({label: 'sec-admin-services'}),
                timestamp(),
                winston.format.colorize(),
                appFormat1
            )
        }),
        new winston.transports.File({
            filename: logPath,
            prettyPrint: true,
            maxsize: 10242880, 
            maxFiles: 1,
            format: combine(
                label({label: 'sec-admin-services'}),
                timestamp(),
                appFormat1
            )
        })
    ]
});

winston.loggers.add('notary-services', {
    transports: [
        new transports.Console({
            format: combine(
                label({label: 'notary-services'}),
                timestamp(),
                winston.format.colorize(),
                appFormat1
            )
        }),
        new winston.transports.File({
            filename: logPath,
            prettyPrint: true,
            maxsize: 10242880, 
            maxFiles: 1,
            format: combine(
                label({label: 'notary-services'}),
                timestamp(),
                appFormat1
            )
        })
    ]
});

winston.loggers.add('shared-services', {
    transports: [
        new transports.Console({
            format: combine(
                label({label: 'shared-services'}),
                timestamp(),
                winston.format.colorize(),
                appFormat1
            )
        }),
        new winston.transports.File({
            filename: logPath,
            prettyPrint: true,
            maxsize: 10242880, 
            maxFiles: 1,
            format: combine(
                label({label: 'shared-services'}),
                timestamp(),
                appFormat1
            )
        })
    ]
});

winston.loggers.add('ca', {
    transports: [
        new transports.Console({
            format: combine(
                label({label: 'ca'}),
                timestamp(),
                winston.format.colorize(),
                appFormat1
            )
        }),
        new winston.transports.File({
            filename: logPath,
            prettyPrint: true,
            maxsize: 10242880, 
            maxFiles: 1,
            format: combine(
                label({label: 'ca'}),
                timestamp(),
                appFormat1
            )
        })
    ]
});

winston.loggers.add('config', {
    transports: [
        new transports.Console({
            format: combine(
                label({label: 'config'}),
                timestamp(),
                winston.format.colorize(),
                appFormat1
            )
        }),
        new winston.transports.File({
            filename: logPath,
            prettyPrint: true,
            maxsize: 10242880, 
            maxFiles: 1,
            format: combine(
                label({label: 'config'}),
                timestamp(),
                appFormat1
            )
        })
    ]
});

winston.loggers.add('hfc-api-admin-channel', {
    transports: [
        new transports.Console({
            format: combine(
                label({label: 'hfc-api-admin-channel'}),
                timestamp(),
                winston.format.colorize(),
                appFormat1
            )
        }),
        new winston.transports.File({
            filename: logPath,
            prettyPrint: true,
            maxsize: 10242880, 
            maxFiles: 1,
            format: combine(
                label({label: 'hfc-api-admin-channel'}),
                timestamp(),
                appFormat1
            )
        })
    ]
});

winston.loggers.add('hfc-api-notarius-channel', {
    transports: [
        new transports.Console({
            format: combine(
                label({label: 'hfc-api-notarius-channel'}),
                timestamp(),
                winston.format.colorize(),
                appFormat1
            )
        }),
        new winston.transports.File({
            filename: logPath,
            prettyPrint: true,
            maxsize: 10242880, 
            maxFiles: 1,
            format: combine(
                label({label: 'hfc-api-notarius-channel'}),
                timestamp(),
                appFormat1
            )
        })
    ]
});

winston.loggers.add('hfc-api-monitoring', {
    transports: [
        new transports.Console({
            format: combine(
                label({label: 'hfc-api-monitoring'}),
                timestamp(),
                winston.format.colorize(),
                appFormat1
            )
        }),
        new winston.transports.File({
            filename: logPath,
            prettyPrint: true,
            maxsize: 10242880, 
            maxFiles: 1,
            format: combine(
                label({label: 'hfc-api-monitoring'}),
                timestamp(),
                appFormat1
            )
        })
    ]
});

winston.loggers.add('routers', {
    transports: [
        new transports.Console({
            format: combine(
                label({label: 'routers'}),
                timestamp(),
                winston.format.colorize(),
                appFormat1
            )
        }),
        new winston.transports.File({
            filename: logPath,
            prettyPrint: true,
            maxsize: 10242880, 
            maxFiles: 1,
            format: combine(
                label({label: 'routers'}),
                timestamp(),
                appFormat1
            )
        })
    ]
});

winston.loggers.add('db', {
    transports: [
        new transports.Console({
            format: combine(
                label({label: 'db'}),
                timestamp(),
                winston.format.colorize(),
                appFormat1
            )
        }),
        new winston.transports.File({
            filename: logPath,
            prettyPrint: true,
            maxsize: 10242880, 
            maxFiles: 1,
            format: combine(
                label({label: 'db'}),
                timestamp(),
                appFormat1
            )
        })
    ]
});

winston.loggers.add('security', {
    transports: [
        new transports.Console({
            format: combine(
                label({label: 'security'}),
                timestamp(),
                winston.format.colorize(),
                appFormat1
            )
        }),
        new winston.transports.File({
            filename: logPath,
            prettyPrint: true,
            maxsize: 10242880, 
            maxFiles: 1,
            format: combine(
                label({label: 'security'}),
                timestamp(),
                appFormat1
            )
        })
    ]
});

winston.loggers.add('availability-monitoring', {
    transports: [
        new transports.Console({
            format: combine(
                label({label: 'availability-monitoring'}),
                timestamp(),
                winston.format.colorize(),
                appFormat1
            )
        }),
        new winston.transports.File({
            filename: logPath,
            prettyPrint: true,
            maxsize: 10242880, 
            maxFiles: 1,
            format: combine(
                label({label: 'availability-monitoring'}),
                timestamp(),
                appFormat1
            )
        })
    ]
});

winston.loggers.add('billing-services', {
    transports: [
        new transports.Console({
            format: combine(
                label({label: 'billing-services'}),
                timestamp(),
                winston.format.colorize(),
                appFormat1
            )
        }),
        new winston.transports.File({
            filename: logPath,
            prettyPrint: true,
            maxsize: 10242880, 
            maxFiles: 1,
            format: combine(
                label({label: 'billing-services'}),
                timestamp(),
                appFormat1
            )
        })
    ]
});

winston.loggers.add('cloudant-services', {
    transports: [
        new transports.Console({
            format: combine(
                label({label: 'cloudant-services'}),
                timestamp(),
                winston.format.colorize(),
                appFormat1
            )
        }),
        new winston.transports.File({
            filename: logPath,
            prettyPrint: true,
            maxsize: 10242880, 
            maxFiles: 1,
            format: combine(
                label({label: 'cloudant-services'}),
                timestamp(),
                appFormat1
            )
        })
    ]
});

winston.loggers.add('shared-services-client', {
    transports: [
        new transports.Console({
            format: combine(
                label({label: 'shared-services-client'}),
                timestamp(),
                winston.format.colorize(),
                appFormat1
            )
        }),
        new winston.transports.File({
            filename: logPath,
            prettyPrint: true,
            maxsize: 10242880, 
            maxFiles: 1,
            format: combine(
                label({label: 'shared-services-client'}),
                timestamp(),
                appFormat1
            )
        })
    ]
});