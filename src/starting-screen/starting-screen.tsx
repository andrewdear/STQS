import {Link} from "react-router-dom";
import {useAccountsStore} from "../stores/accounts-store.ts";
import {useCallback} from "react";

const StartingScreen = () => {
    const accounts = useAccountsStore(useCallback((state) => state.accounts, []))

    const hasSavedGames = !!accounts.length

    return <div className={'container-fluid'}>
        <Link to={'/new-game'}><button>New Game</button></Link>
        <Link to={'/load-game'}><button disabled={!hasSavedGames}>Load Game</button></Link>
    </div>
}

export default StartingScreen;