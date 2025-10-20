import { openDB } from 'https://unpkg.com/idb?module';

export class Dao {

    constructor() {
        this.db = null;
    }

    async init() {
        if (!this.db) {
            this.db = await openDB('scanDB', 1, {
                upgrade(db) {
                  db.createObjectStore('entries', { keyPath: 'id', autoIncrement: true });
                  db.createObjectStore('products', { keyPath: 'code' });
                }
              })
        }
    }

    async saveEntry(entry) {
        await this.init();
        await this.db.add('entries', entry);
    }

    async listEntres() {
        await this.init();
        return await this.db.getAll('entries');
    }

    async saveProduct(product) {
        await this.init();
        const existing = await this.db.get('products', product.code);
        if (existing) { return; }
        await this.db.add('products', product)
    }

    async findMealByBarcode(barcode) {
        await this.init();
        return await this.db.get('products', barcode);
    }

}