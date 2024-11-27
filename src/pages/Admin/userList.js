import React, { useEffect, useState, useMemo, useCallback } from "react";
import CustomLayout from "../../components/Layout";
import { useDispatch } from "react-redux";
import { showloading, hideloading } from "../../redux/alertsSlice";
import axios from "axios";
import { Table, Button, Popconfirm, message, Input } from "antd";
import AddUserModal from "../../components/AddUserModal";

// Custom hook for fetching and managing users
const useUsers = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();

  const fetchUsers = useCallback(async (searchTerm = "") => {
    try {
      dispatch(showloading());
      
      const response = await axios.get("/api/admin/get-all-users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        const filteredUsers = response.data.data.filter((user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setUsers(filteredUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("No se pudieron cargar los usuarios");
    } finally {
      dispatch(hideloading());
    }
  }, [dispatch]);

  const deleteUser = useCallback(async (userId) => {
    try {
      dispatch(showloading());
      const response = await axios.delete(`/api/admin/delete-user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        message.success(response.data.message);
        await fetchUsers(); // Refresh users after deletion
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("Error al eliminar el usuario");
      console.error(error);
    } finally {
      dispatch(hideloading());
    }
  }, [fetchUsers, dispatch]);

  return { users, fetchUsers, deleteUser };
};

function UserList() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { users, fetchUsers, deleteUser } = useUsers();

  useEffect(() => {
    fetchUsers(searchTerm);
  }, [searchTerm, fetchUsers]);

  const columns = useMemo(() => [
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
    {
      title: "Acciones",
      key: "actions",
      render: (record) => (
        <Popconfirm
          title="¿Estás seguro de eliminar este usuario?"
          onConfirm={() => deleteUser(record._id)}
          okText="Sí"
          cancelText="No"
        >
          <Button danger type='primary'>Eliminar</Button>
        </Popconfirm>
      ),
      width: 100,
    },
  ], [deleteUser]);

  return (
    <CustomLayout>
      <div className="container mt-4">
        <h1 className="d-flex justify-content-center mb-4">Lista de Usuarios</h1>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Input
            placeholder="Buscar doctor por nombre"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: "600px", width: "100%" }}
          />
          <Button
            type="primary"
            onClick={() => setIsModalVisible(true)}
            className="ml-auto"
          >
            Agregar Usuario
          </Button>
        </div>
        <div className="table-responsive">
          <Table
            dataSource={users}
            columns={columns}
            rowKey="_id"
            bordered
            pagination={{ pageSize: 10 }}
            scroll={{ x: "max-content" }}
            className="shadow-sm"
          />
        </div>
      </div>

      <AddUserModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onAddUser={() => {
          setIsModalVisible(false);
          fetchUsers(); // Refresh users after adding
        }}
      />
    </CustomLayout>
  );
}

export default UserList;