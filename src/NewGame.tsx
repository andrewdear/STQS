import {useCallback, useState, useEffect} from "react"
import {useAccountsStore} from "./stores/accounts-store.ts";

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
  const [form, setForm] = useState({ symbol: "", faction: "COSMIC" });

  useEffect(() => {
    getFactions()
  }, [])

  return (<>
    <h1>New Game</h1>
    <input name="symbol" value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.currentTarget.value })} />
    <input name="faction" value={form.faction} onChange={(e) => setForm({ ...form, faction: e.currentTarget.value })} />
    <input type="submit" onClick={async () => {
      createNewAccount({symbol: form.symbol,
          faction: form.faction})
    }} />

    <pre>CurrentAccount: {JSON.stringify(currentAccount, null, 2)}</pre>
  </>)
}

export default NewGame