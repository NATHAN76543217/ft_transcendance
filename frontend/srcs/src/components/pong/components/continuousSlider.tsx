import React from "react"

// Need to install this
import Slider from '@material-ui/core/Slider'
import Typography from '@material-ui/core/Typography'
import {
    makeStyles
} from '@material-ui/core/styles';
// https://material-ui.com/es/components/slider/

type IContiniousSlyderProps = {
    name : string;
    defaultValue: number;
    disabled? : true;
}

type IContiniousSlyderState = {

}

// TO DO: Correct this all over the code ...

export default function ContinousSlider({ name , defaultValue, disabled } : IContiniousSlyderProps)
{
    const classes = makeStyles({
        root: {
            width: 200,
        },
    });

    let value : number;
    let setValue : React.Dispatch<React.SetStateAction<number>>;

    [value, setValue] = React.useState<number>(defaultValue);

    const handleChange : Function = (event: any, newValue: number | number[]) => {
        setValue(newValue as number)
    };

    return (
        <div className={classes.root}>

        {/* Element slidered name */}
        <Typography id="continuous-slider" gutterBottom>
            {name}
        </Typography>

        {/* Slider that changes the value of the propertie */}
        <Slider {...disabled} value={value} onChange={handleChange} aria-labelledby="continuous-slider"/>

        </div>
    );
}