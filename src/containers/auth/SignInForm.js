import React, { useState } from "react";
import { useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthForm from "../../components/auth/AuthForm";
import AuthContext from "../../context/AuthContext";
import client from "../../libs/api/_client";

function SignInForm() {
  const history = useHistory();

  const { setAuthInfo } = useContext(AuthContext);

  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const onClickSubmit = async (e) => {
    e.preventDefault();
    try {
      // ex client.grup ,
      const response = await client.post("/auth/signin", {
        email: form.email,
        password: form.password,
      });
      console.log(response);

      if (response.status === 200) {
        const accessToken = response.data.accessToken;
        localStorage.setItem("accessToken", accessToken);
        // 헤더에 key=authorization을 보내는것
        client.defaults.headers.common["Authorization"] = `${accessToken}`;
        // 엑세스 토큰 받은것 바탕으로 진행

        const result = await client.get("/auth/profile");
        setAuthInfo({ isLoggedIn: true, userInfo: result.data.data });
        history.push("/");
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) {
        setError("이메일 / 비밀번호를 확인해 주시기 바랍니다.");
      }
    }
  };

  return (
    <AuthForm
      type="login"
      onClickSubmit={onClickSubmit}
      form={form}
      onChangeInput={onChangeInput}
      error={error}
    />
  );
}

export default SignInForm;
