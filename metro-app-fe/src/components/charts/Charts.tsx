import { Card } from 'antd';
import { ApexOptions } from 'apexcharts';
import React from 'react'
import ReactApexChart from 'react-apexcharts';

const dailySalesData = [
    { name: 'Apr', value: 50 },
    { name: 'May', value: 100 },
    { name: 'Jun', value: 350 },
    { name: 'Jul', value: 350 },
    { name: 'Aug', value: 500 },
    { name: 'Sep', value: 200 },
    { name: 'Oct', value: 200 },
    { name: 'Nov', value: 500 },
    { name: 'Dec', value: 500 }
  ];
  
  const completedTasksData = [
    { name: 'Apr', value: 50 },
    { name: 'May', value: 50 },
    { name: 'Jun', value: 350 },
    { name: 'Jul', value: 250 },
    { name: 'Aug', value: 500 },
    { name: 'Sep', value: 250 },
    { name: 'Oct', value: 400 },
    { name: 'Nov', value: 250 },
    { name: 'Dec', value: 500 }
  ];
  
  const websiteViewData = [
    { name: 'M', value: 0 },
    { name: 'T', value: 50 },
    { name: 'W', value: 20 },
    { name: 'T', value: 0 },
    { name: 'F', value: 50 },
    { name: 'S', value: 10 },
    { name: 'S', value: 40 }
  ];

const Charts = () => {
  
  // Website View Chart Options
  const websiteViewOptions: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        columnWidth: '40%'
      }
    },
    colors: ['#4ade80'],
    xaxis: {
      categories: websiteViewData.map(item => item.name)
    },
    yaxis: {
      labels: {
        formatter: function(val) {
          return val.toFixed(0);
        }
      }
    },
    grid: {
      borderColor: '#f1f1f1',
      strokeDashArray: 4
    },
    dataLabels: {
      enabled: false
    },
    tooltip: {
      enabled: true
    }
  };

  // Daily Sales Chart Options
  const dailySalesOptions: ApexOptions = {
    chart: {
      type: 'line',
      toolbar: {
        show: false
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    colors: ['#3b82f6'],
    xaxis: {
      categories: dailySalesData.map(item => item.name)
    },
    yaxis: {
      labels: {
        formatter: function(val) {
          return val.toFixed(0);
        }
      }
    },
    grid: {
      borderColor: '#f1f1f1',
      strokeDashArray: 4
    },
    dataLabels: {
      enabled: false
    },
    tooltip: {
      enabled: true
    }
  };

  // Completed Tasks Chart Options
  const completedTasksOptions: ApexOptions = {
    chart: {
      type: 'line',
      toolbar: {
        show: false
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    colors: ['#10b981'],
    xaxis: {
      categories: completedTasksData.map(item => item.name)
    },
    yaxis: {
      labels: {
        formatter: function(val) {
          return val.toFixed(0);
        }
      }
    },
    grid: {
      borderColor: '#f1f1f1',
      strokeDashArray: 4
    },
    dataLabels: {
      enabled: false
    },
    tooltip: {
      enabled: true
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <Card title="Website View" extra="Last Campaign Performance" className="shadow-sm" headStyle={{ borderBottom: '0', paddingBottom: '0' }}>
        <p className="text-gray-600 mb-4">campaign sent 2 days ago</p>
        <div style={{ height: '200px' }}>
          <ReactApexChart 
            options={websiteViewOptions} 
            series={[{ name: 'Views', data: websiteViewData.map(item => item.value) }]} 
            type="bar" 
            height="100%" 
          />
        </div>
      </Card>

      <Card title="Daily Sales" extra="15% increase in today sales" className="shadow-sm" headStyle={{ borderBottom: '0', paddingBottom: '0' }}>
        <p className="text-gray-600 mb-4">updated 4 min ago</p>
        <div style={{ height: '200px' }}>
          <ReactApexChart 
            options={dailySalesOptions} 
            series={[{ name: 'Sales', data: dailySalesData.map(item => item.value) }]} 
            type="line" 
            height="100%" 
          />
        </div>
      </Card>

      <Card title="Completed Tasks" extra="Last Campaign Performance" className="shadow-sm" headStyle={{ borderBottom: '0', paddingBottom: '0' }}>
        <p className="text-gray-600 mb-4">just updated</p>
        <div style={{ height: '200px' }}>
          <ReactApexChart 
            options={completedTasksOptions} 
            series={[{ name: 'Tasks', data: completedTasksData.map(item => item.value) }]} 
            type="line" 
            height="100%" 
          />
        </div>
      </Card>
    </div>
  );
}

export default Charts