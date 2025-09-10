'use client'
import { Pixelify_Sans } from "next/font/google"
import { Kapakana } from "next/font/google"
import { Jura } from "next/font/google"
import { Orbitron } from "next/font/google"
import Image from "next/image"
import { useEffect, useState } from "react"

const pixelify = Pixelify_Sans({
  subsets: ["latin"]
})

const kapakana = Kapakana({
  subsets: ["latin"]
})

const jura = Jura({
  subsets: ["latin"]
})

const orbitron = Orbitron({
  subsets: ["latin"]
})


export default function Home() {


  const [timerSeconds, setTimerSeconds] = useState<number>(50 * 60);
  const [secondsLeft, setSecondsLeft] = useState<number>(50 * 60);
  const [timerState, setTimerState] = useState<'running' | 'paused' | 'idle'>('idle');

  const defaultTimerValue = 50*60;



  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = (seconds % 60);

    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }

  const handleTimer = (value: string) => {
    const newSeconds = Number(value) * 60;
    setTimerState('idle')
    setTimerSeconds(newSeconds);
    setSecondsLeft(newSeconds);
  }


  useEffect(() => {



    if (timerState != 'running') return;

    const interval = setInterval(() => {

      setSecondsLeft((prev) => {

        if (prev <= 1) {
          setTimerState('idle');
          return 0;
        }

        return prev - 1;
      })

    }, 1000)

    return () => { clearInterval(interval) };


  }, [timerState])


  const handleStart = () => {
    console.log('clicked')
    setTimerState('running');
  }

  const handlePause = ()=>{
    setTimerState('paused')
  }

  const handleReset = () =>{
    setTimerState('idle');
    setSecondsLeft(defaultTimerValue);
    setTimerSeconds(defaultTimerValue)
  }


  return (

    <div>
      <div className="flex relative items-center mt-50  h-[13vh] w-full bg-center bg-auto bg-[url('/gradient2.jpeg')] ">


        {/* Timer */}
        <div className="h-[75px] flex items-center justify-center w-[170px] bg-[#EADDFF] rounded-l-2xl rounded-r-2xl ml-8">
          <p className={`${orbitron.className} text-black text-4xl font-bold `}>{formatTime(secondsLeft)}</p>

        </div>

        {/* Description */}
        <div className="flex gap-2 ml-5">
          <p className={`${pixelify.className} text-white text-6xl `}>STUDY </p>

          <p className={`${kapakana.className} text-white text-5xl`}>with</p>

          <p className={`${pixelify.className} text-white text-6xl `}>ME </p>

        </div>


        {/* Info */}

        <div className="flex flex-col text-white ml-8 justify-center items-center">

          <p className={`${jura.className} font-bold text-2xl`}>Topic- Solving Leetcode Together</p>

          <div className="flex gap-2">
            <Image height={20} width={25} quality={100} alt={"Github logo"} src={'/github.png'}></Image>
            <p className={`${jura.className}`}>github.com/kdotambuj</p>

          </div>
        </div>



        {/* Vinyl */}

        <Image className="absolute right-5 bottom-2 animate-spin-slow " height={160} width={160} quality={100} alt={"Vinyl"} src={'/vinyl.png'}></Image>


      </div>


<div className="flex items-center justify-center gap-6 mt-20 h-[20vh] w-full">

  <input
    value={timerSeconds / 60}
    type="number"
    onChange={(e) => handleTimer(e.target.value)}
    placeholder="Focus Time (min)"
    className="w-40 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
  />

  <div className="flex gap-4">
    <button
      onClick={handleStart}
      className="px-5 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition"
    >
      Start
    </button>

    <button
      onClick={handlePause}
      className="px-5 py-2 rounded-lg bg-yellow-500 text-white font-medium hover:bg-yellow-600 transition"
    >
      Pause
    </button>

    <button
      onClick={handleReset}
      className="px-5 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition"
    >
      Reset
    </button>
  </div>

</div>


    </div>



  )
}