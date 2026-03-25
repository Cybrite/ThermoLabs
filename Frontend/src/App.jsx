import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1126px] flex-col border-x border-zinc-200 bg-white text-center text-[16px] leading-[145%] tracking-[0.18px] text-zinc-500 antialiased md:text-[18px] dark:border-zinc-700 dark:bg-[#16171d] dark:text-zinc-400">
      <section className="flex grow flex-col place-items-center place-content-center gap-[18px] px-5 pb-6 pt-8 md:gap-[25px] md:px-0 md:py-0">
        <div className="relative">
          <img
            src={heroImg}
            className="relative z-0 w-[170px]"
            width="170"
            height="179"
            alt=""
          />
          <img
            src={reactLogo}
            className="absolute left-0 right-0 top-[34px] z-[1] mx-auto h-7 [transform:perspective(2000px)_rotateZ(300deg)_rotateX(44deg)_rotateY(39deg)_scale(1.4)]"
            alt="React logo"
          />
          <img
            src={viteLogo}
            className="absolute left-0 right-0 top-[107px] z-0 mx-auto h-[26px] w-auto [transform:perspective(2000px)_rotateZ(300deg)_rotateX(40deg)_rotateY(39deg)_scale(0.8)]"
            alt="Vite logo"
          />
        </div>
        <div>
          <h1 className="my-5 text-4xl font-medium tracking-[-1.1px] text-zinc-950 md:my-8 md:text-[56px] md:tracking-[-1.68px] dark:text-zinc-100">
            Get started
          </h1>
          <p>
            Edit{" "}
            <code className="inline-flex rounded bg-[#f4f3ec] px-2 py-1 font-mono text-[15px] leading-[135%] text-zinc-950 dark:bg-[#1f2028] dark:text-zinc-100">
              src/App.jsx
            </code>{" "}
            and save to test{" "}
            <code className="inline-flex rounded bg-[#f4f3ec] px-2 py-1 font-mono text-[15px] leading-[135%] text-zinc-950 dark:bg-[#1f2028] dark:text-zinc-100">
              HMR
            </code>
          </p>
        </div>
        <button
          className="mb-6 inline-flex rounded border-2 border-transparent bg-[rgba(170,59,255,0.1)] px-2.5 py-[5px] font-mono text-[16px] text-[#aa3bff] transition-colors hover:border-[rgba(170,59,255,0.5)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#aa3bff] dark:bg-[rgba(192,132,252,0.15)] dark:text-[#c084fc] dark:hover:border-[rgba(192,132,252,0.5)] dark:focus-visible:outline-[#c084fc]"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="relative w-full before:absolute before:-top-[4.5px] before:left-0 before:border-[5px] before:border-transparent before:border-l-zinc-200 dark:before:border-l-zinc-700 after:absolute after:-top-[4.5px] after:right-0 after:border-[5px] after:border-transparent after:border-r-zinc-200 dark:after:border-r-zinc-700"></div>

      <section className="flex border-t border-zinc-200 text-left max-md:flex-col max-md:text-center dark:border-zinc-700">
        <div className="flex-1 border-r border-zinc-200 p-5 md:p-8 max-md:border-b max-md:border-r-0 dark:border-zinc-700">
          <svg
            className="mb-4 h-[22px] w-[22px] max-md:mx-auto"
            role="presentation"
            aria-hidden="true"
          >
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2 className="mb-2 text-xl font-medium leading-[118%] tracking-[-0.24px] text-zinc-950 md:text-2xl dark:text-zinc-100">
            Documentation
          </h2>
          <p>Your questions, answered</p>
          <ul className="mt-5 flex flex-wrap justify-center gap-2 md:mt-8 md:flex-nowrap md:justify-start">
            <li className="flex-1 basis-[calc(50%-8px)] md:flex-none">
              <a
                href="https://vite.dev/"
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-md bg-[rgba(244,243,236,0.5)] px-3 py-1.5 text-[16px] text-zinc-950 no-underline transition-shadow hover:shadow-[rgba(0,0,0,0.1)_0_10px_15px_-3px,rgba(0,0,0,0.05)_0_4px_6px_-2px] md:w-auto dark:bg-[rgba(47,48,58,0.5)] dark:text-zinc-100 dark:hover:shadow-[rgba(0,0,0,0.4)_0_10px_15px_-3px,rgba(0,0,0,0.25)_0_4px_6px_-2px]"
              >
                <img className="h-[18px]" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li className="flex-1 basis-[calc(50%-8px)] md:flex-none">
              <a
                href="https://react.dev/"
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-md bg-[rgba(244,243,236,0.5)] px-3 py-1.5 text-[16px] text-zinc-950 no-underline transition-shadow hover:shadow-[rgba(0,0,0,0.1)_0_10px_15px_-3px,rgba(0,0,0,0.05)_0_4px_6px_-2px] md:w-auto dark:bg-[rgba(47,48,58,0.5)] dark:text-zinc-100 dark:hover:shadow-[rgba(0,0,0,0.4)_0_10px_15px_-3px,rgba(0,0,0,0.25)_0_4px_6px_-2px]"
              >
                <img className="h-[18px] w-[18px]" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div className="flex-1 p-5 md:p-8">
          <svg
            className="mb-4 h-[22px] w-[22px] max-md:mx-auto"
            role="presentation"
            aria-hidden="true"
          >
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2 className="mb-2 text-xl font-medium leading-[118%] tracking-[-0.24px] text-zinc-950 md:text-2xl dark:text-zinc-100">
            Connect with us
          </h2>
          <p>Join the Vite community</p>
          <ul className="mt-5 flex flex-wrap justify-center gap-2 md:mt-8 md:flex-nowrap md:justify-start">
            <li className="flex-1 basis-[calc(50%-8px)] md:flex-none">
              <a
                href="https://github.com/vitejs/vite"
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-md bg-[rgba(244,243,236,0.5)] px-3 py-1.5 text-[16px] text-zinc-950 no-underline transition-shadow hover:shadow-[rgba(0,0,0,0.1)_0_10px_15px_-3px,rgba(0,0,0,0.05)_0_4px_6px_-2px] md:w-auto dark:bg-[rgba(47,48,58,0.5)] dark:text-zinc-100 dark:hover:shadow-[rgba(0,0,0,0.4)_0_10px_15px_-3px,rgba(0,0,0,0.25)_0_4px_6px_-2px]"
              >
                <svg
                  className="h-[18px] w-[18px] dark:invert dark:brightness-200"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li className="flex-1 basis-[calc(50%-8px)] md:flex-none">
              <a
                href="https://chat.vite.dev/"
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-md bg-[rgba(244,243,236,0.5)] px-3 py-1.5 text-[16px] text-zinc-950 no-underline transition-shadow hover:shadow-[rgba(0,0,0,0.1)_0_10px_15px_-3px,rgba(0,0,0,0.05)_0_4px_6px_-2px] md:w-auto dark:bg-[rgba(47,48,58,0.5)] dark:text-zinc-100 dark:hover:shadow-[rgba(0,0,0,0.4)_0_10px_15px_-3px,rgba(0,0,0,0.25)_0_4px_6px_-2px]"
              >
                <svg
                  className="h-[18px] w-[18px] dark:invert dark:brightness-200"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li className="flex-1 basis-[calc(50%-8px)] md:flex-none">
              <a
                href="https://x.com/vite_js"
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-md bg-[rgba(244,243,236,0.5)] px-3 py-1.5 text-[16px] text-zinc-950 no-underline transition-shadow hover:shadow-[rgba(0,0,0,0.1)_0_10px_15px_-3px,rgba(0,0,0,0.05)_0_4px_6px_-2px] md:w-auto dark:bg-[rgba(47,48,58,0.5)] dark:text-zinc-100 dark:hover:shadow-[rgba(0,0,0,0.4)_0_10px_15px_-3px,rgba(0,0,0,0.25)_0_4px_6px_-2px]"
              >
                <svg
                  className="h-[18px] w-[18px] dark:invert dark:brightness-200"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li className="flex-1 basis-[calc(50%-8px)] md:flex-none">
              <a
                href="https://bsky.app/profile/vite.dev"
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-md bg-[rgba(244,243,236,0.5)] px-3 py-1.5 text-[16px] text-zinc-950 no-underline transition-shadow hover:shadow-[rgba(0,0,0,0.1)_0_10px_15px_-3px,rgba(0,0,0,0.05)_0_4px_6px_-2px] md:w-auto dark:bg-[rgba(47,48,58,0.5)] dark:text-zinc-100 dark:hover:shadow-[rgba(0,0,0,0.4)_0_10px_15px_-3px,rgba(0,0,0,0.25)_0_4px_6px_-2px]"
              >
                <svg
                  className="h-[18px] w-[18px] dark:invert dark:brightness-200"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="relative w-full before:absolute before:-top-[4.5px] before:left-0 before:border-[5px] before:border-transparent before:border-l-zinc-200 dark:before:border-l-zinc-700 after:absolute after:-top-[4.5px] after:right-0 after:border-[5px] after:border-transparent after:border-r-zinc-200 dark:after:border-r-zinc-700"></div>
      <section className="h-12 border-t border-zinc-200 md:h-[88px] dark:border-zinc-700"></section>
    </div>
  );
}

export default App;
