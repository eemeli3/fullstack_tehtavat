import { useSelector } from 'react-redux'

const Notification = () => {
  const { message, isGood } = useSelector(state => state.notification)

  if (message === '') {
    return null
  }
  else {
    return (
      <div className={isGood ? 'goodNotification' : 'badNotification'}>
        {message}
      </div>
    )
  }
}

export default Notification