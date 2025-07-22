import React, { useMemo, useState } from 'react';
import { Card, Col, DatePicker, Row, Table, Spin, Alert } from 'antd';
import { ClockCircleOutlined, EnvironmentOutlined, RiseOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Area, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, Line, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import {
  useFindAllHourUsageStatistics,
  useFindAllStationUsageStatistics,
  useFindAllTicketTypeStatistics
} from "src/queries/useAdmin"; 

const COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2'];

const Dashboard = () => {
  const { data: hourUsageResponse, isLoading: isLoadingHourData, error: errorHourData } = useFindAllHourUsageStatistics();
  const { data: stationUsageResponse, isLoading: isLoadingStationData, error: errorStationData } = useFindAllStationUsageStatistics();
  const { data: ticketTypeResponse, isLoading: isLoadingTicketData, error: errorTicketData } = useFindAllTicketTypeStatistics();
  const hourUsageStatistic = hourUsageResponse?.data || [];
  const stationUsageStatistic = stationUsageResponse?.data || [];
  const ticketTypeStatistics = ticketTypeResponse?.data || [];
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const filteredData = useMemo(() => {
    const selectedDateStr = selectedDate.format('YYYY-MM-DD');
    const filteredHourlyData = hourUsageStatistic
      .filter(item => item.usageDate === selectedDateStr)
      .map(item => ({
        ...item,
        hour: `${String(item.startHour).padStart(2, '0')}:00 - ${String(item.endHour).padStart(2, '0')}:00`
      }));

    const filteredStationData = stationUsageStatistic.filter(item => {
      return item.usageDate === selectedDateStr;
    });

    const filteredTicketData = ticketTypeStatistics.filter(item => {
      return item.usageDate === selectedDateStr;
    });

    return {
      hourlyData: filteredHourlyData,
      stationData: filteredStationData,
      ticketData: filteredTicketData
    };
  }, [selectedDate, hourUsageStatistic, stationUsageStatistic, ticketTypeStatistics]);
  const { hourlyData, stationData, ticketData } = filteredData;
  const totalEntries = stationData.reduce((sum, station) => sum + station.entryCount, 0);
  const totalExits = stationData.reduce((sum, station) => sum + station.exitCount, 0);
  const totalTickets = ticketData.reduce((sum, ticket) => sum + ticket.usageCount, 0);
  const peakHour = hourlyData.length > 0
    ? hourlyData.reduce((max, current) => {
      const currentTotal = current.entryCount + current.exitCount;
      const maxTotal = max.entryCount + max.exitCount;
      return currentTotal > maxTotal ? current : max;
    })
    : null;
  const stationTableData = stationData.map((station, index) => ({
    key: station.id.toString(),
    ...station,
    totalUsage: station.entryCount + station.exitCount
  }));

  const stationColumns = [
    {
      title: 'Ga',
      dataIndex: 'stationName',
      key: 'stationName',
      sorter: (a: any, b: any) => a.stationName.localeCompare(b.stationName),
      render: (text: string) => (
        <div style={{ fontWeight: 600, color: '#333' }}>{text}</div>
      ),
    },
    {
      title: 'Lượt vào',
      dataIndex: 'entryCount',
      key: 'entryCount',
      sorter: (a: any, b: any) => a.entryCount - b.entryCount,
      render: (value: any) => (
        <div style={{ color: '#52c41a', fontWeight: 600 }}>
          {value.toLocaleString()}
        </div>
      ),
    },
    {
      title: 'Lượt ra',
      dataIndex: 'exitCount',
      key: 'exitCount',
      sorter: (a: any, b: any) => a.exitCount - b.exitCount,
      render: (value: any) => (
        <div style={{ color: '#f5222d', fontWeight: 600 }}>
          {value.toLocaleString()}
        </div>
      ),
    },
    {
      title: 'Tổng',
      dataIndex: 'totalUsage',
      key: 'totalUsage',
      sorter: (a: any, b: any) => a.totalUsage - b.totalUsage,
      render: (value: any) => (
        <div style={{
          color: '#1890ff',
          fontWeight: 700,
          fontSize: '16px',
          padding: '4px 8px',
          background: '#e6f7ff',
          borderRadius: '6px',
          textAlign: 'center'
        }}>
          {value.toLocaleString()}
        </div>
      ),
    },
  ];

  const StatisticCard = ({ title, value, prefix, bgColor }: any) => (
    <Card
      className="!shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]"
      style={{
        borderRadius: '8px',
        border: '1px solid #f0f0f0',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      bodyStyle={{ padding: '24px' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02), 0 2px 4px 0 rgba(0,0,0,0.02)';
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="m-0 text-[#666] text-sm">{title}</p>
          <p className="font-bold text-[1.5em] m-0 text-[#333]">
            {typeof value === 'string' ? value : value.toLocaleString()}
          </p>
        </div>
        <div style={{ fontSize: '2em', color: bgColor }}>
          {prefix}
        </div>
      </div>
    </Card>
  );
  const hasData = hourlyData.length > 0 || stationData.length > 0 || ticketData.length > 0;
  const overallLoading = isLoadingHourData || isLoadingStationData || isLoadingTicketData;
  const overallError = errorHourData || errorStationData || errorTicketData;

  const noDataMessage = (
    <div style={{
      textAlign: 'center',
      padding: '40px',
      color: '#999',
      fontSize: '16px'
    }}>
      Không có dữ liệu cho ngày {selectedDate.format('DD/MM/YYYY')}
    </div>
  );

  return (
    <div style={{
      padding: '24px',
      background: '#f0f2f5',
      minHeight: '100vh'
    }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontSize: '2em',
          fontWeight: 'bold',
          color: '#333',
          margin: 0,
          marginBottom: '8px'
        }}>
          Metro Analytics Dashboard
        </h1>
        <p style={{ color: '#666', marginBottom: '16px' }}>
          Quản lý và phân tích dữ liệu sử dụng hệ thống metro
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <DatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            format="DD/MM/YYYY"
            style={{
              borderRadius: '6px'
            }}
            placeholder="Chọn ngày"
          />
        </div>
      </div>

      {overallLoading ? (
        <Card style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <p style={{ marginTop: '20px', fontSize: '16px', color: '#666' }}>Đang tải dữ liệu dashboard...</p>
        </Card>
      ) : overallError ? (
        <Card style={{ padding: '20px' }}>
          <Alert
            message="Lỗi tải dữ liệu"
            description={overallError.message} 
            type="error"
            showIcon
          />
        </Card>
      ) : !hasData ? (
        <Card>{noDataMessage}</Card>
      ) : (
        <>
          <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={12} md={6}>
              <StatisticCard
                title="Tổng lượt vào"
                value={totalEntries}
                prefix={<RiseOutlined />}
                bgColor="#52c41a"
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <StatisticCard
                title="Tổng lượt ra"
                value={totalExits}
                prefix={<EnvironmentOutlined />}
                bgColor="#f5222d"
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <StatisticCard
                title="Tổng vé sử dụng"
                value={totalTickets}
                prefix={<UserOutlined />}
                bgColor="#1890ff"
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <StatisticCard
                title="Giờ cao điểm"
                value={
                  peakHour
                    ? `${String(peakHour.startHour).padStart(2, '0')}:00 - ${String(peakHour.endHour).padStart(2, '0')}:00`
                    : 'Không có dữ liệu'
                }
                prefix={<ClockCircleOutlined />}
                bgColor="#faad14"
              />
            </Col>
          </Row>
          {hourlyData.length > 0 && (
            <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
              <Col xs={24}>
                <Card
                  title={
                    <div style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#333'
                    }}>
                      Thống Kê Theo Giờ - {selectedDate.format('DD/MM/YYYY')}
                    </div>
                  }
                  className="!shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]"
                  style={{
                    borderRadius: '8px',
                    border: '1px solid #f0f0f0'
                  }}
                >
                  <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={hourlyData}>
                      <defs>
                        <linearGradient id="entryGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#52c41a" stopOpacity={0.6} />
                          <stop offset="95%" stopColor="#52c41a" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="exitGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f5222d" stopOpacity={0.6} />
                          <stop offset="95%" stopColor="#f5222d" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="hour" 
                        stroke="#666"
                        tick={{ fontSize: 12 }}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis stroke="#666" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #f0f0f0',
                          borderRadius: '6px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                        labelFormatter={(label) => `Giờ: ${label}`}
                        formatter={(value: any, name: string) => [
                          value.toLocaleString(),
                          name
                        ]}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="entryCount"
                        stroke="#52c41a"
                        fillOpacity={1}
                        fill="url(#entryGradient)"
                        name="Lượt vào"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="exitCount"
                        stroke="#f5222d"
                        strokeWidth={3}
                        dot={{ fill: '#f5222d', strokeWidth: 2, r: 4 }}
                        name="Lượt ra"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>
          )}

          <Row gutter={[24, 24]}>
            {stationData.length > 0 && (
              <Col xs={24} lg={14}> 
                <Card
                  title={
                    <div style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#333'
                    }}>
                      Thống Kê Theo Ga - {selectedDate.format('DD/MM/YYYY')}
                    </div>
                  }
                  className="!shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]"
                  style={{
                    borderRadius: '8px',
                    border: '1px solid #f0f0f0'
                  }}
                >
                  <Table
                    dataSource={stationTableData}
                    columns={stationColumns}
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: false,
                      showQuickJumper: true
                    }}
                    scroll={{ x: 600 }} 
                    size="middle"
                  />
                </Card>
              </Col>
            )}
            {ticketData.length > 0 && (
              <Col xs={24} lg={stationData.length > 0 ? 10 : 24}> 
                <Card
                  title={
                    <div style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#333'
                    }}>
                      Thống Kê Theo Loại Vé - {selectedDate.format('DD/MM/YYYY')}
                    </div>
                  }
                  className="!shadow-[0_1px_2px_0_rgba(0,0,0,0.03),0_1px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_0_rgba(0,0,0,0.02)]"
                  style={{
                    borderRadius: '8px',
                    border: '1px solid #f0f0f0'
                  }}
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={ticketData}
                        dataKey="usageCount"
                        nameKey="ticketType" 
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        labelLine={false} 
                        label={({ percent }) => percent !== undefined ? `${(percent * 100).toFixed(0)}%` : ''} 
                      >
                        {ticketData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [value.toLocaleString(), 'Số lượt']}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #f0f0f0',
                          borderRadius: '6px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                      {ticketData.map((item, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '8px',
                          background: '#fafafa',
                          borderRadius: '6px',
                          border: '1px solid #f0f0f0'
                        }}>
                          <div
                            style={{
                              width: '12px',
                              height: '12px',
                              backgroundColor: COLORS[index % COLORS.length],
                              marginRight: '8px',
                              borderRadius: '50%'
                            }}
                          />
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#333' }}>
                              {item.ticketType}
                            </div>
                            <div style={{ fontSize: '11px', color: '#666' }}>
                              {item.usageCount.toLocaleString()} lượt
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </Col>
            )}
          </Row>
        </>
      )}
    </div>
  );
};

export default Dashboard;
