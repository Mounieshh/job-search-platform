import SignInForm from "@/components/auth/SignInForm";

export default function SignInPage() {
  return (
    <main className="w-full flex flex-col md:flex-row">
      <section className="w-full md:w-1/3">
          <SignInForm/>
      </section>
      <div className="border-t md:border-t-0 md:border-l border-gray-200"/>
        <section className="hidden w-full md:flex md:w-2/3 items-center justify-center p-4 md:p-8">
          <img src="https://res.cloudinary.com/dxhree9z7/image/upload/v1773993052/signimage_eslrxu.png" alt="Signup" className="max-w-full h-auto object-contain scale-x-[-1]"/>
      </section>
    </main>
  )
}
