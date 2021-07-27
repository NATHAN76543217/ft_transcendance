<<<<<<< HEAD
function Game() {
  return <div>game page</div>;
=======
import PongIndex, {
    PlayerRole
} from "../../components/pong/navigation/indexPong"

function Game(){

    // TO DO: Need the player id given as arg

    // TO DO: Role must be set properly
    const role = PlayerRole.HOST;

    // TO DO: roomId must be given only if user is invited or spectator

    return (
        <>
            <PongIndex playerId="42" role={role} roomId={undefined}/>
        </>
    );
>>>>>>> pong-reimplementation
}

export default Game;
