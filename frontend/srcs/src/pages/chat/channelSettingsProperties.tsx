import { useState } from 'react';

// import Button from '../../components/utilities/Button';
import axios from 'axios';
import { ChannelRelationshipType } from '../../models/channel/ChannelRelationship';
import CreateChannelDto from '../../models/channel/CreateChannel.dto';
import { useForm } from 'react-hook-form';
import { ChannelMode } from '../../models/channel/Channel';
import ChannelSettingsForm from '../../components/Forms/channelSettingsForm';
import CustomButton from '../../components/utilities/CustomButton';


interface ChannelProps {
    id: number;
    name: string;
    mode: ChannelMode;
    destroyChannel: (id: number) => void;
    isChannelSettings?: boolean;
    myRole: ChannelRelationshipType;
}

interface ChannelStates {
    showDestroyValidation: boolean;
    channel_id: number;
    myRole: ChannelRelationshipType
}



interface IUpdateChannelFormValues {
    channelName: string;
    mode: ChannelMode;
    password?: string;
    passwordConfirmation?: string;
}

function ChannelSettingsProperties(props: ChannelProps) {

    const [showUpdateValidation, setShowUpdateValidation] = useState(false)

    const [adminChannelElementInfo, setAdminChannelElementInfo] = useState<ChannelStates>({
        showDestroyValidation: false,
        channel_id: props.id,
        myRole: props.myRole
    });


    const {
        // register,
        // handleSubmit,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<IUpdateChannelFormValues>();

    const onSubmit = async (values: CreateChannelDto) => {
        setShowUpdateValidation(false);
        clearErrors();
        if (Number(values.mode) === ChannelMode.protected &&
            values.password !== values.passwordConfirmation) {
            setError(
                "passwordConfirmation",
                { message: "The password does not match." },
                { shouldFocus: true }
            );
            return;
        }
        console.log("values1", values)
        console.log("props.mode", props.mode)
        if (values.mode === null) {
            values.mode = Number(props.mode);
        } else {
            values.mode = Number(values.mode);
        }
        console.log("values", values)
        try {
            // const data = await axios.patch(`/api/channels/${props.id}`, values);
            const data = await axios.patch(`/api/channels/${props.id}`, {
                mode: values.mode,
                password: values.password
            }
                );
            console.log(data);
            setShowUpdateValidation(true);
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 402) {
                    const details = error.response.data as {
                        statusCode: number;
                        message: string;
                    };
                    setError(
                        "password",
                        { message: details.message },
                        { shouldFocus: true }
                    );
                }
            }
        }
    };

    const displayDestroyButton = (adminChannelElementInfo: ChannelStates, setAdminChannelElementInfo: any) => {
        const localChangeDestroyValidationButtonState = () => {
            changeDestroyValidationButtonState(adminChannelElementInfo, setAdminChannelElementInfo)
        }

        if (!adminChannelElementInfo.showDestroyValidation && props.myRole & ChannelRelationshipType.Owner) {
            return (
                <div className="relative flex justify-center w-full h-8">
                    <button
                        className="justify-center w-auto px-2 text-lg font-semibold text-gray-900 rounded-md bg-unset focus:outline-none focus:ring-2 focus:ring-gray-500 whitespace-nowrap"
                        onClick={localChangeDestroyValidationButtonState}
                    >
                        Destroy channel
                </button>
                </div>
            );
        }
    }

    const changeDestroyValidationButtonState = (adminChannelElementInfo: ChannelStates, setAdminChannelElementInfo: any) => {
        setAdminChannelElementInfo({
            ...adminChannelElementInfo,
            showDestroyValidation: !adminChannelElementInfo.showDestroyValidation
        });
    };

    const displayDestroyValidationButton = (props: ChannelProps, adminChannelElementInfo: ChannelStates, setAdminChannelElementInfo: any) => {
        const localChangeDestroyValidationButtonState = () => {
            changeDestroyValidationButtonState(adminChannelElementInfo, setAdminChannelElementInfo)
        }
        if (adminChannelElementInfo.showDestroyValidation && props.myRole & ChannelRelationshipType.Owner) {
            return (
                <div className="relative items-center w-full h-8 text-center">
                    <CustomButton
                        content="Confirm destruction?"
                        // url="/users/block"
                        onClickFunctionId={props.destroyChannel}
                        argId={props.id}
                        bg_color="bg-unset"
                        // bg_hover_color="bg-secondary-dark"
                        dark_text
                        text_size="text-lg"
                    />
                    <CustomButton
                        content="No"
                        // url="/users/block"
                        onClickFunctionId={localChangeDestroyValidationButtonState}
                        argId={props.id}
                        bg_color="bg-secondary"
                        // bg_hover_color="bg-secondary-dark"
                        dark_text
                        text_size="text-lg"
                    />
                </div>
            );
        }
    }

    return (
        <div className="mt-8">
            <h2 className="text-3xl font-bold text-center">
                Channel Properties
            </h2>
            <div className="justify-center block w-full my-8">
                {displayDestroyButton(adminChannelElementInfo, setAdminChannelElementInfo)}
                {displayDestroyValidationButton(props, adminChannelElementInfo, setAdminChannelElementInfo)}
            </div>
            <ChannelSettingsForm
                onSubmit={onSubmit}
                errors={errors}
                showUpdateValidation={showUpdateValidation}
                mode={props.mode}
            />
        </div>
    );
}


export default ChannelSettingsProperties;
