function FailedLogin() {
		return (
			<div className="my-8 text-center">
				<span className="w-full text-3xl font-bold">
					Your login attempt has failed.
				</span>
				<br/>
				<a  href="/"
					className="font-semibold text-md">
						Return to home page.
				</a>
			</div>
		);
}

export default FailedLogin;