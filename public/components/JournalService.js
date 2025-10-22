import { Dao } from '../components/Dao.js';

export class JournalService {

    constructor() {
        this.dao = new Dao();
    }

    async getJournal() {

        const entries = await this.dao.listEntries();
        const groups = ['Desayuno', 'Almuerzo', 'Cena', 'Aperitivo'];

        const journal = [];
        groups.forEach(gr => {
            const item = { group: gr, entries: entries.filter(ent => ent.group === gr) }
            journal.push(item)
        });


        return journal;
    }

}
