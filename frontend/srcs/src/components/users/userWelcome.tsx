type UserProps = {
  name: string;
  isMe: boolean;
  imgPath: string;
};

function UserWelcome(user: UserProps) {
  if (user.isMe && user.imgPath === 'default-profile-picture.png') {
    return (
      <section className="relative grid justify-center w-auto h-auto">
        <p className="px-4 py-4 mx-4 mt-4 text-lg rounded-lg md:px-8 bg-secondary">
        <span className="font-bold">Welcome {user.name}!</span>
          <br/>
          Here is your <span className="font-bold">profile page</span>.
          <br/>
          You can see your <span className="font-bold">stats</span> and <span className="font-bold">match history</span>.
          <br/>
          You can also <span className="font-bold">change </span>
          your <span className="font-bold">profile picture</span> or <span className="font-bold">username</span>.
        </p>
      </section>
    );
  } else {
    return (
      <div></div>
    )
  }
}

export default UserWelcome;
