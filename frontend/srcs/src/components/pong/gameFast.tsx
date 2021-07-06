
// 2nd layer: User has clicked on "fast game"
// Just need to do something while the user is searching for a match

import React from "react"

export default class GameCustom extends React.Component
{
    constructor(
        props : Readonly<{}>
    )
    {
        super(props);
    }

    // I know i must do things here but not sure about what exactly
    render()
    {
        return(
            <div className="">
                <text>
                    In queue ...
                </text>
            </div>
        );
    }
}