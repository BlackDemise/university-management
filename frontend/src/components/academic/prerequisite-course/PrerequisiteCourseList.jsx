import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Card, Space, Input, Select, Tag, Alert, Spin, message } from 'antd';
import { SearchOutlined, EyeOutlined, EditOutlined, ExclamationCircleOutlined, BookOutlined } from '@ant-design/icons';
import MainLayout from '../../layout/main/MainLayout.jsx';
import { prerequisiteCourseService } from '../../../services/prerequisiteCourseService.js';

const { Option } = Select;

export default function PrerequisiteCourseList() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        filterCourses();
    }, [courses, searchText, selectedDepartment, selectedStatus]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await prerequisiteCourseService.getAllCoursesWithPrerequisiteInfo();
            setCourses(response.data.result);
        } catch (error) {
            console.error('Error fetching courses:', error);
            message.error('Không thể tải danh sách môn học với thông tin tiên quyết');
        } finally {
            setLoading(false);
        }
    };

    const filterCourses = () => {
        let filtered = courses;

        // Text search
        if (searchText) {
            filtered = filtered.filter(course =>
                course.courseCode.toLowerCase().includes(searchText.toLowerCase()) ||
                course.courseName.toLowerCase().includes(searchText.toLowerCase()) ||
                course.departmentName.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        // Department filter
        if (selectedDepartment !== 'all') {
            filtered = filtered.filter(course => {
                if (!course.departmentName) return false;
                // Handle both single department and multiple departments separated by " | "
                const departments = course.departmentName.split(' | ').map(d => d.trim());
                return departments.includes(selectedDepartment);
            });
        }

        // Status filter
        if (selectedStatus !== 'all') {
            if (selectedStatus === 'has-prerequisites') {
                filtered = filtered.filter(course => course.numberOfPrequisiteCourses > 0);
            } else if (selectedStatus === 'no-prerequisites') {
                filtered = filtered.filter(course => course.numberOfPrequisiteCourses === 0);
            } else if (selectedStatus === 'has-warnings') {
                filtered = filtered.filter(course => course.hasCircularDependency);
            }
        }

        setFilteredCourses(filtered);
    };

    const getDepartments = () => {
        // Extract all departments, including those with multiple departments separated by " | "
        const allDepartments = new Set();
        
        courses.forEach(course => {
            if (course.departmentName && course.departmentName !== 'Khoa không xác định') {
                // Split by " | " to handle multiple departments
                const departments = course.departmentName.split(' | ').map(d => d.trim());
                departments.forEach(dept => allDepartments.add(dept));
            }
        });
        
        return Array.from(allDepartments).sort();
    };

    const columns = [
        {
            title: 'Mã môn học',
            dataIndex: 'courseCode',
            key: 'courseCode',
            sorter: (a, b) => a.courseCode.localeCompare(b.courseCode),
            render: (text) => <strong>{text}</strong>
        },
        {
            title: 'Tên môn học',
            dataIndex: 'courseName',
            key: 'courseName',
            sorter: (a, b) => a.courseName.localeCompare(b.courseName),
            ellipsis: true
        },
        {
            title: 'Khoa',
            dataIndex: 'departmentName',
            key: 'departmentName',
            sorter: (a, b) => a.departmentName.localeCompare(b.departmentName),
            render: (text) => {
                if (text === 'Khoa không xác định') {
                    return <Tag color="default">-</Tag>;
                }
                
                // Handle multiple departments separated by " | "
                const departments = text.split(' | ').map(d => d.trim());
                
                if (departments.length === 1) {
                    return <Tag color="blue">{departments[0]}</Tag>;
                } else {
                    return (
                        <Space wrap>
                            {departments.map((dept, index) => (
                                <Tag key={index} color="blue" size="small">
                                    {dept}
                                </Tag>
                            ))}
                        </Space>
                    );
                }
            }
        },
        {
            title: 'Môn tiên quyết',
            dataIndex: 'numberOfPrequisiteCourses',
            key: 'numberOfPrequisiteCourses',
            sorter: (a, b) => a.numberOfPrequisiteCourses - b.numberOfPrequisiteCourses,
            render: (count) => (
                <Tag color={count === 0 ? 'default' : 'green'}>
                    {count} {count === 1 ? 'môn tiên quyết' : 'môn tiên quyết'}
                </Tag>
            )
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    {record.hasCircularDependency && (
                        <Tag color="red" icon={<ExclamationCircleOutlined />}>
                            Phụ thuộc vòng tròn
                        </Tag>
                    )}
                    {record.isPrequisiteForOtherCourses && (
                        <Tag color="orange" icon={<BookOutlined />}>
                            Được yêu cầu bởi khác
                        </Tag>
                    )}
                    {!record.hasCircularDependency && !record.isPrequisiteForOtherCourses && (
                        <Tag color="green">Bình thường</Tag>
                    )}
                </Space>
            )
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => navigate(`/admin/academic/prerequisite-courses/details/${record.courseId}`)}
                    >
                        Xem chi tiết
                    </Button>
                    <Button
                        type="default"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => navigate(`/admin/academic/prerequisite-courses/edit/${record.courseId}`)}
                    >
                        Quản lý
                    </Button>
                </Space>
            )
        }
    ];

    const getStatusCounts = () => {
        const withPrerequisites = courses.filter(c => c.numberOfPrequisiteCourses > 0).length;
        const withWarnings = courses.filter(c => c.hasCircularDependency).length;
        const requiredByOthers = courses.filter(c => c.isPrequisiteForOtherCourses).length;

        return { withPrerequisites, withWarnings, requiredByOthers };
    };

    const statusCounts = getStatusCounts();

    return (
        <MainLayout>
            <div style={{ padding: '24px' }}>
                <Card>
                    <div style={{ marginBottom: '24px' }}>
                        <h2 style={{ margin: 0 }}>Quản lý môn học tiên quyết</h2>
                        <p style={{ color: '#666', marginTop: '8px' }}>
                            Quản lý mối quan hệ tiên quyết giữa các môn học
                        </p>
                    </div>

                    {/* Statistics */}
                    <div style={{ marginBottom: '24px' }}>
                        <Space size="large">
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                                    {courses.length}
                                </div>
                                <div style={{ color: '#666' }}>Tổng số môn học</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                                    {statusCounts.withPrerequisites}
                                </div>
                                <div style={{ color: '#666' }}>Có môn tiên quyết</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa8c16' }}>
                                    {statusCounts.requiredByOthers}
                                </div>
                                <div style={{ color: '#666' }}>Được yêu cầu bởi khác</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f5222d' }}>
                                    {statusCounts.withWarnings}
                                </div>
                                <div style={{ color: '#666' }}>Có cảnh báo</div>
                            </div>
                        </Space>
                    </div>

                    {/* Warnings */}
                    {statusCounts.withWarnings > 0 && (
                        <Alert
                            message="Phát hiện phụ thuộc vòng tròn"
                            description={`${statusCounts.withWarnings} môn học có vấn đề phụ thuộc vòng tròn cần được xử lý.`}
                            type="warning"
                            showIcon
                            style={{ marginBottom: '24px' }}
                        />
                    )}

                    {/* Filters */}
                    <div style={{ marginBottom: '24px' }}>
                        <Space wrap>
                            <Input
                                placeholder="Tìm kiếm môn học..."
                                prefix={<SearchOutlined />}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                style={{ width: 250 }}
                            />
                            <Select
                                value={selectedDepartment}
                                onChange={setSelectedDepartment}
                                style={{ width: 200 }}
                            >
                                <Option value="all">Tất cả khoa</Option>
                                {getDepartments().map(dept => (
                                    <Option key={dept} value={dept}>{dept}</Option>
                                ))}
                            </Select>
                            <Select
                                value={selectedStatus}
                                onChange={setSelectedStatus}
                                style={{ width: 200 }}
                            >
                                <Option value="all">Tất cả trạng thái</Option>
                                <Option value="has-prerequisites">Có môn tiên quyết</Option>
                                <Option value="no-prerequisites">Không có môn tiên quyết</Option>
                                <Option value="has-warnings">Có cảnh báo</Option>
                            </Select>
                        </Space>
                    </div>

                    {/* Table */}
                    <Table
                        columns={columns}
                        dataSource={filteredCourses}
                        rowKey="courseId"
                        loading={loading}
                        pagination={{
                            total: filteredCourses.length,
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => `${range[0]}-${range[1]} trên ${total} môn học`
                        }}
                        size="small"
                        scroll={{ x: true }}
                    />
                </Card>
            </div>
        </MainLayout>
    );
}