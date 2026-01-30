const Notification = ({ message, isGood }) => {
  if (message === null) {
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