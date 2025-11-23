import { Dao, Entry } from '../components/Dao';

export interface JournalGroup {
    group: string;
    entries: Entry[];
}

export class JournalService {
    dao: Dao;

    constructor() {
        this.dao = Dao.getInstance();
    }

    async getJournal(): Promise<JournalGroup[]> {

        const entries = await this.dao.listEntries();
        const groups = ['Desayuno', 'Almuerzo', 'Cena', 'Aperitivo'];

        const journal: JournalGroup[] = [];
        groups.forEach(gr => {
            const item = { group: gr, entries: entries.filter(ent => ent.group === gr) }
            journal.push(item)
        });


        return journal;
    }

}
