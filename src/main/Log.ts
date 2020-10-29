import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { gray, blue, yellow, red, cyan } from 'colors/safe';
import { app } from 'electron'; //IpcMainEvent

const json2string = JSON.stringify;
const defaultPath = path.join(app.getPath('userData'), 'Log');

export enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
  PANIC,
}

const LogFlags = {
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.ERROR]: 'ERROR',
  [LogLevel.PANIC]: 'PANIC',
};

const LogColors = {
  [LogLevel.DEBUG]: gray,
  [LogLevel.INFO]: blue,
  [LogLevel.WARN]: yellow,
  [LogLevel.ERROR]: red,
  [LogLevel.PANIC]: cyan,
};

export enum LogDest {
  STDOUT,
  FILE,
}

interface LogOptions {
  level: LogLevel;
  prefix?: string;
  dest: LogDest;
  // file options
  path?: string;
  fileSplitSize?: number;
}

function toString(msg: unknown, format: boolean): string {
  if (typeof msg === 'object' || Array.isArray(msg)) {
    try {
      return json2string(msg, null, format ? 2 : undefined);
    } catch (e) {
      return msg ? msg.toString() : '';
    }
  }
  if (msg instanceof Error) {
    return `${msg.constructor.name}: ${msg.message}. ${msg.stack}`;
  }
  if (msg instanceof Object) {
    return msg.toString();
  }
  return `${msg}`;
}

export default class Log {
  static FILENAME_PREFIX = 'sls-';

  private level: LogLevel;

  private dest: LogDest = LogDest.STDOUT;

  private readonly path: string;

  private prefix: string;

  // 写入文件
  private currentFile = '';

  private currentFileIndex = 0;

  private readonly fileSplitSize: number;

  // 缓冲策略
  private readonly buf: Buffer | undefined;

  private bufSize: number = 1024 * 64;

  private bufCurSize = 0;

  private readonly bufTimer: NodeJS.Timeout | undefined;

  private bufLifeTime = 5000;

  constructor(
    opt: LogOptions = { dest: LogDest.STDOUT, level: LogLevel.DEBUG },
  ) {
    this.dest = opt.dest;
    this.level = opt.level;
    this.prefix = opt.prefix || '';
    this.path = opt.path || defaultPath;
    this.fileSplitSize = opt.fileSplitSize || 1024 ** 3;
    if (opt.dest === LogDest.FILE) {
      if (this.createFileDirIfNotExist() && this.createLogFile(true)) {
        this.bufTimer = global.setInterval(() => {
          this.flushLogBuffer();
        }, this.bufLifeTime);
      }
    }
    if (this.dest === LogDest.FILE && this.currentFile) {
      this.buf = Buffer.alloc(this.bufSize);
    }
  }

  private createFileDirIfNotExist(): boolean {
    if (fs.existsSync(this.path) && fs.lstatSync(this.path).isDirectory()) {
      return true;
    }
    fs.mkdirSync(this.path, { recursive: true, mode: 0o755 });
    if (!fs.lstatSync(this.path).isDirectory()) {
      this.resetToStdout();
      this.warn(`Cannot create a log directory: ${this.path}.`);
      return false;
    }
    return true;
  }

  private createLogFile(first = false): boolean {
    if (!this.createFileDirIfNotExist()) {
      return false;
    }
    let index = Math.max(this.currentFileIndex, 0);
    let fname = path.resolve(this.path, `${Log.FILENAME_PREFIX}${index}`);
    while (fs.existsSync(fname) && fs.lstatSync(fname).isFile()) {
      index += 1;
      fname = path.resolve(this.path, `${Log.FILENAME_PREFIX}${index}`);
    }
    // 如果前一个文件没有到达切割文件的尺寸，就使用前一个文件
    if (first && index > 0) {
      let prevFile = '';
      let stats: fs.Stats;
      try {
        prevFile = path.resolve(
          this.path,
          `${Log.FILENAME_PREFIX}${index - 1}`,
        );
        stats = fs.statSync(prevFile);
      } catch (e) {
        this.resetToStdout();
        this.warn(`Cannot read file info of "${prevFile}". ${e}`);
      }
      try {
        fs.accessSync(prevFile, fs.constants.W_OK);
        if (stats!.size < this.fileSplitSize) {
          fname = prevFile;
          this.currentFileIndex = index - 1;
        }
      } catch (e) {
        //
      }
    }

    try {
      this.currentFile = fname;
      if (!fs.existsSync(this.currentFile)) {
        fs.appendFileSync(this.currentFile, '');
      }
    } catch (e) {
      this.resetToStdout();
      this.error(e);
      return false;
    }
    return true;
  }

  private resetToStdout(): void {
    this.dest = LogDest.STDOUT;
  }

  private flushLogBuffer(): void {
    if (this.dest === LogDest.FILE && this.bufCurSize > 0) {
      // 如果当前日志大于等于切割的尺寸，就切割一个新文件
      let stats;
      try {
        stats = fs.statSync(this.currentFile);
      } catch (e) {
        // todo 处理文件异常的情况
        Log.outputStdout(
          this.buf!.toString('utf8', 0, this.bufCurSize),
          LogLevel.ERROR,
        );
        this.bufCurSize = 0;
        Log.outputStdout(
          `fail to read log file: ${this.currentFile}. ${e}`,
          LogLevel.ERROR,
        );
        return;
      }
      if (stats.size >= this.fileSplitSize && !this.createLogFile()) {
        return;
      }
      const bf = this.buf!.slice(0, this.bufCurSize);
      fs.appendFile(this.currentFile, bf, { flag: 'a' }, (err) => {
        if (err) {
          Log.outputStdout(
            `fail to write log to file. (${bf.toString()})`,
            LogLevel.ERROR,
          );
        }
        this.bufCurSize = 0;
      });
    }
  }

  private outputFile(msg: string): void {
    fs.appendFile(this.currentFile, msg, (err) => {
      if (err) {
        Log.outputStdout(`fail to write log to file. (${msg})`, LogLevel.ERROR);
      }
      this.bufCurSize = 0;
    });
  }

  static outputStdout(msg: string, level: LogLevel): void {
    fs.write(1, LogColors[level](msg), () => {
      //
    });
  }

  private log(msg: Array<unknown>, level: LogLevel): void {
    const isStdout = this.dest === LogDest.STDOUT;
    const message = `${new Date().toLocaleString()} ${
      LogFlags[level]
    } ${msg.map((item) => toString(item, isStdout)).join(' ')}${os.EOL}`;
    if (this.dest === LogDest.FILE) {
      const len = Buffer.byteLength(message);
      if (len >= this.bufSize - this.bufCurSize) {
        this.flushLogBuffer();
        this.outputFile(message);
        this.bufCurSize = 0;
      } else {
        this.buf!.write(message, this.bufCurSize + 1);
        this.bufCurSize += len;
      }
    } else if (this.dest === LogDest.STDOUT) {
      Log.outputStdout(message, level);
    }
  }

  debug(...msg: Array<unknown>): void {
    this.log(msg, LogLevel.DEBUG);
  }

  info(...msg: Array<unknown>): void {
    this.log(msg, LogLevel.INFO);
  }

  warn(...msg: Array<unknown>): void {
    this.log(msg, LogLevel.WARN);
  }

  error(...msg: Array<unknown>): void {
    this.log(msg, LogLevel.ERROR);
  }

  panic(...msg: Array<unknown>): void {
    this.log(msg, LogLevel.PANIC);
  }

  destroy(): void {
    if (this.bufTimer) {
      clearInterval(this.bufTimer as NodeJS.Timeout);
    }
    this.flushLogBuffer();
  }
}
