import React from "react";
import { useState } from "react";
import { useContext } from "react";
import NavbarComponent from "../../components/common/NavbarComponent";
import AuthContext from "../../context/AuthContext";
import { useHistory } from "react-router-dom";

function NavbarContainer() {
  const history = useHistory();

  const { authInfo, setAuthInfo } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);

  const onClickProfileImg = () => {
    setVisible(!visible);
  };

  const onClickSignOut = () => {
    localStorage.removeItem("accessToken");
    setAuthInfo({ isLoggedIn: false });
    history.push("/");
  };
  console.log(authInfo);
  return (
    <NavbarComponent
      onClickProfileImg={onClickProfileImg}
      visible={visible}
      authInfo={authInfo}
      onClickSignOut={onClickSignOut}
    />
  );
}

export default NavbarContainer;
