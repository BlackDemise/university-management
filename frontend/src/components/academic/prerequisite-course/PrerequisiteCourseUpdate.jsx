import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Space, Tag, Alert, Spin, message, Row, Col, Select, List, Typography, Modal, Transfer } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, PlusOutlined, MinusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import MainLayout from '../../layout/main/MainLayout.jsx';
import { prerequisiteCourseService } from '../../../services/prerequisiteCourseService.js';

const { Title, Text } = Typography;
const { Option } = Select;

export default function PrerequisiteCourseUpdate() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [courseDetails, setCourseDetails] = useState(null);
    const [availableOptions, setAvailableOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedPrerequisites, setSelectedPrerequisites] = useState([]);
    const [originalPrerequisites, setOriginalPrerequisites] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newPrerequisiteId, setNewPrerequisiteId] = useState(null);

    useEffect(() => {
        fetchData();
    }, [courseId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [detailsResponse, optionsResponse] = await Promise.all([
                prerequisiteCourseService.getCoursePrerequisiteDetails(courseId),
                prerequisiteCourseService.getAvailablePrerequisiteOptions(courseId)
            ]);

            const details = detailsResponse.data.result;
            const options = optionsResponse.data.result;

            setCourseDetails(details);
            setAvailableOptions(options);

            const currentPrerequisites = details.prerequisites.map(p => p.courseId);
            setSelectedPrerequisites(currentPrerequisites);
            setOriginalPrerequisites(currentPrerequisites);
        } catch (error) {
            console.error('Error fetching data:', error);
            message.error('Không thể tải dữ liệu học phần');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate(`/admin/academic/prerequisite-courses/details/${courseId}`);
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            // Determine what to add and remove
            const prerequisiteIdsToAdd = selectedPrerequisites.filter(id => !originalPrerequisites.includes(id));
            const prerequisiteIdsToRemove = originalPrerequisites.filter(id => !selectedPrerequisites.includes(id));

            if (prerequisiteIdsToAdd.length === 0 && prerequisiteIdsToRemove.length === 0) {
                message.info('Không có thay đổi nào để lưu');
                return;
            }

            const updateData = {
                courseId: parseInt(courseId),
                prerequisiteIdsToAdd,
                prerequisiteIdsToRemove
            };

            await prerequisiteCourseService.updateCoursePrerequisites(courseId, updateData);

            message.success('Cập nhật học phần tiên quyết thành công');
            navigate(`/admin/academic/prerequisite-courses/details/${courseId}`);
        } catch (error) {
            console.error('Error saving prerequisites:', error);
            message.error('Không thể cập nhật học phần tiên quyết');
        } finally {
            setSaving(false);
        }
    };

    const handleAddPrerequisite = async () => {
        if (!newPrerequisiteId) {
            message.warning('Vui lòng chọn học phần tiên quyết để thêm');
            return;
        }

        try {
            // Validate the addition
            const validationResponse = await prerequisiteCourseService.validatePrerequisiteAddition(
                courseId,
                newPrerequisiteId
            );

            if (!validationResponse.data.result) {
                message.error('Không thể thêm học phần tiên quyết này. Có thể tạo ra phụ thuộc vòng tròn hoặc đã tồn tại.');
                return;
            }

            // Add to selected prerequisites
            setSelectedPrerequisites([...selectedPrerequisites, newPrerequisiteId]);
            setNewPrerequisiteId(null);
            setShowAddModal(false);

            // Remove from available options
            setAvailableOptions(availableOptions.filter(option => option.courseId !== newPrerequisiteId));
        } catch (error) {
            console.error('Error adding prerequisite:', error);
            message.error('Không thể thêm học phần tiên quyết');
        }
    };

    const handleRemovePrerequisite = (prerequisiteId) => {
        Modal.confirm({
            title: 'Xóa học phần tiên quyết',
            content: 'Bạn có chắc chắn muốn xóa học phần tiên quyết này?',
            okText: 'Có',
            cancelText: 'Không',
            onOk: () => {
                setSelectedPrerequisites(selectedPrerequisites.filter(id => id !== prerequisiteId));

                // Add back to available options if it was removed
                const removedPrerequisite = courseDetails.prerequisites.find(p => p.courseId === prerequisiteId);
                if (removedPrerequisite) {
                    const newOption = {
                        courseId: removedPrerequisite.courseId,
                        courseCode: removedPrerequisite.courseCode,
                        courseName: removedPrerequisite.courseName,
                        departmentName: removedPrerequisite.departmentName,
                        totalCredits: removedPrerequisite.totalCredits
                    };
                    setAvailableOptions([...availableOptions, newOption]);
                }
            }
        });
    };

    const hasChanges = () => {
        return JSON.stringify(selectedPrerequisites.sort()) !== JSON.stringify(originalPrerequisites.sort());
    };

    const getCurrentPrerequisites = () => {
        if (!courseDetails) return [];
        return courseDetails.prerequisites.filter(p => selectedPrerequisites.includes(p.courseId));
    };

    if (loading) {
        return (
            <MainLayout>
                <div style={{ padding: '24px', textAlign: 'center' }}>
                    <Spin size="large" />
                </div>
            </MainLayout>
        );
    }

    if (!courseDetails) {
        return (
            <MainLayout>
                <div style={{ padding: '24px' }}>
                    <Alert message="Không tìm thấy học phần" type="error" />
                </div>
            </MainLayout>
        );
    }

    const { course, circularDependencyWarnings } = courseDetails;

    return (
        <MainLayout>
            <div style={{ padding: '24px' }}>
                {/* Header */}
                <Card style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Space>
                            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
                                Quay lại chi tiết
                            </Button>
                            <Title level={3} style={{ margin: 0 }}>
                                Quản lý học phần tiên quyết: {course.courseCode}
                            </Title>
                        </Space>
                        <Space>
                            <Button
                                type="primary"
                                icon={<SaveOutlined />}
                                onClick={handleSave}
                                disabled={!hasChanges()}
                                loading={saving}
                            >
                                Lưu thay đổi
                            </Button>
                        </Space>
                    </div>
                </Card>

                {/* Course Information */}
                <Card title="Thông tin học phần" style={{ marginBottom: '24px' }}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={8}>
                            <Text strong>Học phần:</Text>
                            <br />
                            <Text>{course.courseCode} - {course.courseName}</Text>
                        </Col>
                        <Col xs={24} md={8}>
                            <Text strong>Khoa:</Text>
                            <br />
                            <Tag color="blue">{course.departmentName}</Tag>
                        </Col>
                        <Col xs={24} md={8}>
                            <Text strong>Tổng số tín chỉ:</Text>
                            <br />
                            <Text>{(course.creditsTheory || 0) + (course.creditsPractical || 0)}</Text>
                        </Col>
                    </Row>
                </Card>

                {/* Warnings */}
                {circularDependencyWarnings && circularDependencyWarnings.length > 0 && (
                    <Alert
                        message="Phát hiện phụ thuộc vòng tròn"
                        description={
                            <div>
                                <p>Cảnh báo: Học phần này có vấn đề phụ thuộc vòng tròn:</p>
                                <ul>
                                    {circularDependencyWarnings.map((warning, index) => (
                                        <li key={index}>{warning}</li>
                                    ))}
                                </ul>
                            </div>
                        }
                        type="warning"
                        showIcon
                        style={{ marginBottom: '24px' }}
                    />
                )}

                {/* Changes Summary */}
                {hasChanges() && (
                    <Alert
                        message="Có thay đổi chưa lưu"
                        description="Bạn có những thay đổi chưa được lưu. Đừng quên lưu trước khi rời khỏi trang này."
                        type="info"
                        showIcon
                        style={{ marginBottom: '24px' }}
                    />
                )}

                <Row gutter={[16, 16]}>
                    {/* Current Prerequisites */}
                    <Col xs={24} lg={12}>
                        <Card
                            title="Học phần tiên quyết hiện tại"
                            extra={
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => setShowAddModal(true)}
                                    disabled={availableOptions.length === 0}
                                >
                                    Thêm học phần tiên quyết
                                </Button>
                            }
                        >
                            {getCurrentPrerequisites().length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                    <Text>Không có học phần tiên quyết nào được chọn</Text>
                                </div>
                            ) : (
                                <List
                                    dataSource={getCurrentPrerequisites()}
                                    renderItem={(prerequisite) => (
                                        <List.Item
                                            actions={[
                                                <Button
                                                    type="text"
                                                    danger
                                                    icon={<MinusOutlined />}
                                                    onClick={() => handleRemovePrerequisite(prerequisite.courseId)}
                                                >
                                                    Xóa
                                                </Button>
                                            ]}
                                        >
                                            <List.Item.Meta
                                                title={
                                                    <Space>
                                                        <Text strong>{prerequisite.courseCode}</Text>
                                                        <Tag color="blue">{prerequisite.departmentName}</Tag>
                                                    </Space>
                                                }
                                                description={
                                                    <Space direction="vertical" size="small">
                                                        <Text>{prerequisite.courseName}</Text>
                                                        <Text type="secondary">
                                                            {prerequisite.totalCredits} tín chỉ
                                                        </Text>
                                                    </Space>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                            )}
                        </Card>
                    </Col>

                    {/* Available Prerequisites */}
                    <Col xs={24} lg={12}>
                        <Card title="Học phần tiên quyết khả dụng">
                            {availableOptions.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                    <Text>Không có học phần tiên quyết bổ sung nào khả dụng</Text>
                                </div>
                            ) : (
                                <List
                                    dataSource={availableOptions}
                                    renderItem={(option) => (
                                        <List.Item>
                                            <List.Item.Meta
                                                title={
                                                    <Space>
                                                        <Text strong>{option.courseCode}</Text>
                                                        <Tag color="green">{option.departmentName}</Tag>
                                                    </Space>
                                                }
                                                description={
                                                    <Space direction="vertical" size="small">
                                                        <Text>{option.courseName}</Text>
                                                        <Text type="secondary">
                                                            {option.totalCredits} tín chỉ
                                                        </Text>
                                                    </Space>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                            )}
                        </Card>
                    </Col>
                </Row>

                {/* Add Prerequisite Modal */}
                <Modal
                    title="Thêm học phần tiên quyết"
                    open={showAddModal}
                    onOk={handleAddPrerequisite}
                    onCancel={() => {
                        setShowAddModal(false);
                        setNewPrerequisiteId(null);
                    }}
                    okText="Thêm"
                    cancelText="Hủy"
                >
                    <div style={{ marginBottom: '16px' }}>
                        <Text>Chọn học phần tiên quyết để thêm:</Text>
                    </div>
                    <Select
                        value={newPrerequisiteId}
                        onChange={setNewPrerequisiteId}
                        style={{ width: '100%' }}
                        placeholder="Chọn học phần tiên quyết"
                    >
                        {availableOptions.map(option => (
                            <Option key={option.courseId} value={option.courseId}>
                                {option.courseCode} - {option.courseName} ({option.departmentName})
                            </Option>
                        ))}
                    </Select>
                </Modal>
            </div>
        </MainLayout>
    );
}