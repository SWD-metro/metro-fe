import { BarChartOutlined, ContactsOutlined, DollarOutlined, TeamOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import React from 'react'

const StatisticsCards = () => {
    const stats = [
        {
          title: "Today's Money",
          value: '$53k',
          change: '+55%',
          changeText: 'than last week',
          icon: <DollarOutlined className="text-2xl" />,
          positive: true
        },
        {
          title: "Today's Users",
          value: '2,300',
          change: '+3%',
          changeText: 'than last month',
          icon: <TeamOutlined className="text-2xl" />,
          positive: true
        },
        {
          title: 'New Clients',
          value: '3,462',
          change: '-2%',
          changeText: 'than yesterday',
          icon: <ContactsOutlined className="text-2xl" />,
          positive: false
        },
        {
          title: 'Sales',
          value: '$103,430',
          change: '+5%',
          changeText: 'than yesterday',
          icon: <BarChartOutlined className="text-2xl" />,
          positive: true
        }
      ];
    
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-sm" bodyStyle={{ padding: '16px' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-2">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.change}
                    </span>
                    <span className="text-gray-500 text-sm ml-1">{stat.changeText}</span>
                  </div>
                </div>
                <div className={`${index === 0 ? 'bg-blue-50' : index === 1 ? 'bg-gray-100' : index === 2 ? 'bg-red-50' : 'bg-green-50'} p-3 rounded-lg`}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>
      );
}

export default StatisticsCards