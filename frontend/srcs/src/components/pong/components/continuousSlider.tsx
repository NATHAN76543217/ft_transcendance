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
    value : number;
}

// TO DO: Correct this all over the code ...

// export default function ContinousSlider({ name , defaultValue, disabled } : IContiniousSlyderProps)
// {
//     const classes = makeStyles({
//         root: {
//             width: 200,
//         },
//     });

//     let value : number;
//     let setValue : React.Dispatch<React.SetStateAction<number>>;

//     [value, setValue] = React.useState<number>(defaultValue);

//     const handleChange : Function = (event: any, newValue: number | number[]) => {
//         setValue(newValue as number)
//     };

//     return (
//         <div className={classes.root}>

//         {/* Element slidered name */}
//         <Typography id="continuous-slider" gutterBottom>
//             {name}
//         </Typography>

//         {/* Slider that changes the value of the propertie */}
//         <Slider {...disabled} value={value} onChange={handleChange} aria-labelledby="continuous-slider"/>

//         </div>
//     );
// }

// TO DO: Remember that this should be inlined in tsx code like this:
// <ContinousSlider name="" defaultValue="" disabled=true />

// TO DO: Button has a disabled field too !

export default class ContinousSlider extends React.Component<IContiniousSlyderProps, IContiniousSlyderState>
{
    public state : IContiniousSlyderState;
    public setValue : React.Dispatch<React.SetStateAction<number>>;
    public classes = makeStyles({ // TO DO: Give a value to it
        root: {
            width: 200,
        },
    });

    constructor(
        props : Readonly<IContiniousSlyderProps>
    )
    {
        super(props);

        // TO DO: If i'm able to delete this, BETTER !
        this.state = {
            value: this.props.defaultValue
        };

        [this.state.value, this.setValue] = React.useState<number>(this.props.defaultValue);

        this.handleChange = this.handleChange.bind(this);
    }

    public handleChange(event: any, newValue: number | number[])
    { this.setValue(newValue as number); }

    // TO DO: THIS for onther module, got doc in my phone
    public handleChangev2()
    {
        this.setState(prevState => ({
            value: prevState.value
        }));
    }

    public render()
    {
        return (
            <div className={this.classes.root}>
    
            {/* Element slidered name */}
            <Typography id="continuous-slider" gutterBottom>
                {this.props.name}
            </Typography>
    
            {/* Slider that changes the value of the propertie */
            // TO DO: disabled field could be wrong ?
            }
            <Slider disabled={this.props.disabled} value={this.state.value} onChange={this.handleChange} aria-labelledby="continuous-slider"/>
    
            </div>
        );
    }
}