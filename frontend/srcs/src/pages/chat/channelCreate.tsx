import { useState } from 'react';

// import Button from '../../components/utilities/Button';
import axios from 'axios';
import ChannelCreateForm from '../../components/Forms/channelCreateForm';
import CreateChannelDto from '../../models/channel/CreateChannel.dto';
import { useForm } from 'react-hook-form';
import { ChannelMode } from '../../models/channel/Channel';


interface ICreateChannelFormValues {
    channelName: string;
    mode: ChannelMode;
    password?: string;
    passwordConfirmation?: string;
}

function ChannelCreate() {

    const [showCreationValidation, setShowCreationValidation] = useState(false)


    const {
        // register,
        // handleSubmit,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<ICreateChannelFormValues>();

    const onSubmit = async (values: CreateChannelDto) => {
        setShowCreationValidation(false);
        clearErrors();
        if (Number(values.mode) === (ChannelMode.protected) &&
            values.password !== values.passwordConfirmation) {
            setError(
                "passwordConfirmation",
                { message: "The password does not match." },
                { shouldFocus: true }
            );
            return ;
        }
        try {
            const data = await axios.post("/api/channels", values);
            console.log(data);
            setShowCreationValidation(true);
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 409) {
                    const details = error.response.data as {
                        statusCode: number;
                        message: string;
                    };
                    setError(
                        "channelName",
                        { message: details.message },
                        { shouldFocus: true }
                    );
                } else if (error.response?.status === 402) {
                    const details = error.response.data as {
                        statusCode: number;
                        message: string;
                    };
                    setError(
                        "password",
                        { message: details.message },
                        { shouldFocus: true }
                    );
                } else if (error.response?.status === 406) {
                    const details = error.response.data as {
                        statusCode: number;
                        message: string;
                    };
                    setError(
                        "mode",
                        { message: details.message },
                        { shouldFocus: true }
                    );
                }
                else {
                    // const details = error.response?.data as {
                    //     statusCode: number;
                    //     message: string;
                    // };
                    setError(
                        "channelName",
                        { message: 'Wrong channel name provided' },
                        { shouldFocus: true }
                    );
                }
            }
        }
    };


    return (
        <div className="">
            <ChannelCreateForm
                onSubmit={onSubmit}
                errors={errors}
                showCreationValidation={showCreationValidation}
            />
        </div>
    );
}


export default ChannelCreate;
