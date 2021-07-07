import React from "react"

// Need to install this
import Slider from '@material-ui/core/Slider'
import Typography from '@material-ui/core/Typography'
import {
    makeStyles
} from '@material-ui/core/styles';
// https://material-ui.com/es/components/slider/

export default class ContinousSlider extends React.Component
{
    // TO DO: Perform this using tailwind
    public classes = makeStyles({
        root: {
            width: 200,
        },
    });
    private wrappedValue : number;
    private setValue : React.Dispatch<React.SetStateAction<number>>;

    constructor(
        public name : string,
        defaultValue : number,
        props : Readonly<{}>
    )
    {
        super(props);

        this.handleChange = this.handleChange.bind(this);

        [this.wrappedValue, this.setValue] = React.useState<number>(defaultValue);
    }

    get value() { return this.wrappedValue; }

    private handleChange(event: any, newValue: number | number[])
    { this.setValue(newValue as number);}

    public render()
    {
        return (
            <div className={this.classes.root}>

                {/* Element slidered name */}
                <Typography id="continuous-slider" gutterBottom>
                    {this.name}
                </Typography>

                {/* Slider that changes the value of the propertie */}
                <Slider value={this.value} onChange={this.handleChange} aria-labelledby="continuous-slider"/>

            </div>
        );
    }
}
