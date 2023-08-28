import {beforeEach, describe, expect, it, vi} from "vitest";
import {fireEvent, render, screen} from "@testing-library/react";
import NewGame from "./new-game";
import {useAccountsStore} from "../stores/accounts-store.ts";

vi.mock("react-router-dom", () => ({
    useNavigate: vi.fn(() => () => {return null}),
    Link: (props: any) => <div>{props.children}</div>
}));

const createNewAccountMock = vi.fn(() => ({error: false}));
const getFactionsMock = vi.fn();

vi.mock("../stores/accounts-store.ts");

vi.mock("../stores/accounts-store.ts", () => ({
    useAccountsStore: vi.fn((passedFunction: any) => {
        const data = {
            createNewAccount: createNewAccountMock,
            getFactions: getFactionsMock,
            factions: [
                {
                    name: 'test',
                    symbol: 'TEST',
                    isRecruiting: true,
                    traits: [{name: 'testTrait', description: 'testTraitDescription', symbol: 'TRAIT'}]}
            ],
        }

        return passedFunction(data);
    })
}));

describe('new-game', () => {

    beforeEach(() => {
        vi.restoreAllMocks();
    });


    it("renders", async () => {
        const {unmount} = render(<NewGame />);

        const node = await screen.findByTestId("agentHeading");

        expect(node).toHaveTextContent("Agent Call Sign");

        unmount()
    })

    it("should call getFactions when the page is first rendered", async () => {
        const {unmount} = render(<NewGame />);

        expect(getFactionsMock).toHaveBeenCalledOnce();

        unmount()
    })

    it('should call create account with the expected values when values have been set', async () => {
        const {unmount} = render(<NewGame />);

        // Click on a faction option
        const node = await screen.findByTestId("factionOption0");
        node.click();

        // input an agent name
        const inputNode = await screen.findByTestId("agentInput");
        fireEvent.change(inputNode, {target: {value: 'TestAgent'}})

        const submitButton = await screen.findByTestId("createAgentButton");
        submitButton.click()

        expect(createNewAccountMock).toHaveBeenCalledWith({faction: 'TEST', symbol: 'TestAgent'})

        //Check that the error has not occurred
        const errorNode = await screen.queryByTestId("newGameError");
        expect(errorNode).not.toBeInTheDocument()

        unmount()
    })

    it('should show an error if an error is returned', async () => {
        const createNewAccountFailureMock = vi.fn(() => ({error: 'error test'}));

        vi.mocked(useAccountsStore).mockImplementation(vi.fn((passedFunction: any) => {
            const data = {
                createNewAccount: createNewAccountFailureMock,
                getFactions: getFactionsMock,
                factions: [
                    {
                        name: 'test',
                        symbol: 'TEST',
                        isRecruiting: true,
                        traits: [{name: 'testTrait', description: 'testTraitDescription', symbol: 'TRAIT'}]}
                ],
            }

            return passedFunction(data);
        }))

        const {unmount} = render(<NewGame />);

        // Click on a faction option
        const node = await screen.findByTestId("factionOption0");
        node.click();

        // input an agent name
        const inputNode = await screen.findByTestId("agentInput");
        fireEvent.change(inputNode, {target: {value: 'TestAgent'}})

        const submitButton = await screen.findByTestId("createAgentButton");
        submitButton.click()

        expect(createNewAccountFailureMock).toHaveBeenCalledWith({faction: 'TEST', symbol: 'TestAgent'})

        // find the error message and check it's what was returned
        const errorNode = await screen.findByTestId("newGameError");

        expect(errorNode).toHaveTextContent('error test');

        unmount()
    })

    it('should show loading if there are no factions', async () => {
        vi.mocked(useAccountsStore).mockImplementation(vi.fn((passedFunction: any) => {
            const data = {
                createNewAccount: createNewAccountMock,
                getFactions: getFactionsMock,
                factions: [],
            }

            return passedFunction(data);
        }))

        const {unmount} = render(<NewGame />);

        // find the error message and check it's what was returned
        const loadingNode = await screen.findByTestId("loading");

        expect(loadingNode).toHaveTextContent('Loading...');

        unmount()
    })
})
