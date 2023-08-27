import {useCallback, useState, useEffect} from "react"
import {useAccountsStore} from "../stores/accounts-store.ts";
import FactionSelector from "./faction-selector.tsx";
import {Link, useNavigate} from "react-router-dom";

function NewGame() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const createNewAccount = useAccountsStore(useCallback((state) => state.createNewAccount, []))
  const getFactions = useAccountsStore(useCallback((state) => state.getFactions, []))
  const factions = useAccountsStore(useCallback((state) => state.factions, []))
  const [form, setForm] = useState({ symbol: "", faction: "" });

  useEffect(() => {
    getFactions()
  }, [])

  if(!factions.length) {
    return <div data-testid="loading">Loading...</div>
  }

  const selectFaction = (symbol: string) => {
    setForm({
      ...form, faction: symbol
    })
  }

  const createAccount = async () => {
    const {error} = await createNewAccount({symbol: form.symbol,
      faction: form.faction})
    if(!error) {
      navigate("/agent");
    } else {
      setError(error);
    }

  }

  const submitDisabled = !form.symbol || !form.faction;

  return (<div className={'container-fluid'}>

    <h2 data-testid="agentHeading">Agent Call Sign</h2>
    <input data-testid="agentInput" name="symbol" value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.currentTarget.value })} />

    <FactionSelector factions={factions} onSelect={selectFaction} />

    {error && <p data-testid="newGameError" className={'error'}>{error}</p>}

    <button disabled={submitDisabled} onClick={createAccount} className={'marginRight'} data-testid="createAgentButton"> Submit Agent Details </button>
    <Link to={'/'}><button>Cancel </button></Link>

  </div>)
}

export default NewGame;