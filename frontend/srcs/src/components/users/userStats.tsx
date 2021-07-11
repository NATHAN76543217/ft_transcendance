type UserProps = {
  nbWin: number;
  nbLoss: number;
};

function getWinRate(nbWin: number, nbLoss: number) {
  if (nbLoss > 0) {
    return Math.round((100 * nbWin) / (nbWin + nbLoss)) + "%";
  } else {
    if (nbWin > 0) {
      return "100%";
    } else {
      return "No game played yet";
    }
  }
}

function UserStats(user: UserProps) {
  return (
    <section className="w-auto px-4 py-4 mx-4 my-4 bg-gray-100 h-52">
      <div>
        <h1 className="text-3xl font-bold text-center">Stats</h1>
        <section className="relative flex justify-center pt-4 whitespace-pre">
          <div className="flex-1 px-8 text-center">
            <h2 className="text-xl font-bold">
              <i className="text-green-600 fill-current fas fa-check"></i> Win
            </h2>
            <div className="text-xl font-medium">{user.nbWin}</div>
          </div>

          <div className="flex-1 px-8 text-center">
            <h2 className="text-xl font-bold">
              <i className="text-red-600 fill-current fas fa-times"></i> Loss
            </h2>
            <div className="text-xl font-medium">{user.nbLoss}</div>
          </div>
        </section>

        <section className="relative flex justify-center pt-4 text-center">
          <h2 className="text-lg font-bold">
            Win rate: {getWinRate(user.nbWin, user.nbLoss)}
          </h2>
        </section>
      </div>
    </section>
  );
}

export default UserStats;
