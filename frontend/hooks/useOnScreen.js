import { useEffect, useMemo, useRef, useState } from 'react'

const useOnScreen = (ref) => {
  const [isOn, setIsOn] = useState(false)

  const observer = useMemo(
    () => new IntersectionObserver(([entry]) => setIsOn(entry.isIntersecting)),
    [],
  )

  useEffect(() => {
    observer.observe(ref?.current)

    return () => {
      observer.disconnect()
    }
  }, [ref, observer])

  return isOn
}

export default useOnScreen
