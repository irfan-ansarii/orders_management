import React, { useState } from 'react'
import { Card, Tag, Button, Row, Col } from 'antd'
import DatePicker from 'react-datepicker'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'
import moment from 'moment'
const UserTimelineCard = () => {
  const [date, setDate] = useState(moment())
  console.log(date.format('dd-mm'))
  return (
    <Card bordered={false} title="timeline" className="tieline-calender">
      <DatePicker
        inline
        showWeekNumbers
        dateFormat="w, yyyy"
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={15}
        showMonthDropdown
        scrollableMonthYearDropdown
      />
    </Card>
  )
}

export default UserTimelineCard
