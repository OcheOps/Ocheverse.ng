import Head from 'next/head';
import Script from 'next/script';

export default function Guestbook() {
  const remark42Host = process.env.NEXT_PUBLIC_REMARK42_HOST || '';

  return (
    <>
      <Head>
        <title>Guestbook – Ocheverse</title>
        <meta name="description" content="Leave a message in the Ocheverse guestbook." />
        <meta property="og:title" content="Guestbook – Ocheverse" />
        <meta property="og:description" content="Leave a message in the Ocheverse guestbook." />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 pb-20">
        <div className="py-20 text-center px-4">
          <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            Guestbook
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Leave your mark. Say hi, share a thought, or just vibe.
          </p>
          <p className="text-sm text-gray-400 mt-3">No login required — drop a note anonymously.</p>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            {remark42Host ? (
              <>
                <div id="remark42" />
                <Script
                  id="remark42-guestbook-config"
                  strategy="afterInteractive"
                  dangerouslySetInnerHTML={{
                    __html: `
                      var remark_config = {
                        host: '${remark42Host}',
                        site_id: '${process.env.NEXT_PUBLIC_REMARK42_SITE_ID || 'ocheverse'}',
                        components: ['embed'],
                        url: 'https://ocheverse.ng/guestbook',
                        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
                        no_footer: true,
                      };
                    `,
                  }}
                />
                <Script src={`${remark42Host}/web/embed.js`} strategy="afterInteractive" />
              </>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Guestbook coming soon</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  The comment system is being set up. Check back soon!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
