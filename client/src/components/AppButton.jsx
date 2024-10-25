import { Button } from "reactstrap";

export const AppButton = (props) => {
  return (
    <Button color="primary" className="m-1" {...props}>
      {props.children}
    </Button>
  );
};

export const AppButtonSecondary = (props) => {
  return (
    <Button color="secondary" className="m-1" {...props}>
      {props.children}
    </Button>
  );
};

export const AppButtonDanger = (props) => {
  return (
    <Button color="danger" className="m-1" {...props}>
      {props.children}
    </Button>
  );
};

export const AppButtonDark = (props) => {
  return (
    <Button color="dark" className="m-1" {...props}>
      {props.children}
    </Button>
  );
};

export const AppButtonLink = (props) => {
  return (
    <Button color="link" {...props}>
      {props.children}
    </Button>
  );
};
