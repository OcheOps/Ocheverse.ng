import '@/styles/globals.css'
import Head from 'next/head'
import Layout from '../components/Layout'
import CommandPalette from '../components/CommandPalette'
import EasterEggs from '../components/EasterEggs'
import { AnimatePresence, motion, useReducedMotion, MotionConfig } from 'framer-motion'
import { useRouter } from 'next/router'

const SITE_URL = 'https://ocheverse.ng'

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const shouldReduceMotion = useReducedMotion()
  const canonical = `${SITE_URL}${router.asPath === '/' ? '' : router.asPath.split('?')[0]}`

  return (
    <MotionConfig reducedMotion="user">
      <Head>
        <link rel="canonical" href={canonical} key="canonical" />
      </Head>
      <Layout>
        <CommandPalette />
        <EasterEggs />
        <AnimatePresence mode="wait">
          <motion.div
            key={router.asPath}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: 'easeInOut' }}
          >
            <Component {...pageProps} />
          </motion.div>
        </AnimatePresence>
      </Layout>
    </MotionConfig>
  )
}
