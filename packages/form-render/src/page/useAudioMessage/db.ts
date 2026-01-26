interface StorageItem {
  id?: number;
  data: any;
  datetime: number;
}

class StorageDB {
  private dbName: string;
  private storeName: string;
  private version: number;
  private db: IDBDatabase | null;

  constructor(
    dbName: string = "StorageDB",
    storeName: string = "sessions",
    version: number = 1,
  ) {
    this.dbName = dbName;
    this.storeName = storeName;
    this.version = version;
    this.db = null;
    this.initDB();
  }

  initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        reject("IndexedDB打开失败");
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        if (!event.target) return;
        const db = (event.target as any).result as IDBDatabase;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const objectStore = db.createObjectStore(this.storeName, {
            keyPath: "id",
            autoIncrement: true,
          });
          objectStore.createIndex("datetime", "datetime", { unique: false });
        }
      };
    });
  }

  getDB(): Promise<IDBDatabase> {
    if (this.db) {
      return Promise.resolve(this.db);
    }
    return this.initDB();
  }

  async add(data: any, datetime: number = Date.now()): Promise<number> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.add({ data, datetime });

      request.onsuccess = () => {
        resolve(request.result as number);
      };

      request.onerror = () => {
        reject("添加数据失败");
      };
    });
  }

  async delete(id: number): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject("删除数据失败");
      };
    });
  }

  async clear(): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject("清除数据失败");
      };
    });
  }

  async getLatestByDatetime(): Promise<StorageItem | null> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, "readonly");
      const store = transaction.objectStore(this.storeName);
      const index = store.index("datetime");
      const request = index.openCursor(null, "prev");

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          resolve(cursor.value as StorageItem);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => {
        reject("查找数据失败");
      };
    });
  }
}

export default StorageDB;
