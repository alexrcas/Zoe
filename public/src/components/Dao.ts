import { openDB, IDBPDatabase } from 'idb';

export interface Nutriments {
    kcals: number;
    proteins: number;
    carbs: number;
    fats: number;
}

export interface Product {
    code: string;
    name: string;
    nutriments: Nutriments;
}

export interface AbstractEntry {
    id?: number,
    group: string,
    name: string,
    nutriments: Nutriments,
}

export interface Entry extends AbstractEntry {
    grams: number;
    code: string;
    product: Product;
}

export interface DishEntry extends AbstractEntry {
    dishDto: DishDto
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

export interface Ingredient {
    id: number;
    product: Product;
    grams: number;
    nutriments: Nutriments;
}

export interface Dish {
    id?: number;
    name: string;
    nutriments: Nutriments;
    ingredients: Ingredient[];
}

export interface DishDto {
    name: string;
    nutriments: Nutriments;
    ingredients: Ingredient[];
}

export class Dao {
    private static instance: Dao;
    private db: Promise<IDBPDatabase>;

    private constructor() {
        this.db = this.openDatabase();
    }

    public static getInstance(): Dao {
        if (!Dao.instance) {
            Dao.instance = new Dao();
        }
        return Dao.instance;
    }

    private async openDatabase(): Promise<IDBPDatabase> {
        const db = await openDB('scanDB', 1, {
            upgrade(db) {
                db.createObjectStore('entries', { keyPath: 'id', autoIncrement: true });
                db.createObjectStore('dishes', { keyPath: 'id', autoIncrement: true });
                db.createObjectStore('products', { keyPath: 'code' });
                db.createObjectStore('goals');
                db.createObjectStore('userData');
            }
        });

        const existingGoals = await db.get('goals', 'userGoals');
        if (!existingGoals) {
            const goals = {
                kcals: 1820,
                carbs: 250,
                fats: 60,
                proteins: 70
            };
            await db.put('goals', goals, 'userGoals');
        }

        return db;
    }

    async saveEntry(entry: AbstractEntry) {
        const db = await this.db;
        await db.add('entries', entry);
    }

    async saveOrUpdateDish(dish: Dish) {
        const db = await this.db;
        return await db.put('dishes', dish);
    }

    async updateEntryValues(id: number, grams: number) {
        const db = await this.db;
        const entry = await db.get('entries', id);
        if (!entry) { return; }

        const factor: number = grams / 100;
        entry.grams = grams;
        entry.nutriments = {
            kcals: (Number(entry.product.nutriments.kcals) * factor).toFixed(1),
            proteins: (Number(entry.product.nutriments.proteins) * factor).toFixed(1),
            carbs: (Number(entry.product.nutriments.carbs) * factor).toFixed(1),
            fats: (Number(entry.product.nutriments.fats) * factor).toFixed(1)
        };

        await db.put('entries', entry);
    }

    async listEntries(): Promise<AbstractEntry[]> {
        const db = await this.db;
        return await db.getAll('entries');
    }

    async listProducts(): Promise<Product[]> {
        const db = await this.db;
        return await db.getAll('products');
    }

    async listDishes(): Promise<Dish[]> {
        const db = await this.db;
        return await db.getAll('dishes');
    }

    async saveProduct(product: Product) {
        const db = await this.db;
        const existing = await db.get('products', product.code);
        if (existing) { return; }
        await db.add('products', product)
    }

    async findProductByBarcode(barcode: string): Promise<Product | undefined> {
        const db = await this.db;
        return await db.get('products', barcode);
    }

    async saveOrUpdateUserGoals(userGoals: Goals) {
        const db = await this.db;
        await db.put('goals', userGoals, 'userGoals');
    }

    async getUserGoals(): Promise<Goals | undefined> {
        const db = await this.db;
        return await db.get('goals', 'userGoals');
    }

    async deleteEntry(entry: Entry) {
        const db = await this.db;
        const transaction = db.transaction(['entries'], 'readwrite');
        const store = transaction.objectStore('entries');
        if (entry.id) {
            store.delete(entry.id);
        }
    }

    async saveOrUpdateUserData(userData: UserData) {
        const db = await this.db;
        await db.put('userData', userData, 'userData');
    }

    async getUserData(): Promise<UserData | undefined> {
        const db = await this.db;
        return await db.get('userData', 'userData');
    }

    async getDish(id: number): Promise<Dish> {
        const db = await this.db;
        return await db.get('dishes', id);
    }

    async deleteDish(dish: Dish) {
        const db = await this.db;
        const transaction = db.transaction(['dishes'], 'readwrite');
        const store = transaction.objectStore('dishes');
        if (dish.id) {
            store.delete(dish.id);
        }
    }
}