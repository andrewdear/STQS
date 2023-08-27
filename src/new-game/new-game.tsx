import {useCallback, useState, useEffect} from "react"
import {useAccountsStore} from "../stores/accounts-store.ts";
import FactionSelector from "./faction-selector.tsx";

/**
 * This component is a basic MVP of part one of the quickstart. It handles registering your agent and receives a token
 * which you will need to use in subsequent calls. Therefore, you might want to refactor or replace this as you move forward.
 */

function NewGame() {
  // const [token, setToken] = useState();
  const createNewAccount = useAccountsStore(useCallback((state) => state.createNewAccount, []))
  const currentAccount = useAccountsStore(useCallback((state) => state.currentAccount, []))
  const getFactions = useAccountsStore(useCallback((state) => state.getFactions, []))
  const factions = useAccountsStore(useCallback((state) => state.factions, []))
  const [form, setForm] = useState({ symbol: "", faction: "" });

  useEffect(() => {
    getFactions()
  }, [])

  const selectFaction = (symbol: string) => {
    console.log(form);
    setForm({
      ...form, faction: symbol
    })
  }

  const createAccount = async () => {
    createNewAccount({symbol: form.symbol,
      faction: form.faction})
  }

  const submitDisabled = !form.symbol || !form.faction;

  return (<div className={'container-fluid'}>

    <h2>Agent Call Sign</h2>
    <input name="symbol" value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.currentTarget.value })} />

    <FactionSelector factions={factions} onSelect={selectFaction} />

    <button disabled={submitDisabled} onClick={createAccount} > Submit Agent Details </button>

  </div>)
}

export default NewGame;