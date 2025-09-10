'use client'
import { Pixelify_Sans } from "next/font/google"
import { Kapakana } from "next/font/google"
import { Jura } from "next/font/google"
import Image from "next/image"

const pixelify = Pixelify_Sans({
  subsets:["latin"]
})

const kapakana = Kapakana({
   subsets:["latin"]
})

const jura = Jura({
  subsets:["latin"]
})


export default function Home(){


  return (


    <div className="flex relative items-center mt-50  h-[13vh] w-full bg-center bg-auto bg-[url('/gradient2.jpeg')] ">
       

       {/* Timer */}
       <div className="h-[75px] flex items-center justify-center w-[170px] bg-[#EADDFF] rounded-l-2xl rounded-r-2xl ml-8">
        <p className="text-black text-5xl font-bold font-sans">50:00</p>

       </div>

       {/* Description */}
       <div className="flex gap-2 ml-10">
        <p className={`${pixelify.className} text-white text-6xl `}>STUDY </p>

        <p className={`${kapakana.className} text-white text-5xl`}>with</p>

        <p className={`${pixelify.className} text-white text-6xl `}>ME </p>

       </div>


       {/* Info */}

       <div className="flex flex-col text-white ml-15 justify-center items-center">

        <p className={`${jura.className} font-bold text-3xl`}>Topic- Solving Leetcode Together</p>

        <div className="flex gap-2">
          <Image height={20} width={25} quality={100} alt={"Github logo"} src={'/github.png'}></Image>
          <p className={`${jura.className}`}>github.com/kdotambuj</p>

        </div>
       </div>


       
        {/* Vinyl */}

       <Image className="absolute right-10 bottom-2 animate-spin-slow " height={170} width={170} quality={100} alt={"Vinyl"} src={'/vinyl.png'}></Image>
   

    </div>



  )
}