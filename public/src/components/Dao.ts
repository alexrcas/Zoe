import { openDB, IDBPDatabase } from 'idb';

export interface Nutriments {
    kcals: number | string;
    proteins: number | string;
    carbs: number | string;
    fats: number | string;
}

export interface Entry {
    id?: number;
    group: string;
    name: string;
    grams: number;
    code: string;
    nutriments: Nutriments;
    nutriments_per100g: Nutriments;
}

export interface Product {
    code: string;
    name: string;
    nutriments: Nutriments;
}

export interface Goals {
    kcals: number;
    carbs: number;
    fats: number;
    proteins: number;
}

export interface UserData {
    [key: string]: any;
}

export class Dao {
    db: IDBPDatabase | null;

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
                db.createObjectStore('userData');
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

    async saveEntry(entry: Entry) {
        await this.init();
        await this.db!.add('entries', entry);
    }

    async updateEntryValues(id: number, grams: number) {
        await this.init();
        const entry = await this.db!.get('entries', id);
        if (!entry) { return; }

        const factor = grams / 100;
        entry.grams = grams;
        entry.nutriments = {
            kcals: (Number(entry.nutriments_per100g.kcals) * factor).toFixed(1),
            proteins: (Number(entry.nutriments_per100g.proteins) * factor).toFixed(1),
            carbs: (Number(entry.nutriments_per100g.carbs) * factor).toFixed(1),
            fats: (Number(entry.nutriments_per100g.fats) * factor).toFixed(1)
        };
        await this.db!.put('entries', entry);
    }

    async listEntries(): Promise<Entry[]> {
        await this.init();
        return await this.db!.getAll('entries');
    }

    async listProducts(): Promise<Product[]> {
        await this.init();
        return await this.db!.getAll('products');
    }

    async saveProduct(product: Product) {
        await this.init();
        const existing = await this.db!.get('products', product.code);
        if (existing) { return; }
        await this.db!.add('products', product)
    }

    async findProductByBarcode(barcode: string): Promise<Product | undefined> {
        await this.init();
        return await this.db!.get('products', barcode);
    }

    async saveOrUpdateUserGoals(userGoals: Goals) {
        await this.init();
        await this.db!.put('goals', userGoals, 'userGoals');
    }

    async getUserGoals(): Promise<Goals | undefined> {
        await this.init();
        return await this.db!.get('goals', 'userGoals');
    }

    async deleteEntry(entry: Entry) {
        await this.init();
        const transaction = this.db!.transaction(['entries'], 'readwrite');
        const store = transaction.objectStore('entries');
        if (entry.id) {
            store.delete(entry.id);
        }
    }

    async saveOrUpdateUserData(userData: UserData) {
        await this.init();
        await this.db!.put('userData', userData, 'userData');
    }

    async getUserData(): Promise<UserData | undefined> {
        await this.init();
        return await this.db!.get('userData', 'userData');
    }

}