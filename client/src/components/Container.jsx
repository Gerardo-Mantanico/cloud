import { Spinner } from "./Spinner";

export const SmallContainer = ({ children, className, loading = false }) => {
  return loading ? (
    <Spinner />
  ) : (
    <div className={`container-sm ${className ? className : ""}`}>
      {children}
    </div>
  );
};


export const FluidContainer = ({ children, className }) => (
  <div className={`container-fluid ${className ? className : ""}`}>
    {children}
  </div>
);
