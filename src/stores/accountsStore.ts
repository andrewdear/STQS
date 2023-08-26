import {create} from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'

type Account = {
    name: string,
    token: string,
    accountDetails?: any,
}

interface AccountsStoreType {
    accounts: Account[],
    currentAccount: Account | null
    createNewAccount: (accountData: {symbol: string, faction: string}) => void
}

export const useAccountsStore = create<AccountsStoreType, [["zustand/persist", unknown]]>(
    // Persist uses localstorage to save this information so that it will be retained
    persist(
        (set, get) => ({
            accounts: [],
            currentAccount: null,
            // factions: [],
            createNewAccount: async ({symbol, faction}) => {
                const resp = await fetch("https://api.spacetraders.io/v2/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        symbol: symbol,
                        faction: faction,
                    }),
                });

                const json = await resp.json();
                //TODO: will need to show error messages
                if (resp.ok) {
                    const existingAccounts = get().accounts;
                    const newAgent = {name: symbol, token: json.data.token}

                    set({
                        accounts: [...existingAccounts, newAgent],
                        currentAccount: {...newAgent, accountDetails: json.data},
                    })
                }
            }
        }),
        {
            name: 'account-storage', // unique name
            storage: createJSONStorage(() => sessionStorage), // Change to localStorage when finished with development
        }
    )
)
