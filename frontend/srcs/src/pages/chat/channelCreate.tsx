import React, { useState } from 'react';

// import Button from '../../components/utilities/Button';
import axios from 'axios';
import ChannelInformation from '../../components/chat/ChatInformation';
import AppContext from '../../AppContext';
import { ChannelRelationshipType } from '../../models/channel/ChannelRelationship';
import ChannelCreateForm from '../../components/Forms/channelCreateForm';
import CreateChannelDto from '../../models/channel/CreateChannel.dto';
import JoinChannelDto from '../../models/channel/JoinChannel.dto';
import { useForm } from 'react-hook-form';
import { ChannelMode } from '../../models/channel/Channel';


interface ChannelProps {
}

interface ChannelStates {

}



interface ICreateChannelFormValues {
    channelName: string;
    mode: ChannelMode;
    password?: string;
}

function ChannelCreate() {

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<ICreateChannelFormValues>();

    const onSubmit = async (values: CreateChannelDto) => {
        try {
            const data = await axios.post("/api/channels", values);
            console.log(data);
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 409) {
                    const details = error.response.data as {
                        statusCode: number;
                        message: string;
                    };
                    clearErrors();
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
                    clearErrors();
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
                    clearErrors();
                    setError(
                        "mode",
                        { message: details.message },
                        { shouldFocus: true }
                    );
                }
                else {
                    const details = error.response?.data as {
                        statusCode: number;
                        message: string;
                    };
                    clearErrors();
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
            />
        </div>
    );
}


export default ChannelCreate;
