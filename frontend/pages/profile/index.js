import { Col, Row } from 'antd'
import { useSession } from '../../context/useSession'
import SinglePageContent from '../../components/global/single-page-content/SinglePageContent'
import UserCard from '../../components/views/users/single/UserCard'
import ChangePassword from '../../components/views/profile/ChangePassword'
import EditProfile from '../../components/views/profile/EditProfile'
import TimelineCard from '../../components/views/timeline/TimelineCard'
const Profile = () => {
  const { user } = useSession()

  return (
    <SinglePageContent>
      <Row gutter={24}>
        <Col span={24} lg={{ span: 15 }}>
          <UserCard data={user} />
          <EditProfile data={user} />
          <ChangePassword />
        </Col>
        <Col span={24} lg={{ span: 9 }}>
          <TimelineCard filters={{ user: user?.id }} />
        </Col>
      </Row>
    </SinglePageContent>
  )
}
export default Profile
