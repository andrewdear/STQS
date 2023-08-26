import {create} from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'
import {doRequest, getAllPaginatedData} from "../utils/requests";

type CommonTraits = {
    description: string,
    name: string,
    symbol: string
}

type Trait = CommonTraits;

type Faction = CommonTraits & {
    headquarters: string,
    isRecruiting: boolean
    traits: Trait[]
}

type AccountRequest = {
    agent: any,
    contract: any,
    faction: Faction,
    ship: any,
    token: string
}

type Account = {
    name: string,
    token: string,
    accountDetails?: AccountRequest
}

interface AccountsStoreType {
    accounts: Account[],
    currentAccount: Account | null
    createNewAccount: (accountData: { symbol: string, faction: string }) => void
    getFactions: () => void;
    factions: Faction[];
}

export const useAccountsStore = create<AccountsStoreType, [["zustand/persist", unknown]]>(
    // Persist uses localstorage to save this information so that it will be retained
    persist(
        (set, get) => ({
            accounts: [],
            currentAccount: null,
            factions: [],
            createNewAccount: async ({symbol, faction}) => {
                const {ok, data} = await doRequest<AccountRequest>("https://api.spacetraders.io/v2/register", {
                    method: 'POST',
                    body: {
                        symbol,
                        faction,
                    }
                })
                //TODO: will need to show error messages
                if (ok) {
                    const typedData = data as AccountRequest;
                    const existingAccounts = get().accounts;
                    const newAgent = {name: symbol, token: typedData.token}

                    set({
                        accounts: [...existingAccounts, newAgent],
                        currentAccount: {...newAgent, accountDetails: typedData},
                    })
                }
            },
            getFactions: async () => {
                // const currentFactions = get().factions;
                // if(currentFactions.length) {
                //     return
                // }

                // Docs say you need a token for this, it seems you do not, may change in future, hopefully not seems like the kind of endpoint you should not need one
                const {data: factions} = await getAllPaginatedData<Faction>('https://api.spacetraders.io/v2/factions');

                set({
                    factions
                })
            }
        }),
        {
            name: 'account-storage', // unique name
            storage: createJSONStorage(() => sessionStorage), // Could change to local storage to allow saves to live past a session
        }
    )
)