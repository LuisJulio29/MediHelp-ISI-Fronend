import React from "react";
import { Layout, Menu, Avatar, Badge } from "antd";
import { useNavigate } from "react-router-dom";
import {
  UserOutlined,
  BellOutlined,
  HomeOutlined,
  CalendarOutlined,
  LogoutOutlined,
  MedicineBoxOutlined,
  UsergroupAddOutlined
} from "@ant-design/icons";
import { useSelector } from "react-redux";

const { Header, Sider, Content } = Layout;

function CustomLayout({ children }) {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const userMenu = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: "Home",
      path: "/",
    },
    {
      key: "2",
      icon: <CalendarOutlined />,
      label: "Appointments",
      path: "/appointments",
    },
  ];

  const adminMenu = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: "Home",
      path: "/",
    },
    {
      key: "2",
      icon: <UsergroupAddOutlined />,
      label: "Users",
      path: "/users",
    },
    {
      key: "3",
      icon: <MedicineBoxOutlined />,
      label: "Doctors",
      path: "/doctors",
    },
  ];

  // Añadir el logout como un ítem adicional al final del menú
  const commonMenu = [
    ...user?.isAdmin ? adminMenu : userMenu,
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
    },
  ];

  // Manejar clic en el elemento del menú
  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      localStorage.clear(); // Eliminar token del localStorage
      navigate("/login"); // Redirigir al login
    } else {
      const selectedItem = commonMenu.find((item) => item.key === key);
      if (selectedItem && selectedItem.path) {
        navigate(selectedItem.path); // Navegar a la ruta específica
      }
    }
  };

  // Manejar clic en el Avatar o nombre de usuario
  const handleProfileClick = () => {
    navigate("/profile"); // Navegar a la ruta del perfil
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider breakpoint="md" collapsedWidth="0">
        <div className="logo p-3">
          <h1 style={{ color: "white", textAlign: "center", margin: 0 }}>SH</h1>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={commonMenu}
          onClick={handleMenuClick} // Asignar el manejador de clics
        />
      </Sider>

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <Header className="bg-white p-0">
          <div className="d-flex justify-content-end align-items-center p-2">
            <Badge>
              <BellOutlined style={{ fontSize: "20px", marginRight: "30px" }} />
            </Badge>

            {/* Avatar y nombre de usuario clicables */}
            <div
              onClick={handleProfileClick} // Asignar manejador de clics
              style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              <Avatar size="medium" icon={<UserOutlined />} />
              <span className="ms-2 me-3">{user?.name}</span>
            </div>
          </div>
        </Header>

        {/* Content */}
        <Content style={{ margin: "24px 16px 0" }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default CustomLayout;
