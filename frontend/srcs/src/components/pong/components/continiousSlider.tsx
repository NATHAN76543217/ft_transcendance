import React from "react"

import Slider from '@material-ui/core/Slider'
import Typography from '@material-ui/core/Typography'
import {
    makeStyles
} from '@material-ui/core/styles';
// https://material-ui.com/es/components/slider/
// npm install @material-ui/core

type IContiniousSlyderProps = {
    name : string;
    stateShared : {
        value : number,
        setValue : React.Dispatch<React.SetStateAction<number>>;
    };
    disabled? : true;
}

export default function ContinousSlider({
    name,
    stateShared,
    disabled
} : IContiniousSlyderProps)
{
    const classes = makeStyles({
        root: {
            width: 200,
        },
    })();

    const [description, setDescription] = React.useState<string>(`${name}: ${stateShared.value}`);

    React.useEffect(() => {
        setDescription(`${name}, ${stateShared.value}`);
    }, [stateShared.value]);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number | number[]) => {
        stateShared.setValue(newValue as number);
    };

    return (
        <div className={classes.root}>
            <Typography id="continuous-slider" gutterBottom>
                {description}
            </Typography>
            <Slider
                {...disabled}
                value={stateShared.value}
                onChange={handleChange}
                aria-labelledby="continuous-slider"
            />
        </div>
    );
}
