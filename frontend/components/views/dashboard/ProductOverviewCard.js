import React from 'react'
import { Card, Row } from 'antd'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Colors } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { useTheme } from '../../../context/useTheme'
import DatePicker from 'react-datepicker'
ChartJS.register(ArcElement, Tooltip, Legend, Colors)

const ProductOverviewCard = () => {
  const { screen } = useTheme()

  const data = {
    labels: ['In Stock', 'Low Stock', 'Out of Stock'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 18],
        borderWidth: 0,
      },
    ],
  }
  const options = {
    responsive: true,
    maintainAspectRatio: screen.xl ? false : true,
    plugins: {
      legend: {
        labels: {
          boxWidth: 20,
          font: {
            size: 10,
          },
        },
        position: 'bottom',
      },
    },
  }
  return (
    // <Card
    //   bordered={false}
    //   title="Products Overview"
    //   className={`table-card h-100 ${screen.xl ? 'mb-6' : ''}`}
    // >
    //   <Row justify="center" className={screen.xl ? 'py-4' : 'pa-6'}>
    //     <Pie data={data} options={options} />
    //   </Row>
    //   <DatePicker inline />
    // </Card>
    <DatePicker inline />
  )
}

export default ProductOverviewCard
