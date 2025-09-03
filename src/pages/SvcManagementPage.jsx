import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Space,
  Card,
  Row,
  Col,
  Typography,
  Popconfirm,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  DownloadOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import svcService from "../services/svcManagementService";

const { Title } = Typography;
const { Option } = Select;

const SvcManagementPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [bulkForm] = Form.useForm();

  const [svcs, setSvcs] = useState([]);
  const [filteredSvcs, setFilteredSvcs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [bulkModalVisible, setBulkModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState("");

  const policeStations = [
    "Colombo Central",
    "Kandy Central",
    "Galle Central",
    "Matara Central",
    "Kurunegala Central",
    "Anuradhapura Central",
    "Ratnapura Central",
    "Badulla Central",
  ];

  const ranks = [
    "Constable",
    "Sergeant",
    "Sub Inspector",
    "Inspector",
    "Chief Inspector",
    "Superintendent",
    "Assistant Superintendent",
    "Deputy Inspector General",
    "Inspector General",
  ];

  useEffect(() => {
    loadSvcs();
  }, []);

  useEffect(() => {
    filterSvcs();
  }, [searchText, svcs]);

  const loadSvcs = async () => {
    setLoading(true);
    try {
      const response = await svcService.getAllSvc();
      if (response.success) {
        setSvcs(response.data);
      } else {
        messageApi.error(response.message || "Failed to load SVCs");
      }
    } catch (error) {
      messageApi.error(error.message || "Failed to load SVCs");
    } finally {
      setLoading(false);
    }
  };

  const filterSvcs = () => {
    if (!searchText) {
      setFilteredSvcs(svcs);
    } else {
      const filtered = svcs.filter(
        (svc) =>
          svc.officerSVC.toLowerCase().includes(searchText.toLowerCase()) ||
          svc.officerRank?.toLowerCase().includes(searchText.toLowerCase()) ||
          svc.policeStation?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredSvcs(filtered);
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingId(record._id);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (editingId) {
        const response = await svcService.updateSvc(editingId, values);
        if (response.success) {
          messageApi.success("SVC updated successfully");
          loadSvcs();
          setModalVisible(false);
        } else {
          messageApi.error(response.message || "Failed to update SVC");
        }
      } else {
        const response = await svcService.addSvc(values);
        if (response.success) {
          messageApi.success("SVC added successfully");
          loadSvcs();
          setModalVisible(false);
        } else {
          messageApi.error(response.message || "Failed to add SVC");
        }
      }
    } catch (error) {
      messageApi.error(error.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await svcService.deleteSvc(id);
      if (response.success) {
        messageApi.success("SVC deleted successfully");
        loadSvcs();
      } else {
        messageApi.error(response.message || "Failed to delete SVC");
      }
    } catch (error) {
      messageApi.error(error.message || "Failed to delete SVC");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRowKeys.length === 0) {
      messageApi.warning("Please select SVCs to delete");
      return;
    }
    setLoading(true);
    try {
      const response = await svcService.bulkDeleteSvc(selectedRowKeys);
      if (response.success) {
        messageApi.success(
          `${response.deletedCount} SVCs deleted successfully`
        );
        loadSvcs();
        setSelectedRowKeys([]);
      } else {
        messageApi.error(response.message || "Failed to delete SVCs");
      }
    } catch (error) {
      messageApi.error(error.message || "Failed to delete SVCs");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    setLoading(true);
    try {
      const response = await svcService.toggleSvcStatus(id);
      if (response.success) {
        const status = response.data.isActive ? "activated" : "deactivated";
        messageApi.success(`SVC ${status} successfully`);
        loadSvcs();
      } else {
        messageApi.error(response.message || "Failed to toggle status");
      }
    } catch (error) {
      messageApi.error(error.message || "Failed to toggle status");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAdd = async (values) => {
    setLoading(true);
    try {
      const response = await svcService.bulkAddSvc({ svcs: values.svcs });
      if (response.success) {
        messageApi.success(
          `${response.results.successful} SVCs added successfully`
        );
        if (response.results.failed > 0) {
          messageApi.warning(`${response.results.failed} SVCs failed to add`);
        }
        loadSvcs();
        setBulkModalVisible(false);
        bulkForm.resetFields();
      } else {
        messageApi.error(response.message || "Failed to add SVCs");
      }
    } catch (error) {
      messageApi.error(error.message || "Failed to add SVCs");
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("SVC Management Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
    doc.text(`Total Records: ${filteredSvcs.length}`, 20, 45);

    const tableData = filteredSvcs.map((svc) => [
      svc.officerSVC,
      svc.officerRank || "N/A",
      svc.policeStation || "N/A",
      svc.isActive ? "Active" : "Inactive",
      new Date(svc.createdAt).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [
        ["SVC Number", "Rank", "Police Station", "Status", "Created Date"],
      ],
      body: tableData,
      startY: 55,
    });

    doc.save("svc-management-report.pdf");
    messageApi.success("Report generated successfully");
  };

  const columns = [
    {
      title: "SVC Number",
      dataIndex: "officerSVC",
      key: "officerSVC",
      sorter: (a, b) => a.officerSVC.localeCompare(b.officerSVC),
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
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          onChange={() => handleToggleStatus(record._id)}
          loading={loading}
        />
      ),
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
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Popconfirm
            title="Are you sure you want to delete this SVC?"
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
            <Title level={2}>SVC Management</Title>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={loadSvcs}
                loading={loading}
              >
                Refresh
              </Button>
              <Button icon={<DownloadOutlined />} onClick={generatePDF}>
                Export PDF
              </Button>
              <Button
                icon={<UploadOutlined />}
                onClick={() => setBulkModalVisible(true)}
              >
                Bulk Add
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                Add SVC
              </Button>
            </Space>
          </Col>
        </Row>

        <Row style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Input
              placeholder="Search by SVC, Rank, or Police Station"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={16} style={{ textAlign: "right" }}>
            {selectedRowKeys.length > 0 && (
              <Popconfirm
                title={`Are you sure you want to delete ${selectedRowKeys.length} selected SVCs?`}
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
          dataSource={filteredSvcs}
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

      <Modal
        title={editingId ? "Edit SVC" : "Add SVC"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="officerSVC"
            label="SVC Number"
            rules={[
              { required: true, message: "Please enter SVC number" },
              {
                pattern: /^SVC\d{3,6}$/,
                message: 'SVC must start with "SVC" followed by 3-6 digits',
              },
            ]}
          >
            <Input placeholder="e.g., SVC12345" />
          </Form.Item>

          <Form.Item
            name="officerRank"
            label="Officer Rank"
            rules={[{ required: true, message: "Please select officer rank" }]}
          >
            <Select placeholder="Select rank">
              {ranks.map((rank) => (
                <Option key={rank} value={rank}>
                  {rank}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="policeStation"
            label="Police Station"
            rules={[
              { required: true, message: "Please select police station" },
            ]}
          >
            <Select placeholder="Select police station">
              {policeStations.map((station) => (
                <Option key={station} value={station}>
                  {station}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingId ? "Update" : "Add"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Bulk Add SVCs"
        open={bulkModalVisible}
        onCancel={() => setBulkModalVisible(false)}
        footer={null}
        destroyOnClose
        width={800}
      >
        <Form form={bulkForm} layout="vertical" onFinish={handleBulkAdd}>
          <Form.List name="svcs">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} size="small" style={{ marginBottom: 16 }}>
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "officerSVC"]}
                          label="SVC Number"
                          rules={[
                            { required: true, message: "Required" },
                            {
                              pattern: /^SVC\d{3,6}$/,
                              message: "Invalid format",
                            },
                          ]}
                        >
                          <Input placeholder="SVC12345" />
                        </Form.Item>
                      </Col>
                      <Col span={7}>
                        <Form.Item
                          {...restField}
                          name={[name, "officerRank"]}
                          label="Rank"
                          rules={[{ required: true, message: "Required" }]}
                        >
                          <Select placeholder="Select">
                            {ranks.map((rank) => (
                              <Option key={rank} value={rank}>
                                {rank}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={7}>
                        <Form.Item
                          {...restField}
                          name={[name, "policeStation"]}
                          label="Station"
                          rules={[{ required: true, message: "Required" }]}
                        >
                          <Select placeholder="Select">
                            {policeStations.map((station) => (
                              <Option key={station} value={station}>
                                {station}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Form.Item label=" ">
                          <Button
                            type="text"
                            danger
                            onClick={() => remove(name)}
                            icon={<DeleteOutlined />}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add SVC Entry
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setBulkModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Add All SVCs
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SvcManagementPage;
