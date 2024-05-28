import {ITrenchCrusadeItemData, TrenchCrusadeItem} from '../../TrenchCrusadeItem'
import {ItemType} from '../../Enum'
import {ModelDescription} from '../models/ModelDescription'
import { IEquipmentFactionList, IEquipmentRestriction, FactionEquip } from './FactionEquip'
import { IFactionRuleset, FactionRule } from './FactionRule'

interface IPlayerFaction extends ITrenchCrusadeItemData {
    name: string,
    flavour: [],
    rules: IFactionRuleset[],
    equipment: IEquipmentFactionList[]
}

class PlayerFaction extends TrenchCrusadeItem {
    public readonly Name;
    public readonly Flavour;
    public readonly Rules;
    public readonly Equipment;
    
    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IPlayerModel format
     */
    public constructor(data: IPlayerFaction)
    {
        super(data)
        this.ItemType = ItemType.Faction;

        this.Name = data.name;
        this.Equipment = this.EquipmentFactory(data.equipment)
        this.Rules = this.RulesetFactory(data.rules);
        this.Flavour = this.DescriptionFactory(data.flavour);
    }

    private RulesetFactory(data: IFactionRuleset[]) {
        const ruleslist = [];
        let i = 0;
        for (i = 0; i < data.length; i++) {
            const tempAD = new FactionRule(data[i]);
            ruleslist.push(tempAD);
        }
        return ruleslist;
    }

    private EquipmentFactory(data: IEquipmentFactionList[]) {
        const ruleslist = [];
        let i = 0;
        for (i = 0; i < data.length; i++) {
            const tempAD = new FactionEquip(data[i]);
            ruleslist.push(tempAD);
        }
        return ruleslist;
    }

    /**
     * Translates the description JSON objects into a collection
     * of ModelDescription objects
     * @param data The array of description data objects
     * @returns Array of ModelDescription objects
     */
    private DescriptionFactory(data: []) {
        let i = 0;
        const array: ModelDescription[] = []
        for (i = 0; i < data.length; i++) {
            const tempAD = new ModelDescription(data[i])
            array.push(tempAD)
        }
        return array;
    }
    
    /**
     * When destroyed, also delete all associated
     * addon objects.
     */
    destructor() {
        let i = 0;
        for (i = 0; i < this.Flavour.length; i++) {
            delete this.Flavour[i];
        }
    }

}

export {IPlayerFaction, PlayerFaction}
