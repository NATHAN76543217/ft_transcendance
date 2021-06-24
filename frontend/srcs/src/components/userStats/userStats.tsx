import React from 'react';

type UserProps = {
    nbWin: number,
    nbLoss: number
}

function UserStats(user: UserProps) {
    return (
        <section className="w-auto px-4 py-4 mx-4 my-4 bg-gray-100 h-52">
            <div>
            <h1 className="text-3xl font-bold text-center">
                Stats
            </h1>
            <section className="relative flex justify-center pt-4 whitespace-pre">
                <div className="flex-1 px-8 text-center">
                    <h2 className="text-xl font-bold">
                        <i className="text-green-600 fill-current fas fa-check"></i>   Win
                    </h2>
                    <div className="text-xl font-medium">
                        {user.nbWin}
                    </div>
                </div>

                <div className="flex-1 px-8 text-center">
                    <h2 className="text-xl font-bold">
                        <i className="text-red-600 fill-current fas fa-times"></i>   Loss
                    </h2>
                    <div className="text-xl font-medium">
                        {user.nbLoss}
                    </div>
                </div>
            </section>

            <section className="relative flex justify-center pt-4 text-center">
                <h2 className="text-lg font-bold">
                    Win rate: {100 * user.nbWin / (user.nbWin + user.nbLoss)}%
                    </h2>
            </section>
            </div>
        </section>
    );
}

export default UserStats;