import { openDB } from 'https://unpkg.com/idb?module';

export class Dao {

    constructor() {
        this.db = null;
    }

    async init() {
        if (this.db) { return; }

        this.db = await openDB('scanDB', 1, {
            upgrade(db) {
              db.createObjectStore('entries', { keyPath: 'id', autoIncrement: true });
              db.createObjectStore('products', { keyPath: 'code' });
              db.createObjectStore('goals');
            }
          });

        const existingGoals = await this.getUserGoals();
        if (existingGoals) { return; }

        const goals = {
            kcals: 1820,
            carbs: 250,
            fats: 60,
            proteins: 70
        };

        await this.saveOrUpdateUserGoals(goals)
    }

    async saveEntry(entry) {
        await this.init();
        await this.db.add('entries', entry);
    }

    async listEntries() {
        await this.init();
        return await this.db.getAll('entries');
    }

    async listProducts() {
        await this.init();
        return await this.db.getAll('products');
    }

    async saveProduct(product) {
        await this.init();
        const existing = await this.db.get('products', product.code);
        if (existing) { return; }
        await this.db.add('products', product)
    }

    async findProductByBarcode(barcode) {
        await this.init();
        return await this.db.get('products', barcode);
    }

    async saveOrUpdateUserGoals(userGoals) {
        await this.init();
        await this.db.put('goals', userGoals, 'userGoals');
    }

    async getUserGoals() {
        await this.init();
        return await this.db.get('goals', 'userGoals');
    }

}