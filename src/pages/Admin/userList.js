import React, { useEffect, useState } from "react";
import CustomLayout from "../../components/Layout";
import { useDispatch } from "react-redux";
import { showloading, hideloading } from "../../redux/alertsSlice";
import axios from "axios";
import { Table, Button } from "antd";
import AddUserModal from "../../components/AddUserModal";

function UserList() {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch();

  const getUsersData = async () => {
    try {
      dispatch(showloading());
      const response = await axios.get("/api/admin/get-all-users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideloading());
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      dispatch(hideloading());
      console.log(error);
    }
  };

  useEffect(() => {
    getUsersData();
  }, []);

  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      width: 120,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: "Creado en",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (text) => new Date(text).toLocaleDateString(),
      width: 100,
    },
  ];

  return (
    <CustomLayout>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="mb-0">Lista de Usuarios</h1>
          <Button
            type="primary"
            onClick={() => setIsModalVisible(true)}
            className="ml-auto"
          >
            Agregar Usuario
          </Button>
        </div>

        {/* Ajustar la tabla para ser responsive */}
        <div className="table-responsive">
          <Table
            dataSource={users}
            columns={columns}
            rowKey="_id"
            bordered
            pagination={{ pageSize: 10 }}
            scroll={{ x: "max-content" }} // Hacer que la tabla sea desplazable horizontalmente en pantallas pequeñas
            className="shadow-sm"
          />
        </div>
      </div>

      {/* Modal para agregar usuario */}
      <AddUserModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onAddUser={() => {
          setIsModalVisible(false);
          getUsersData(); // Actualiza la lista de usuarios después de agregar uno nuevo
        }}
      />
    </CustomLayout>
  );
}

export default UserList;
