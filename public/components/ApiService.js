
export class ApiService {

    constructor() {

    }

    async findByBarcode(code) {

        const response = await fetch(`https://world.openfoodfacts.net/api/v2/product/${code}.json`, {
            method: "GET"
        });

        const json = await response.json();
        if (json.status != 1) { return; }

        return {
            name: json.product.product_name,
            code: code,
            nutriments: {
                kcals: json.product.nutriments['energy-kcal_100g'],
                proteins: json.product.nutriments.proteins_100g,
                carbs: json.product.nutriments.carbohydrates_100g,
                fats: json.product.nutriments.fat_100g
            }
        }
    }
}