import React from "react";
import { Form, Input, Button, Checkbox } from "antd";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      const response = await axios.post("api/user/login", values);
      if (response.data.success) {
        toast.success(response.data.message);
        toast.success("Redirigiendo al home");
        localStorage.setItem("token", response.data.data);
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
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
