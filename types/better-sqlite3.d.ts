declare module 'better-sqlite3' {
  import { EventEmitter } from 'events';

  interface DatabaseOptions {
    readonly?: boolean;
    fileMustExist?: boolean;
    timeout?: number;
    verbose?: ((message?: any, ...additionalArgs: any[]) => void) | null;
  }

  interface RunResult {
    changes: number;
    lastInsertRowid: number;
  }

  interface PrepareOptions {
    readonly?: boolean;
  }

  class Statement {
    database: Database;
    source: string;
    reader: boolean;
    constructor(db: Database, source: string, options?: PrepareOptions);
    run(...params: any[]): RunResult;
    get(...params: any[]): any;
    all(...params: any[]): any[];
    iterate(...params: any[]): IterableIterator<any>;
    bind(...params: any[]): this;
    reset(): this;
    finalize(): this;
    safeIntegers(enabled?: boolean): this;
    columns(): Array<{ name: string; column: string | null; table: string | null; database: string | null; type: string | null }>;
  }

  class Database extends EventEmitter {
    constructor(filename: string, options?: DatabaseOptions);
    prepare(source: string, options?: PrepareOptions): Statement;
    exec(source: string): this;
    pragma(source: string, options?: { simple?: boolean }): any;
    checkpoint(databaseName?: string): this;
    function(name: string, options?: { varargs?: boolean }, callback?: (...params: any[]) => any): this;
    aggregate(name: string, options?: { varargs?: boolean }, step?: (...params: any[]) => void, finalize?: () => any): this;
    table(name: string, options?: { varargs?: boolean }, factory?: (...params: any[]) => any): this;
    loadExtension(path: string): this;
    transaction(fn: (...params: any[]) => any): (...params: any[]) => any;
    close(): this;
    defaultSafeIntegers(enabled?: boolean): this;
    backup(filename: string, options?: { progress?: (info: { totalPages: number; remainingPages: number }) => void }): this;
    serialize(options?: { attach?: string; detach?: string }): Buffer;
    readonly open: boolean;
    readonly inTransaction: boolean;
    readonly name: string;
    readonly memory: boolean;
    readonly readonly: boolean;
  }

  export = Database;
}

