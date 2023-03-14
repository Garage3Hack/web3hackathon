import type { NextPage } from 'next'
import Head from 'next/head'
import LuiDAOs from '@/pages/LuiDAOs'


const Home: NextPage = () => {
  return (
    <>
      <Head><title>Home</title></Head>
      <LuiDAOs/>
    </>
  )
}

export default Home