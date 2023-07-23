import { useSession } from "../../custom-hooks/use-session";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * make a component private
 * @param {React.Component} Component the component to make private
 */
export default function privateRoute(Component) {
  //return private component
  return function (props) {
    const [user, _] = useSession("auth", null);
    const navigate = useNavigate();

    useEffect(() => {
      if (!user) {
        navigate("/", { replace: true });
      }
    }, [user]);

    return user ? <Component {...props} /> : <></>;
  };
}
