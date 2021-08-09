type LoadingProps = {
  hideText?: boolean
} 

function Loading(props: LoadingProps) {
  return (
    <div className="z-50 flex flex-col items-center w-full h-auto ">
      <i className="mb-2 text-secondary-dark fas fa-circle-notch fa-spin fa-3x"></i>
      {props.hideText ? <div/> : <h2 className="text-xl font-semibold text-center text-secondary-dark">
        Loading...
      </h2>}
    </div>
  );
}

export default Loading;
