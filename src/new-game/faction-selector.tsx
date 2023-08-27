import {memo, useState} from 'react';
import {Faction} from "../stores/accounts-store.ts";
import './faction-selector.scss'
import FactionData from "./faction-data.tsx";

type FactionSelectorProps = {
    factions: Faction[];
    onSelect: (symbol: string) => void
}

type RenderFactionOptionsProps = {
    factions: Faction[];
    selectedFaction: Faction | null;
    clickFactionOption: (faction: Faction) => void
}

const RenderFactionOptions = ({factions, clickFactionOption, selectedFaction}: RenderFactionOptionsProps) => {
    const recruitingFactions = factions.filter((faction) => faction.isRecruiting)

    const factionOptions = recruitingFactions.map(faction => {
        const isSelected = faction.symbol === selectedFaction?.symbol;

        return <div
            className={'col-12 col-md-3'}
            key={faction.name}
            onClick={() => clickFactionOption(faction)}
        ><div className={`factionOption ${isSelected ? 'selected' : ''}`}>
            {faction.name} ({faction.symbol})
        </div>
        </div>
    })
    return <div className={'row'}>{factionOptions}</div>
}

 function FactionSelector({factions, onSelect}: FactionSelectorProps) {

    const [selectedFaction, setSelectedFaction] = useState<Faction | null>(null);

    const clickFactionOption = (faction: Faction) => {
        setSelectedFaction(faction);
        onSelect(faction.symbol)
    }

    return <div className={'factionOptions'}>
        <h2>Available Factions</h2>
         <RenderFactionOptions factions={factions} selectedFaction={selectedFaction} clickFactionOption={clickFactionOption} />

        {!!selectedFaction && <FactionData faction={selectedFaction as Faction} />}
        </div>
}

export default FactionSelector;