import React from "react";
import { Form, Input, Button, Checkbox } from "antd";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideloading, showloading } from "../redux/alertsSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      dispatch(showloading());
      const response = await axios.post("api/user/login", values);
      dispatch(hideloading());
  
      if (response.data.success) {
        const { token, isDoctor, name } = response.data.data;
        toast.success(
          isDoctor ? "Bienvenido Doctor" : `Bienvenido ${name || "Usuario"}`
        );
  
        localStorage.setItem("token", token);

        if (isDoctor) {
          navigate("/doctor/Home");
        } else {
          navigate("/");
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideloading());
      toast.error("Algo mal ha pasado :(");
    }
  };
  
  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div
        className="p-4 bg-light shadow rounded"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <h2 className="text-center mb-4">Login</h2>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Introduzca un Correo valido",
              },
            ]}
          >
            <Input size="large" placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Introduzca su Contraseña Correctamente",
              },
            ]}
          >
            <Input.Password size="large" placeholder="Contraseña" />
          </Form.Item>
          <Form.Item>
            <Checkbox>Recuerdame </Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              Log in
            </Button>
          </Form.Item>
        </Form>
        <div className="text-center mt-3">
          ¿No tienes una cuenta? <br />
          <a href="/Register" className="text-primary">
            Registrese
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
