import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Space, Tag, Alert, Spin, message, Row, Col, Divider, List, Typography } from 'antd';
import { ArrowLeftOutlined, EditOutlined, ExclamationCircleOutlined, BookOutlined, BranchesOutlined } from '@ant-design/icons';
import MainLayout from '../../layout/main/MainLayout.jsx';
import { prerequisiteCourseService } from '../../../services/prerequisiteCourseService.js';

const { Title, Text } = Typography;

export default function PrerequisiteCourseDetails() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [courseDetails, setCourseDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourseDetails();
    }, [courseId]);

    const fetchCourseDetails = async () => {
        try {
            setLoading(true);
            const response = await prerequisiteCourseService.getCoursePrerequisiteDetails(courseId);
            setCourseDetails(response.data.result);
        } catch (error) {
            console.error('Error fetching course details:', error);
            message.error('Không thể tải thông tin chi tiết môn học tiên quyết');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/admin/academic/prerequisite-courses');
    };

    const handleEdit = () => {
        navigate(`/admin/academic/prerequisite-courses/edit/${courseId}`);
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
                    <Alert message="Không tìm thấy môn học" type="error" />
                </div>
            </MainLayout>
        );
    }

    const { course, prerequisites, requiredByOthers, circularDependencyWarnings } = courseDetails;

    return (
        <MainLayout>
            <div style={{ padding: '24px' }}>
                {/* Header */}
                <Card style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Space>
                            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
                                Quay lại danh sách
                            </Button>
                            <Title level={3} style={{ margin: 0 }}>
                                {course.courseCode} - {course.courseName}
                            </Title>
                        </Space>
                        <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
                            Quản lý môn tiên quyết
                        </Button>
                    </div>
                </Card>

                {/* Course Information */}
                <Card title="Thông tin môn học" style={{ marginBottom: '24px' }}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={8}>
                            <Text strong>Mã môn học:</Text>
                            <br />
                            <Text>{course.courseCode}</Text>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Text strong>Tên môn học:</Text>
                            <br />
                            <Text>{course.courseName}</Text>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Text strong>Khoa:</Text>
                            <br />
                            <Tag color="blue">{course.departmentName}</Tag>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Text strong>Tín chỉ (Lý thuyết):</Text>
                            <br />
                            <Text>{course.creditsTheory || 0}</Text>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Text strong>Tín chỉ (Thực hành):</Text>
                            <br />
                            <Text>{course.creditsPractical || 0}</Text>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Text strong>Loại môn học:</Text>
                            <br />
                            <Tag color="purple">{course.courseType || 'Không xác định'}</Tag>
                        </Col>
                    </Row>
                </Card>

                {/* Warnings */}
                {circularDependencyWarnings && circularDependencyWarnings.length > 0 && (
                    <Alert
                        message="Phát hiện phụ thuộc vòng tròn"
                        description={
                            <div>
                                <p>Môn học này có vấn đề phụ thuộc vòng tròn:</p>
                                <ul>
                                    {circularDependencyWarnings.map((warning, index) => (
                                        <li key={index}>{warning}</li>
                                    ))}
                                </ul>
                            </div>
                        }
                        type="warning"
                        showIcon
                        icon={<ExclamationCircleOutlined />}
                        style={{ marginBottom: '24px' }}
                    />
                )}

                <Row gutter={[16, 16]}>
                    {/* Prerequisites */}
                    <Col xs={24} lg={12}>
                        <Card
                            title={
                                <Space>
                                    <BranchesOutlined />
                                    Môn tiên quyết ({prerequisites.length})
                                </Space>
                            }
                            style={{ height: '100%' }}
                        >
                            {prerequisites.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                    <Text>Môn học này không có môn tiên quyết</Text>
                                </div>
                            ) : (
                                <List
                                    dataSource={prerequisites}
                                    renderItem={(prerequisite) => (
                                        <List.Item>
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

                    {/* Required by Others */}
                    <Col xs={24} lg={12}>
                        <Card
                            title={
                                <Space>
                                    <BookOutlined />
                                    Được yêu cầu bởi ({requiredByOthers.length})
                                </Space>
                            }
                            style={{ height: '100%' }}
                        >
                            {requiredByOthers.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                    <Text>Môn học này không được yêu cầu bởi môn học nào khác</Text>
                                </div>
                            ) : (
                                <List
                                    dataSource={requiredByOthers}
                                    renderItem={(course) => (
                                        <List.Item>
                                            <List.Item.Meta
                                                title={
                                                    <Space>
                                                        <Text strong>{course.courseCode}</Text>
                                                        <Tag color="orange">{course.departmentName}</Tag>
                                                    </Space>
                                                }
                                                description={
                                                    <Space direction="vertical" size="small">
                                                        <Text>{course.courseName}</Text>
                                                        <Text type="secondary">
                                                            {course.totalCredits} tín chỉ
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

                {/* Summary Statistics */}
                <Card title="Tóm tắt" style={{ marginTop: '24px' }}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={8}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                                    {prerequisites.length}
                                </div>
                                <div style={{ color: '#666' }}>Môn tiên quyết</div>
                            </div>
                        </Col>
                        <Col xs={24} sm={8}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa8c16' }}>
                                    {requiredByOthers.length}
                                </div>
                                <div style={{ color: '#666' }}>Được yêu cầu bởi</div>
                            </div>
                        </Col>
                        <Col xs={24} sm={8}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    color: circularDependencyWarnings.length > 0 ? '#f5222d' : '#52c41a'
                                }}>
                                    {circularDependencyWarnings.length}
                                </div>
                                <div style={{ color: '#666' }}>Cảnh báo</div>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </div>
        </MainLayout>
    );
}