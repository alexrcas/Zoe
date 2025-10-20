import { openDB } from 'https://unpkg.com/idb?module';

export class MealDao {

    constructor() {
        this.db = null;
    }

    async init() {
        if (!this.db) {
            this.db = await openDB('scanDB', 1, {
                upgrade(db) {
                  db.createObjectStore('dailyMeals', { keyPath: 'id', autoIncrement: true });
                  db.createObjectStore('meals', { keyPath: 'barcode' });
                }
              })
        }
    }

    async saveDailyMeal(meal) {
        await this.init();
        await this.db.add('dailyMeals', {
            name: meal.name,
            nutriments: {
              kcal: meal.nutriments.kcal,
              proteins: meal.nutriments.proteins,
              carbs: meal.nutriments.carbs,
              fats: meal.nutriments.fats
            }
          });
    }

    async listDailyMeals() {
        await this.init();
        return await this.db.getAll('dailyMeals');
    }

    async saveMeal(meal) {
        await this.init();
        await this.db.add('meals', {
            name: meal.name,
            barcode: meal.barcode,
            nutriments: {
              kcal: meal.nutriments.kcal,
              proteins: meal.nutriments.proteins,
              carbs: meal.nutriments.carbs,
              fats: meal.nutriments.fats
            }
        })
    }

}