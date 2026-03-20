import SignInForm from "@/components/auth/SignInForm";

export default function SignInPage() {
  return (
    <main className="w-full flex flex-row justify-around">
      <section className="w-1/3">
          <SignInForm/>
      </section>
      <div className="border-l max-h-full"/>
      <section className="w-2/3 flex items-center justify-center">
          <img src="https://res.cloudinary.com/dxhree9z7/image/upload/v1773993052/signimage_eslrxu.png" alt="Signup" className="max-w-full h-auto object-contain scale-x-[-1]"/>
      </section>
    </main>
  )
}
