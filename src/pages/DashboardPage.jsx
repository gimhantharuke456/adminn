import React, { useState } from "react";
import { Layout, Menu, Button, Avatar, Typography, Space } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import SvcManagementPage from "./SvcManagementPage";
import UserManagementPage from "./UserManagementPage";
import DashboardContent from "./DashboardContent";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const DashboardPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState("1");

  const handleLogout = () => {
    window.location.href = "/";
  };

  const menuItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "2",
      icon: <UserOutlined />,
      label: "User Management",
    },
    {
      key: "3",
      icon: <SettingOutlined />,
      label: "SVC Management",
    },
  ];

  const content = () => {
    switch (activeKey) {
      case "1":
        return <DashboardContent />;
      case "3":
        return <SvcManagementPage />;
      case "2":
        return <UserManagementPage />;
      default:
        return <div>Dashboard Content</div>;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          background: "#001529",
          boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid #1f1f1f",
            margin: "0 16px",
          }}
        >
          {!collapsed ? (
            <Text
              style={{ color: "white", fontSize: "18px", fontWeight: "bold" }}
            >
              Admin Panel
            </Text>
          ) : (
            <Avatar style={{ backgroundColor: "#1890ff" }}>A</Avatar>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activeKey]}
          items={menuItems}
          onClick={(e) => setActiveKey(e.key)}
          style={{
            border: "none",
            marginTop: "16px",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            padding: "16px",
            borderTop: "1px solid #1f1f1f",
          }}
        >
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{
              width: "100%",
              height: "40px",
              color: "#ff4d4f",
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
            }}
          >
            {!collapsed && "Logout"}
          </Button>
        </div>
      </Sider>

      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            zIndex: 1,
          }}
        >
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 40,
                height: 40,
              }}
            />
            <Text
              style={{ fontSize: "18px", fontWeight: "500", color: "#262626" }}
            >
              {menuItems.find((item) => item.key === activeKey)?.label ||
                "Dashboard"}
            </Text>
          </Space>

          <Space>
            <Avatar style={{ backgroundColor: "#1890ff" }}>
              <UserOutlined />
            </Avatar>
            <Text style={{ color: "#595959" }}>Admin User</Text>
          </Space>
        </Header>

        <Content
          style={{
            margin: "24px",
            padding: "24px",
            background: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            minHeight: "calc(100vh - 112px)",
          }}
        >
          {content()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardPage;
