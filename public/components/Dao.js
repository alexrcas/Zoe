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

    async updateEntryValues(id, grams) {
        await this.init();
        const entry = await this.db.get('entries', id);
        if (!entry) { return; }

        const factor = grams / 100;
        entry.grams = grams;
        entry.nutriments = {
            kcals: (entry.nutriments_per100g.kcals * factor).toFixed(1),
            proteins: (entry.nutriments_per100g.proteins * factor).toFixed(1),
            carbs: (entry.nutriments_per100g.carbs * factor).toFixed(1),
            fats: (entry.nutriments_per100g.fats * factor).toFixed(1)
        };
        await this.db.put('entries', entry);
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

    async deleteEntry(entry) {
        await this.init();
        const transaction = this.db.transaction(['entries'], 'readwrite');
        const store = transaction.objectStore('entries');
        store.delete(entry.id);
    }

}