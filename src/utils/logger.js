const fs = require('fs');
const path = require('path');

// Criar diretório de logs se não existir
const logDir = path.join(__dirname, '..', '..', 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFile = path.join(logDir, 'app.log');

class Logger {
  static formatMessage(level, message, ...args) {
    const timestamp = new Date().toISOString();
    const formattedArgs = args.length > 0 ? ` ${JSON.stringify(args)}` : '';
    return `[${timestamp}] ${level}: ${message}${formattedArgs}\n`;
  }

  static log(level, message, ...args) {
    const formattedMessage = this.formatMessage(level, message, ...args);

    // Sempre escrever no arquivo
    fs.appendFileSync(logFile, formattedMessage);

    // Só mostrar no console em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${level}] ${message}`, ...args);
    }
  }

  static info(message, ...args) {
    this.log('INFO', message, ...args);
  }

  static warn(message, ...args) {
    this.log('WARN', message, ...args);
  }

  static error(message, ...args) {
    this.log('ERROR', message, ...args);
  }

  static debug(message, ...args) {
    if (process.env.NODE_ENV === 'development') {
      this.log('DEBUG', message, ...args);
    }
  }
}

module.exports = Logger;