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
    stateShared : {
        value : number,
        setValue : React.Dispatch<React.SetStateAction<number>>;
    };
    disabled? : true;
}

export type IContiniousSlyderContext = {
    value : number;
    setValue : React.Dispatch<React.SetStateAction<number>>;
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
    });

    const [description, setDescription] = React.useState<string>(`${name}: ${stateShared.value}`);

    React.useEffect(() => {
        setDescription(`${name}, ${stateShared.value}`);
    }, [stateShared.value]);

    const handleChange : Function = (event: any, newValue: number | number[]) => {
        stateShared.setValue(newValue as number);
    };

    return (
        <div className={classes.root}>

        {/* Element slidered name */}
        <Typography id="continuous-slider" gutterBottom>
            {description}
        </Typography>

        {/* Slider that changes the value of the propertie */}
        <Slider {...disabled} value={stateShared.value} onChange={handleChange} aria-labelledby="continuous-slider"/>

        </div>
    );
}

// TO DO: Remember that this should be inlined in tsx code like this:
// <ContinousSlider name="" defaultValue="" disabled=true />

// TO DO: Button has a disabled field too !
