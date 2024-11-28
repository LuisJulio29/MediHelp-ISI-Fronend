import React from "react";
import { Modal, Form, Input, message } from "antd";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showloading, hideloading } from "../redux/alertsSlice";

function AddUserModal({ visible, onCancel, onAddUser }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const handleAddUser = async (values) => {
    try {
      dispatch(showloading());
      const response = await axios.post("api/user/register", values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideloading());
      if (response.data.success) {
        message.success(response.data.message);
        onAddUser();
        form.resetFields();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideloading());
      message.error("Error al registrar el usuario");
      console.log(error);
    }
  };

  return (
    <Modal
      title="Agregar Usuario"
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Registrar"
      cancelText="Cancelar"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleAddUser}
        initialValues={{
          name: "",
          code: "",
          email: "",
          password: "",
        }}
      >
        <Form.Item
          label="Nombre"
          name="name"
          rules={[{ required: true, message: "Por favor ingresa el nombre" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Código"
          name="code"
          rules={[{ required: true, message: "Por favor ingresa el código único" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Correo Electrónico"
          name="email"
          rules={[
            { required: true, message: "Por favor ingresa el email" },
            { type: "email", message: "El email no es válido" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Contraseña"
          name="password"
          rules={[{ required: true, message: "Por favor ingresa la contraseña" }]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddUserModal;
