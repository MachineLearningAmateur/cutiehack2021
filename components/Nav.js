import React, { useEffect } from 'react'
import Link from 'next/link' // We should be using the Link component
import { signIn, signOut, useSession } from 'next-auth/client'
import { motion } from 'framer-motion'

import styles from '../styles/Nav.module.css'

export default function Nav() {
  const [session] = useSession()
  const [checkedIn, setCheckedIn] = React.useState(false)
  const [inGroup, setInGroup] = React.useState(false)
  const [group, setGroup] = React.useState('')

  const fetchData = async (name) => {
    const response = await fetch('/api/checkin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session_data: name }),
    })
    const data = await response.json()
    setCheckedIn(Object.keys(data.checkins).length !== 0)
    setInGroup(data.checkins[0].groupId !== '')
    if (data.checkins[0].groupId !== '') {
      setGroup(data.checkins[0].groupId)
    }
  }

  useEffect(() => {
    if (session) fetchData(session.user.name)
  })

  return (
    <nav className={styles.navbar}>
      <div className={styles.tabs}>
        <Link href="/">Home</Link>
        <a href="#">About</a>
        <a href="#">FAQ</a>
        <a href="#">Help</a>
        <a href="#sponsors">Sponsors</a>
        {!session ? (
          <motion.button
            aria-label="Sign In Button"
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.995 }}
            transition={{ ease: 'easeInOut', duration: 0.015 }}
            className={styles.primarybutton}
            onClick={signIn}
          >
            Sign in
          </motion.button>
        ) : (
          <>
            {!checkedIn &&
              <Link passHref href="/checkin">
                <motion.a
                  aria-label="Check In Button"
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.995 }}
                  transition={{ ease: 'easeInOut', duration: 0.015 }}
                  className={styles.primarybutton}
                >
                  Check In
                </motion.a>
              </Link>
            }
            {inGroup &&
              <Link passHref href={"/groups/" + group}>
                <motion.a
                  aria-label="View Group Button"
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.995 }}
                  transition={{ ease: 'easeInOut', duration: 0.015 }}
                  className={styles.primarybutton}
                >
                  View Your Group
                </motion.a>
              </Link>
            }
            <motion.button
              aria-label="Sign Out Button"
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.995 }}
              transition={{ ease: 'easeInOut', duration: 0.015 }}
              className={styles.secondarybutton}
              onClick={signOut}
            >
              Sign out
            </motion.button>
          </>
        )}
      </div>
    </nav>
  )
}
