import { Html, Head, Main, NextScript } from 'next/document'
import LuidaoHeader from '@/components/LuidaoHeader'

export default function Document() {
  return (
    <Html lang="ja">
      <Head />
      <body>
        {/* <container> */}
          <LuidaoHeader />
          <Main />
          <NextScript />
        {/* </container> */}
      </body>
    </Html>
  )
}
