
import { useForm } from "react-hook-form";
import ChannelInviteDto from "../../models/channel/ChannelInvite.dto";

type ChannelInviteProps = {
  onSubmit: (values: ChannelInviteDto) => void; // define function type
};

export default function ChannelInviteForm(props: ChannelInviteProps) {
  //const [username, password] = useState();

  const { register, handleSubmit } = useForm<ChannelInviteDto>();

  return (
    <div className="flex items-center h-full max-w-sm px-4 border-gray-400 lg:border-r-2 lg:border-l-2">
      <form onSubmit={handleSubmit(props.onSubmit)} className="flex w-auto h-6">
        <input
          id="username"
          type="text"
          placeholder="Enter a username..."
          className="pl-2 mr-2 bg-gray-100 rounded-sm"
          {...register("username")}
        />
        <button
          className=""
        >
          <i className="fa fa-user-plus " />
        </button>

        {/* {
                <div>
                  <div className="relative">
                    <input
                      type={true ? "text" : "password"}
                      // value={password}
                      placeholder="Enter password..."
                      onChange={e => {}}
                      className="flex justify-center h-auto px-2 py-1 mx-2 my-2 text-sm font-semibold bg-gray-200 rounded-sm w-36 text-md focus:bg-gray-300 focus:ring-2 focus:ring-gray-600 focus:outline-none"
                    />
                    {/* {displayShowPasswordButton(showPassword, setShowPassword)} */}
        {/* </div> */}
        {/* {displayWrongPassword(showWrongPassword)} */}
        {/* </div> */}
      </form>


    </div>
  );
}
