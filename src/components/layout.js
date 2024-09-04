import React from "react";
import { Layout, Menu, Avatar, Badge } from "antd";
import { useNavigate } from "react-router-dom";
import {
  UserOutlined,
  BellOutlined,
  HomeOutlined,
  LogoutOutlined,
  FileAddOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";

const { Header, Sider, Content } = Layout;

function CustomLayout({ children }) {
  const navigate = useNavigate();
  const {user}=useSelector(state=>state.user)

  const menuItems = [
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
    {
      key: "3",
      icon: <FileAddOutlined />,
      label: "Apply Doctor",
      path: "/apply-Doctor",
    },
    {
      key: "4",
      icon: <LogoutOutlined />,
      label: "Logout",
      path: "/logout",
    },
  ];

  // Manejar clic en el elemento del menú
  const handleMenuClick = ({ key }) => {
    const selectedItem = menuItems.find(item => item.key === key);
    if (selectedItem && selectedItem.path) {
      navigate(selectedItem.path); // Navegar a la ruta específica
    }
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
          items={menuItems}
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
            <Avatar size="large" icon={<UserOutlined />} />
            <span className="ms-2 me-4">{user?.name} </span>
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
