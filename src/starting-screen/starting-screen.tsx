import {Link} from "react-router-dom";

const StartingScreen = () => {
    return <div className={'container-fluid'}>
        <Link to={'/new-game'}><button>New Game</button></Link>
    </div>
}

export default StartingScreen;