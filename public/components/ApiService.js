
export class ApiService {

    constructor() {

    }

    async findByBarcode(code) {

        const response = await fetch(`https://world.openfoodfacts.net/api/v2/product/${code}.json`, {
            method: "GET"
        });

        const json = await response.json();
        if (json.status != 1) { return; }

        if (!json.product.product_name) {
            return null;
        }

        return {
            name: json.product.product_name,
            code: code,
            nutriments: {
                kcals: json.product.nutriments['energy-kcal_100g'] || 0,
                proteins: json.product.nutriments.proteins_100g || 0,
                carbs: json.product.nutriments.carbohydrates_100g || 0,
                fats: json.product.nutriments.fat_100g || 0
            }
        }
    }

    async search(terms) {
        terms = terms.replaceAll(' ', '+');

        const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${terms}&search_simple=1&fields=code,product_name,brands,nutriments&page_size=10&page=1&json=1`, {
            method: "GET"
        });

        if (!response.ok) { return []; }

        const json = await response.json();

        return json.products.map(p =>
            ({
                name: p.product_name,
                brands: p.brands,
                code: p.code,
                nutriments: {
                    kcals: p.nutriments['energy-kcal_100g'],
                    proteins: p.nutriments.proteins_100g,
                    carbs: p.nutriments.carbohydrates_100g,
                    fats: p.nutriments.fat_100g
                }
            })
        );
    }
}