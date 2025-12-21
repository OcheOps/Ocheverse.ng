import '@/styles/globals.css'
import Layout from '../components/Layout'
import CommandPalette from '../components/CommandPalette'

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <CommandPalette />
      <Component {...pageProps} />
    </Layout>
  )
}
