import React from "react";
import { Form, Input, Button } from "antd";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      const response = await axios.post("api/user/register", values);
      if (response.data.success) {
        toast.success(response.data.message);
        toast.success("Redirigiendo al Login");
        navigate("/login");
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
        <h2 className="text-center mb-4">Register</h2>
        <Form
          name="register"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Introduzca su Nombre" }]}
          >
            <Input size="large" placeholder="Nombre" />
          </Form.Item>
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
            rules={[{ required: true, message: "Introduzca su Contraseña" }]}
          >
            <Input.Password size="large" placeholder="Contraseña" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              Register
            </Button>
          </Form.Item>
        </Form>
        <div className="text-center mt-3">
          ¿Ya tienes una cuenta? <br />
          <a href="/login" className="text-primary">
            {" "}
            Ingrese{" "}
          </a>
        </div>
      </div>
    </div>
  );
}

export default Register;
