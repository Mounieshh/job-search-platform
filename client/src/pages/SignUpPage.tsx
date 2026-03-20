import SignUpForm from '@/components/auth/SignUpForm'

export default function SignUpPage() {
  return (
    <main className="w-full flex flex-row">
      <section className="w-2/3 flex items-center justify-center">
          <img src="https://res.cloudinary.com/dxhree9z7/image/upload/v1773993052/signimage_eslrxu.png" alt="Signup" className="max-w-full h-auto object-contain"/>
      </section>
      <div className="border-l max-h-full"/>
      <section className="w-1/3">
          <SignUpForm/>
      </section>
    </main>
  )
}
