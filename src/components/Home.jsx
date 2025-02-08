import { Link } from "react-router-dom"

const Home = () => {
  return (
    <section className="realtive">
      <div className="container mx-auto px-4 flex flex-col-reverse lg:flex-row items-center gap-12 mt-14 lg:mt-28">
        <div className="flex flex-1 flex-col items-center">
        <h1 className="text-cc-dblue font-semibold text-3xl md:text-4 lg:text-5xl text-center mb-8"><span className="font-light text-[15px] md:text-md lg:text-[30px]">Welcome to<br /></span>Career Crush
        </h1>
        <div className="flex justify-center flex-wrap gap-6 mt-3">
          <Link to={'/company-signup'}><button className="btn btn-purple">Signup - Recruiters</button></Link>
          <Link to={'/student-signup'}><button className="btn btn-white">Signup - Student</button></Link>
        </div>
        <p className="text-white/60 font-bold text-lg md:text-3xl mt-[200px] lg:mt-[120px] md:tracking-wider">You don&apos;t need love, you need a job!</p>
      </div>
    </div>
    </section>

  )
}

export default Home