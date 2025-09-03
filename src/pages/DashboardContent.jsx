import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Typography,
  Table,
  Tag,
  Space,
  Spin,
  message,
  Progress,
  Avatar,
  List,
  Empty,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  DashboardOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import svcService from "../services/svcManagementService";
import userService from "../services/userService";

const { Title, Text } = Typography;

const DashboardContent = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalSvcs: 0,
    activeSvcs: 0,
    inactiveSvcs: 0,
    recentUsers: [],
    recentSvcs: [],
    usersByStation: [],
    svcsByRank: [],
    monthlyRegistrations: [],
  });

  const COLORS = ["#1890ff", "#52c41a", "#faad14", "#f5222d", "#722ed1"];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [usersResponse, svcsResponse] = await Promise.all([
        userService.getAllUsers(),
        svcService.getAllSvc(),
      ]);

      if (usersResponse.status && svcsResponse.success) {
        const users = usersResponse.data || [];
        const svcs = svcsResponse.data || [];

        // Calculate statistics
        const totalUsers = users.length;
        const totalSvcs = svcs.length;
        const activeSvcs = svcs.filter((svc) => svc.isActive).length;
        const inactiveSvcs = totalSvcs - activeSvcs;

        // Recent users (last 5)
        const recentUsers = users
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        // Recent SVCs (last 5)
        const recentSvcs = svcs
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        // Users by police station
        const stationCounts = users.reduce((acc, user) => {
          const station = user.policeStation || "Unknown";
          acc[station] = (acc[station] || 0) + 1;
          return acc;
        }, {});

        const usersByStation = Object.entries(stationCounts)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 8);

        // SVCs by rank
        const rankCounts = svcs.reduce((acc, svc) => {
          const rank = svc.officerRank || "Unknown";
          acc[rank] = (acc[rank] || 0) + 1;
          return acc;
        }, {});

        const svcsByRank = Object.entries(rankCounts)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);

        // Monthly registrations (last 6 months)
        const monthlyData = generateMonthlyData(users, svcs);

        setDashboardData({
          totalUsers,
          totalSvcs,
          activeSvcs,
          inactiveSvcs,
          recentUsers,
          recentSvcs,
          usersByStation,
          svcsByRank,
          monthlyRegistrations: monthlyData,
        });
      } else {
        messageApi.error("Failed to load dashboard data");
      }
    } catch (error) {
      messageApi.error(error.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const generateMonthlyData = (users, svcs) => {
    const months = [];
    const currentDate = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthName = date.toLocaleDateString("en-US", { month: "short" });
      const year = date.getFullYear();
      const monthYear = `${monthName} ${year}`;

      const usersCount = users.filter((user) => {
        const userDate = new Date(user.createdAt);
        return (
          userDate.getMonth() === date.getMonth() &&
          userDate.getFullYear() === date.getFullYear()
        );
      }).length;

      const svcsCount = svcs.filter((svc) => {
        const svcDate = new Date(svc.createdAt);
        return (
          svcDate.getMonth() === date.getMonth() &&
          svcDate.getFullYear() === date.getFullYear()
        );
      }).length;

      months.push({
        month: monthYear,
        users: usersCount,
        svcs: svcsCount,
      });
    }

    return months;
  };

  const recentUsersColumns = [
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (name) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          {name || "N/A"}
        </Space>
      ),
    },
    {
      title: "SVC",
      dataIndex: "officerSVC",
      key: "officerSVC",
      render: (svc) => svc || "N/A",
    },
    {
      title: "Station",
      dataIndex: "policeStation",
      key: "policeStation",
      render: (station) => station || "N/A",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  const recentSvcsColumns = [
    {
      title: "SVC Number",
      dataIndex: "officerSVC",
      key: "officerSVC",
    },
    {
      title: "Rank",
      dataIndex: "officerRank",
      key: "officerRank",
      render: (rank) => rank || "N/A",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag
          color={isActive ? "green" : "red"}
          icon={
            isActive ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />
          }
        >
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>Loading dashboard data...</Text>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}

      {/* Header */}
      <Row style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Title level={2}>
            <DashboardOutlined /> Dashboard Overview
          </Title>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={dashboardData.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total SVCs"
              value={dashboardData.totalSvcs}
              prefix={<SafetyOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active SVCs"
              value={dashboardData.activeSvcs}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Inactive SVCs"
              value={dashboardData.inactiveSvcs}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: "#f5222d" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Monthly Registrations */}
        <Col xs={24} lg={12}>
          <Card title="Monthly Registrations" style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData.monthlyRegistrations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#1890ff"
                  strokeWidth={2}
                  name="Users"
                />
                <Line
                  type="monotone"
                  dataKey="svcs"
                  stroke="#52c41a"
                  strokeWidth={2}
                  name="SVCs"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Users by Police Station */}
        <Col xs={24} lg={12}>
          <Card title="Users by Police Station" style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.usersByStation}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* SVCs by Rank Pie Chart */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="SVCs by Rank Distribution" style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.svcsByRank}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {dashboardData.svcsByRank.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* SVC Status Progress */}
        <Col xs={24} lg={12}>
          <Card title="SVC Status Overview" style={{ height: 400 }}>
            <div style={{ padding: "20px 0" }}>
              <div style={{ marginBottom: 20 }}>
                <Text strong>Active SVCs</Text>
                <Progress
                  percent={
                    dashboardData.totalSvcs
                      ? Math.round(
                          (dashboardData.activeSvcs / dashboardData.totalSvcs) *
                            100
                        )
                      : 0
                  }
                  status="active"
                  strokeColor="#52c41a"
                  format={(percent) =>
                    `${dashboardData.activeSvcs} (${percent}%)`
                  }
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <Text strong>Inactive SVCs</Text>
                <Progress
                  percent={
                    dashboardData.totalSvcs
                      ? Math.round(
                          (dashboardData.inactiveSvcs /
                            dashboardData.totalSvcs) *
                            100
                        )
                      : 0
                  }
                  status="exception"
                  strokeColor="#f5222d"
                  format={(percent) =>
                    `${dashboardData.inactiveSvcs} (${percent}%)`
                  }
                />
              </div>
              <div style={{ textAlign: "center", marginTop: 40 }}>
                <Statistic
                  title="Total SVCs"
                  value={dashboardData.totalSvcs}
                  prefix={<TrophyOutlined />}
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity Tables */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined />
                Recent Users
              </Space>
            }
          >
            {dashboardData.recentUsers.length > 0 ? (
              <Table
                columns={recentUsersColumns}
                dataSource={dashboardData.recentUsers}
                rowKey="_id"
                pagination={false}
                size="small"
              />
            ) : (
              <Empty description="No recent users" />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined />
                Recent SVCs
              </Space>
            }
          >
            {dashboardData.recentSvcs.length > 0 ? (
              <Table
                columns={recentSvcsColumns}
                dataSource={dashboardData.recentSvcs}
                rowKey="_id"
                pagination={false}
                size="small"
              />
            ) : (
              <Empty description="No recent SVCs" />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardContent;
