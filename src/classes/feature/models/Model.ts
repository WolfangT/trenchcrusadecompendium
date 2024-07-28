import { ITrenchCrusadeItemData, TrenchCrusadeItem } from '../../TrenchCrusadeItem'
import { ItemType } from '../../Enum'
import { PlayerAddon } from '../addons/Addon'
import { DescriptionFactory } from '../../../utility/functions'

/**
 * Structure of a Model
 */
interface IPlayerModel extends ITrenchCrusadeItemData {
    movement: string,
    ranged: string,
    melee: string,
    armour: string,
    base: string,
    faction_id: string,
    variant_id: string,
    attachments: [],
    blurb: [], 
    equipment: [],
    abilities: [],
    team?: string
}

/**
 * Model without the context of a particular faction
 * or variant - stats, features, and abilities.
 */
class PlayerModel extends TrenchCrusadeItem {
    public readonly Movement;
    public readonly Ranged;
    public readonly Melee;
    public readonly Armour;
    public readonly Base;
    public readonly Team;
    
    public readonly Faction;
    public readonly Variant;
    public readonly Attachments;
    public readonly Blurb;
    public readonly Equipment;
    public readonly Abilities;

    public Addons: PlayerAddon[] = [];
    
    /**
     * Assigns parameters and creates a series of description
     * objects with DescriptionFactory
     * @param data Object data in IPlayerModel format
     */
    public constructor(data: IPlayerModel)
    {
        super(data)
        this.ItemType = ItemType.Model;
        this.Variant = data.variant_id;
        this.Faction = data.faction_id;
        this.Attachments = data.attachments;

        // Stats
        this.Movement = data.movement;
        this.Melee = data.melee;
        this.Ranged = data.ranged;
        this.Armour = data.armour;
        this.Base = data.base;
        //

        if (data.team) {
            this.Team = data.team;
        } else {
            this.Team = "none"
        }

        this.Blurb = DescriptionFactory(data.blurb);
        this.Equipment = DescriptionFactory(data.equipment);
        this.Abilities = DescriptionFactory(data.abilities);
    }

    /**
     * Add an addon to the model
     * @param list the PlayerAddon being created
     */
    public AddAddons(list: PlayerAddon) {
        this.Addons.push(list);
    }
    
    /**
     * When destroyed, also delete all associated
     * addon objects.
     */
    destructor() {
        let i = 0;
        for (i = 0; i < this.Addons.length; i++) {
            delete this.Addons[i];
        }
        for (i = 0; i < this.Equipment.length; i++) {
            delete this.Equipment[i];
        }
        for (i = 0; i < this.Abilities.length; i++) {
            delete this.Abilities[i];
        }
    }
}

export {IPlayerModel, PlayerModel}

