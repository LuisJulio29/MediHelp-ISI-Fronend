import React from "react";
import { Layout, Menu, Avatar, Badge } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  UserOutlined,
  BellOutlined,
  HomeOutlined,
  CalendarOutlined,
  LogoutOutlined,
  MedicineBoxOutlined,
  UsergroupAddOutlined,
  UserAddOutlined,
  CarryOutOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";

const { Header, Sider, Content } = Layout;

function CustomLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation(); // Para obtener la ruta actual
  const { user } = useSelector((state) => state.user);

  const userMenu = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "Home",
      path: "/",
    },
    {
      key:"/calendar",
      icon:<CalendarOutlined />,
      label:"Calendar",
      path:"/calendar"
    },
    {
      key: "/appointments",
      icon: <CarryOutOutlined />,
      label: "Appointments",
      path: "/appointments",
    },
    
    /*{
      key: "/apply-doctor",
      icon: <UserAddOutlined />,
      label: "Apply Doctor",
      path: "/apply-doctor",
    }*/,
  ];
  const doctorMenu = [
    {
      key: "/Home",
      icon: <HomeOutlined />,
      label: "Home",
      path: "/doctor/Home",
    },
    {
      key: "/appointments",
      icon: <CalendarOutlined />,
      label: "Appointments",
      path: "/doctor/appointments",
    }, 
  ];

  const adminMenu = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "Home",
      path: "/",
    },
    {
      key: "/users",
      icon: <UsergroupAddOutlined />,
      label: "Users",
      path: "/users",
    },
    {
      key: "/doctors",
      icon: <MedicineBoxOutlined />,
      label: "Doctors",
      path: "/doctors",
    },
  ];

  const commonMenu = [
    ...user?.isAdmin ? adminMenu : user?.isDoctor ? doctorMenu : userMenu, 
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      localStorage.clear(); // Eliminar token del localStorage
      navigate("/login"); // Redirigir al login
      window.location.reload();
    } else {
      const selectedItem = commonMenu.find((item) => item.key === key);
      if (selectedItem && selectedItem.path) {
        navigate(selectedItem.path); // Navegar a la ruta específica
      }
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
          selectedKeys={[location.pathname]} // Marcar el ítem según la ruta actual
          items={commonMenu}
          onClick={handleMenuClick}
        />
      </Sider>

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <Header className="bg-white p-0">
          <div className="d-flex justify-content-end align-items-center p-2">
            <div onClick={()=>navigate("/notifications")} style={{cursor:"pointer"}}>
              <Badge count={user?.unseenNotifications.length} >
                <BellOutlined style={{ fontSize: "22px"}} />
              </Badge>
            </div>
            <div
              onClick={() => navigate(`/doctor/profile/${user?._id}`)}
              style={{ cursor: "pointer", display: "flex", alignItems: "center" ,marginLeft: "30px"}}
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
