import {useAccountsStore} from "../stores/accounts-store.ts";
import {useCallback, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";

const AgentHome = () => {
    const navigate = useNavigate();

    const currentAccount = useAccountsStore(useCallback((state) => state.currentAccount, []))

    useEffect(() => {
        if(!currentAccount) {
            navigate("/");
        }
    }, [currentAccount])


    return <div className={'container-fluid'}>
        <h2>Agent Info</h2>
        <p>Name: {currentAccount?.name}</p>

        <Link to={'/'}><button>Sign Off</button></Link>
    </div>
}

export default AgentHome;