import './load-game.scss';
import {Link, useNavigate} from "react-router-dom";
import {Account, useAccountsStore} from "../stores/accounts-store.ts";
import {useCallback, useEffect} from "react";

type RenderSavedGamesProps = {
    accounts: Account[]
}

const RenderSavedGames = ({accounts}: RenderSavedGamesProps) => {
    const setCurrentAccount = useAccountsStore(useCallback((state) => state.setCurrentAccount, []))
    const navigate = useNavigate();

    const selectAccount = (account: Account) => {
        setCurrentAccount(account)
        navigate("/agent");
    }

    const accountOptions = accounts.map(account => {
        return <div
            className={'col-12'}
            key={account.name}
            onClick={() => selectAccount(account)}
        ><div className={`accountOption`}>
            {account.name} ({account.factionName})
        </div>
        </div>
    })
    return <div className={'row'}>{accountOptions}</div>
}

const LoadGame = () => {
    const navigate = useNavigate();
    const accounts = useAccountsStore(useCallback((state) => state.accounts, []))

    const hasSavedGames = !!accounts.length

    useEffect(() => {
        if(!hasSavedGames) {
            navigate("/");
        }
    }, [hasSavedGames])

    return <div className={'container-fluid'}>
        <h2>Agents</h2>
        <RenderSavedGames accounts={accounts} />
    </div>
}

export default LoadGame;