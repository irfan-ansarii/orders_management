import React, { useState } from 'react'
import { Button, Drawer, Badge } from 'antd'
import { MdFilterList } from 'react-icons/md'

import Loading from '../../../loader/Loading'

const FilterDrawer = ({}) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Badge offset={[-8, 10]} dot count={1}>
        <Button
          icon={<MdFilterList />}
          className="btn-action"
          size="large"
          type="text"
          onClick={() => {
            setOpen(!open)
          }}
        ></Button>
      </Badge>
      <Drawer
        autoFocus
        destroyOnClose
        headerStyle={{ display: 'none' }}
        contentWrapperStyle={{
          borderTopLeftRadius: '.5rem',
          borderTopRightRadius: '.5rem',
          overflow: 'hidden',
        }}
        placement="bottom"
        height="400"
        push={0}
        onClose={() => setOpen(false)}
        open={open}
      >
        <span onClick={() => setOpen(false)} className="drawer-close"></span>
        <Loading />
      </Drawer>
    </>
  )
}

export default FilterDrawer
