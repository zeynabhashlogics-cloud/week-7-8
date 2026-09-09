import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#ffffff] flex flex-col items-center justify-center">

      <div className="bg-[#6591a6] rounded-lg p-25 w-[900px] text-center flex flex-col">

        <h1 className="text-5xl font-bold mb-4 text-white text-left">
          Plan Less.
        </h1>

        <h1 className="text-5xl font-bold mb-12 text-white text-left">
          Finish More.
        </h1>

        <p className="italic mb-4 font-bold text-sm text-left">
          A calm workspace to create, update, and clear your
          <br />
          tasks - connected to a real Express API.
        </p>

        <div className="flex gap-6">

          <Link
            href="/about"
            className="border px-10 py-3 rounded-md bg-[#b2c7d1] text-black"
          >
            About the project.
          </Link>

          <Link
            href="/tasks"
            className="border px-6 py-3 rounded-md bg-[#b2c7d1] text-black"
          >
            Tasks
          </Link>

        </div>
      </div>

 <div className="w-[900px] h-[100px] bg-[#a3d1e3] border rounded-md border-gray-400 mt-7 flex items-center justify-center gap-6">
  <h1 className = "font-bold text-xl">
    Register or login here now. </h1>
  <Link
    href="/auth/login"
    className="border px-10 py-3 rounded-md bg-[#b2c7d1] text-black"
  >
    Login
  </Link>

  <Link
    href="/auth/register"
    className="border px-10 py-3 rounded-md bg-[#b2c7d1] text-black"
  >
    Register
  </Link>

</div>

    </main>
  );
}