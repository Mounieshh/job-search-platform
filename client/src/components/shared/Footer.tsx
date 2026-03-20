
const Footer = () => {
  return (
    <footer className="border-t bg-black text-white py-8 flex flex-col md:flex-row items-center md:justify-around gap-4 text-center md:text-left">
        <div className="uppercase italic font-bold text-2xl">
            Jobbify
        </div>

        <div>
            <h3>
                © {new Date().getFullYear()}{" "}
                <span className="font-bold italic">MOUNIESH</span>
            </h3>
        </div>
    </footer>
  )
}

export default Footer