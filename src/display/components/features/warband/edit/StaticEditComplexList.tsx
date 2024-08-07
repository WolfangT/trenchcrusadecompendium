
import React, { useState } from 'react'
import { WarbandManager } from "../../../../../classes/lists/warbandmanager"
import { Warband } from "../../../../../classes/lists/Warband"
import { WarbandMember } from "../../../../../classes/lists/WarbandMember"
import ItemEquipDisplay from './ItemEquipDisplay'
import { Requester } from '../../../../../factories/Requester'

export interface ItemCost {
    type : string,
    value : number
}

export interface EditListType {
    title      : string,
    returnItemArray : (_warband : Warband | null, _member? : WarbandMember | null) => any[],
    returnShowSelector : (_warband : Warband | null, _member? : WarbandMember | null) => boolean,
    returnOptions : (_this : EditListType, _manager : WarbandManager, _warband : Warband | null, _filters : {[_name : string] : boolean}, _member? : WarbandMember | null) => any[],
    displayOptions : (_this : EditListType, _manager : WarbandManager, _warband : Warband | null, _item : any, _filters : {[_name : string] : boolean}, _member? : WarbandMember | null) => JSX.Element,
    returnFilters : () => {[_name : string] : boolean},
    returnItem : (_this : EditListType, _manager : WarbandManager, _warband : Warband | null, _item : any, update: any, _member? : WarbandMember | null) => JSX.Element,
    returnItemData : (_this : EditListType, _manager : WarbandManager, _warband : Warband | null, _item : any, _filters : {[_name : string] : boolean}, _member? : WarbandMember | null) => any,
    returnComment : (_this : EditListType, _manager : WarbandManager, _warband : Warband | null, _item : any, _filters : {[_name : string] : boolean}, _member? : WarbandMember | null) => string,
    returnCost : (_this : EditListType, _manager : WarbandManager, _warband : Warband | null, _item : any, _filters : {[_name : string] : boolean}, _member? : WarbandMember | null) => ItemCost,
    addNewItem : (_manager : WarbandManager, _warband : Warband | null, itemName : string, close : any, update: any, _cost : ItemCost, _member? : WarbandMember | null) => void,
    filterItem : (_this : EditListType, _manager : WarbandManager, _warband : Warband | null, _item : any, _filter : {[_name : string] : boolean},  _member? : WarbandMember | null) => true | false,
    tossItem? : ( _manager : WarbandManager, _warband : Warband | null, _item : any, update: any, _member? : WarbandMember | null) => void,
    sellItem? : ( _manager : WarbandManager, _warband : Warband | null, _item : any, update: any, _member? : WarbandMember | null) => void,
    refundItem? : (_manager : WarbandManager, _warband : Warband | null, _item : any, update: any, _member? : WarbandMember | null) => void
}

export interface EditListDataTable {[moveid: Lowercase<string>]: EditListType}

export const EditListDataDex : EditListDataTable = {
    warbandequipment: {
        title      : 'Add To The Armoury',
        returnItemArray (_warband : Warband | null, _member? : WarbandMember | null) {
            if (_warband) { return _warband.Armoury; }
            return []
        },
        returnShowSelector (_warband : Warband | null, _member? : WarbandMember | null) {
            return true;
        },
        returnOptions (_this : EditListType, _manager : WarbandManager, _warband : Warband | null,  _filters : {[_name : string] : boolean}, _member? : WarbandMember | null) {
            if ((_filters['Restricted'] === true) && (_warband)) {
                return _warband.Faction.Equipment.filter((value : any) => _this.filterItem(_this, _manager, _warband, value, _filters,  _member))            
            } else { return _manager.Equipment.filter((value : any) => _this.filterItem(_this, _manager, _warband, value, _filters,  _member)) }
        },
        displayOptions (_this : EditListType, _manager : WarbandManager, _warband : Warband | null, _item : any, _filters : {[_name : string] : boolean}, _member? : WarbandMember | null) {
            return (
                <>
                    {(_filters['Restricted'] === true) && <option key={"modeloption"} value={_item.Object.ID}>{_item.Object.Name}</option> } 
                    {(_filters['Restricted'] === false) && <option key={"modeloption"} value={_item.ID}>{_item.Name}</option>}
                </>
            )
        },
        returnFilters () {
            const FilterList : {[_name : string] : boolean} = {}

            FilterList['Restricted'] = true;
            FilterList['Ranged'] = true;
            FilterList['Melee'] = true;
            FilterList['Armour'] = true;
            FilterList['Equipment'] = true;
            FilterList['Glory'] = true;
            FilterList['Ducats'] = true;

            return FilterList;
        },
        returnItem (_this : EditListType, _manager : WarbandManager, _warband : Warband | null, _item : any, update: any, _member? : WarbandMember | null) {
            return ( <ItemEquipDisplay  updater={update} manager={_manager} warband={_warband} data={_item} tossitem={_this.tossItem} sellitem={_this.sellItem} refunditem={_this.refundItem}/> )
        },
        returnItemData (_this : EditListType, _manager : WarbandManager, _warband : Warband | null, _item : any, _filter : {[_name : string] : boolean}, _member? : WarbandMember | null) {
            if ((_filter['Restricted'] === true) && (_warband)) {
                const tempModel = _manager.GetEquipmentByID(_item)
                let temp : any = null;
                let i = 0;
                for (i = 0 ; i < _warband.Faction.Equipment.length ; i++) {
                    if (_warband.Faction.Equipment[i].ID == (tempModel? tempModel.ID : "")) {
                        temp = _warband.Faction.Equipment[i]
                        break;
                    }
                }
                return temp;
            } else {
                return _item;
            }
        },
        returnComment (_this : EditListType, _manager : WarbandManager, _warband : Warband | null, _item : any, _filter : {[_name : string] : boolean}, _member? : WarbandMember | null) {
            if (typeof _item === 'string') { return  ""
            } else if (_warband) {
                let rstrctnlst = "";
                let i = 0;
                let ModelEquip : any = null;
                
                for (i = 0; i < _warband.Faction.Equipment.length ; i++) {
                    if (_warband.Faction.Equipment[i].ID == _item.ID) { ModelEquip = _warband.Faction.Equipment[i] }
                }

                if (ModelEquip != null) {
                    if (ModelEquip.Limit > 0) {
                        rstrctnlst += "LIMIT: " + ModelEquip.Limit;
                        if (ModelEquip.Restrictions.length > 0) { rstrctnlst += ", " }
                    }

                    let i = 0;
                    for (i = 0; i < ModelEquip.Restrictions.length; i++) {
                        if ( i > 0) { rstrctnlst += ", " }
                        if (ModelEquip.Restrictions[i].type == "keyword") {
                            rstrctnlst += ModelEquip.Restrictions[i].val.toString().toUpperCase();
                        } else if (ModelEquip.Restrictions[i].type == "purchase") {
                            rstrctnlst += (ModelEquip.Restrictions[i].val === 'explore')? "Exploration Only" : "";
                        } else if (ModelEquip.Restrictions[i].type == "model") {
                            rstrctnlst += (Requester.MakeRequest({searchtype: "id", searchparam: {type: 'models', id: ModelEquip.Restrictions[i].val.toString()}})).name
                         } else { rstrctnlst += ModelEquip.Restrictions[i].val.toString() }
                    }
                }

                if (rstrctnlst == "") { rstrctnlst = "-" }
                return rstrctnlst;
            }
            return "";
        },
        returnCost (_this : EditListType, _manager : WarbandManager, _warband : Warband | null, _item : any, _filter : {[_name : string] : boolean}, _member? : WarbandMember | null) {
            if (typeof _item === 'string') {
                return {type: 'ducats', value: 0}
            } else { return {type: _item.CostID, value: _item.Cost} }
        },
        addNewItem (_manager : WarbandManager, _warband : Warband | null, itemName : string, close : any, update: any, _cost : ItemCost, _member? : WarbandMember | null) {
            if (_warband) {
                const Result = _manager.NewEquipmentForWarband(_warband, itemName, _cost.value.toString(), _cost.type);
                update()
            }
        },
        filterItem (_this : EditListType, _manager : WarbandManager, _warband : Warband | null, _item : any, _filter : {[_name : string] : boolean},  _member? : WarbandMember | null) {
            
            let ItemToCheck;

            if (_filter['Restricted'] === true) {
                if (_warband) {
                    if ((_filter['Glory'] === false) && (_item.CostID === 'glory')) { return false; }
                    if ((_filter['Ducats'] === false) && (_item.CostID === 'ducats')) { return false; }
                    ItemToCheck = _item.Object;
                } else { return false; }
            } else { ItemToCheck = _item; }

            if ((_filter['Ranged'] === false) && (ItemToCheck.Category === 'ranged')) { return false; }     
            if ((_filter['Melee'] === false) && (ItemToCheck.Category === 'melee')) { return false; }     
            if ((_filter['Armour'] === false) && (ItemToCheck.Category === 'armour')) { return false; }     
            if ((_filter['Equipment'] === false) && (ItemToCheck.Category === 'equipment')) { return false; }            

            return true;
        },
        tossItem (_manager : WarbandManager, _warband : Warband | null, _item : any, update: any, _member? : WarbandMember | null) {
            if (_warband) {
                if (_item.CostType == "ducats") {
                    _warband.DucatLost += _item.Cost;
                } else { _warband.GloryLost += _item.Cost; }
                _manager.DeleteEquipmentFromWarband(_item, _warband)
                update()
            }
        },
        sellItem (_manager : WarbandManager, _warband : Warband | null, _item : any, update: any, _member? : WarbandMember | null) {
            if (_warband) {
                if (_item.CostType == "ducats") {
                    _warband.DucatLost += Math.floor(_item.Cost * 0.5);
                } else { _warband.GloryLost += Math.floor(_item.Cost * 0.5) }
                _manager.DeleteEquipmentFromWarband(_item, _warband)
                update()
            }
        },
        refundItem (_manager : WarbandManager, _warband : Warband | null, _item : any, update: any, _member? : WarbandMember | null) {
            if (_warband) {
                _manager.DeleteEquipmentFromWarband(_item, _warband)
                update()
            }
        }

    }
    
}