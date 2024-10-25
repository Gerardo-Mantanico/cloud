import { Card, CardBody, CardTitle } from "reactstrap";
import classNames from "classnames";
import { useNavigate } from "react-router";

export const MenuCard = ({
  className,
  label = "",
  iconClass = "",
  to = "/",
}) => {
  const navigate = useNavigate();
  return (
    <Card
      className={classNames("menu-card", { [className]: !!className })}
      color="dark"
      inverse
      onClick={() => navigate(to)}
      role="button"
    >
      <CardBody>
        <CardTitle tag="h5">
          <i
            className={classNames("bi me-3", { [iconClass]: !![iconClass] })}
          />
          {label}
        </CardTitle>
      </CardBody>
    </Card>
  );
};
