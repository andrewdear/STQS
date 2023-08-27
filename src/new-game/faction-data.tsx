import {Faction, Trait} from "../stores/accounts-store.ts";
import './faction-data.scss';

type FactionDataProps = {
    faction: Faction
}

type RenderTraitsProps = {
    traits: Trait[]
}

const RenderTraits = ({traits}: RenderTraitsProps) => {
    const traitList = traits.map(trait => {
        return <div className={'traitItem'}>
            <p>Name: {trait.name}</p>
            <p>Symbol: {trait.symbol}</p>
            <p>Description: {trait.description}</p>
        </div>
    })

    return <div className={'factionData'}>
        {traitList}
    </div>
}

const FactionData = ({faction}: FactionDataProps) => {
 return <div className={'row'}>
     <div className={'col-12'}>
         <h2>Faction Information</h2>

         <p>Name: {faction.name}</p>
         <p>Symbol: {faction.symbol}</p>
         <p>Description: {faction.description}</p>
         <p>Headquarters: {faction.headquarters}</p>

         <p>Traits:</p>

         <RenderTraits traits={faction.traits} />
     </div>

 </div>
}

export default FactionData