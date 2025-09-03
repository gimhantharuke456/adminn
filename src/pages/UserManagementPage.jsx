import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Card,
  Row,
  Col,
  Typography,
  Popconfirm,
  message,
  Input,
} from "antd";
import {
  DeleteOutlined,
  DownloadOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import userService from "../services/userService";

const { Title } = Typography;

const UserManagementPage = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchText, users]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getAllUsers();
      if (response.status) {
        setUsers(response.data);
      } else {
        messageApi.error(response.message || "Failed to load users");
      }
    } catch (error) {
      messageApi.error(error.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchText) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
          user.officerSVC?.toLowerCase().includes(searchText.toLowerCase()) ||
          user.officerRank?.toLowerCase().includes(searchText.toLowerCase()) ||
          user.policeStation
            ?.toLowerCase()
            .includes(searchText.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
          user.phone?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await userService.deleteUser(id);
      if (response.success) {
        messageApi.success("User deleted successfully");
        loadUsers();
      } else {
        messageApi.error(response.message || "Failed to delete user");
      }
    } catch (error) {
      messageApi.error(error.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRowKeys.length === 0) {
      messageApi.warning("Please select users to delete");
      return;
    }
    setLoading(true);
    try {
      const response = await userService.bulkDeleteUsers(selectedRowKeys);
      if (response.success) {
        messageApi.success(
          `${response.deletedCount} users deleted successfully`
        );
        loadUsers();
        setSelectedRowKeys([]);
      } else {
        messageApi.error(response.message || "Failed to delete users");
      }
    } catch (error) {
      messageApi.error(error.message || "Failed to delete users");
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("User Management Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
    doc.text(`Total Records: ${filteredUsers.length}`, 20, 45);

    const tableData = filteredUsers.map((user) => [
      user.fullName || "N/A",
      user.officerSVC || "N/A",
      user.officerRank || "N/A",
      user.policeStation || "N/A",
      user.email || "N/A",
      user.phone || "N/A",
      new Date(user.createdAt).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [
        [
          "Full Name",
          "SVC Number",
          "Rank",
          "Police Station",
          "Email",
          "Phone",
          "Created Date",
        ],
      ],
      body: tableData,
      startY: 55,
    });

    doc.save("user-management-report.pdf");
    messageApi.success("Report generated successfully");
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => (a.fullName || "").localeCompare(b.fullName || ""),
      render: (text) => text || "N/A",
    },
    {
      title: "SVC Number",
      dataIndex: "officerSVC",
      key: "officerSVC",
      sorter: (a, b) => (a.officerSVC || "").localeCompare(b.officerSVC || ""),
      render: (text) => text || "N/A",
    },
    {
      title: "Rank",
      dataIndex: "officerRank",
      key: "officerRank",
      render: (text) => text || "N/A",
    },
    {
      title: "Police Station",
      dataIndex: "policeStation",
      key: "policeStation",
      render: (text) => text || "N/A",
    },

    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}
      <Card>
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 16 }}
        >
          <Col>
            <Title level={2}>User Management</Title>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={loadUsers}
                loading={loading}
              >
                Refresh
              </Button>
              <Button icon={<DownloadOutlined />} onClick={generatePDF}>
                Export PDF
              </Button>
            </Space>
          </Col>
        </Row>

        <Row style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Input
              placeholder="Search by Name, SVC, Rank, Station, Email, or Phone"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={16} style={{ textAlign: "right" }}>
            {selectedRowKeys.length > 0 && (
              <Popconfirm
                title={`Are you sure you want to delete ${selectedRowKeys.length} selected users?`}
                onConfirm={handleBulkDelete}
                okText="Yes"
                cancelText="No"
              >
                <Button danger>
                  Delete Selected ({selectedRowKeys.length})
                </Button>
              </Popconfirm>
            )}
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="_id"
          loading={loading}
          rowSelection={rowSelection}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      </Card>
    </div>
  );
};

export default UserManagementPage;
