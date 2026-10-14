import { useState } from 'react'
import { motion } from 'motion/react'

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export default function RedSection() {
  const [videoFailed, setVideoFailed] = useState(false)

  return (
    <section className="relative min-h-screen w-full bg-[#FF0000] flex flex-col z-10">
      <div className="flex-1 flex flex-col items-center w-full pt-[100px] md:pt-[400px]">
        <div className="flex flex-col items-center w-full px-8 text-center z-20 relative max-w-[900px] h-auto md:h-[620px] mx-auto">
          <motion.div
            className="mb-12"
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            custom={0}
          >
            <svg width="80" height="80" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M60 120C26.8629 120 0 93.1371 0 60V0C22.5654 0 42.2213 12.4569 52.4662 30.8691C38.4788 34.2089 28.0787 46.7902 28.0787 61.8006V63.1443C28.0787 79.9648 41.7146 93.6006 58.5353 93.6006H59.8789L59.8785 61.8006C59.8785 79.3633 74.1159 93.6006 91.6787 93.6006L91.6787 61.8006C91.6787 44.2783 77.5071 30.0661 60 30.0008L60 0H62.5352C94.2722 0 120 25.7279 120 57.4648V60C120 93.1371 93.1371 120 60 120Z" fill="white" />
            </svg>
          </motion.div>

          <motion.p
            className="text-white text-[16px] h-auto md:h-[100px] w-full max-w-[400px] leading-[1.6] mb-[40px] uppercase tracking-wider mx-auto"
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            custom={1}
          >
            I build full-stack products with a single purpose to eliminate operational chaos and restore balance to your daily business routine
          </motion.p>

          <motion.div
            className="font-marck text-white text-[64px] md:text-[120px] leading-none mb-[32px] whitespace-nowrap"
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            custom={2}
          >
            Harshil Gohil
          </motion.div>

          <motion.div
            className="text-white leading-[1.6] mb-[100px] md:mb-24 w-full flex flex-col items-center font-light"
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={3}
          >
            <p className="mb-[24px] text-[16px] w-[400px] max-w-full text-center">
              I Was Exhausted By Software That Demanded More Effort Than It Actually Saved. That Is Why I Engineer Autonomous Architectures That Operate Silently In The Background.
            </p>
            <p className="mb-[32px] text-[16px] w-[400px] max-w-full text-center">
              Your Business Should Serve Your Life, Not Consume It. Let My Code Handle The Heavy Lifting, So You Can Focus On The Vision.
            </p>
            <a
              href="https://github.com/Harshil0207"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-[14px] uppercase tracking-wider font-semibold border-b border-white/60 pb-1 hover:border-white transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
              </svg>
              github.com/Harshil0207
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </motion.div>
        </div>
      </div>

      {!videoFailed && (
        <div className="relative w-full shrink-0">
          <div className="absolute top-0 left-0 w-full h-[100px] bg-gradient-to-b from-[#FF0000] to-transparent z-10 pointer-events-none" />
          <video autoPlay loop muted playsInline className="w-full h-auto block object-contain">
            <source src="/track-video.mp4" type="video/mp4" onError={() => setVideoFailed(true)} />
          </video>
        </div>
      )}
    </section>
  )
}
