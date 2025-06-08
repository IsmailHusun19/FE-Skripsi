import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import LogoLogin from "../assets/Forgot password-rafiki.svg";
import { Report } from 'notiflix/build/notiflix-report-aio';
import { reqOtp } from '../config/FetchingData';
import { Loading } from "notiflix/build/notiflix-loading-aio";

  

const LupaPassword = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [getDataAkun, setDataAkun] = useState({
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataAkun({
      ...getDataAkun,
      [name]: value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const req = await reqOtp({email : getDataAkun.email})
      console.log(req)
      if(req){
        Report.success(
          "Success, OTP terkirim ke email",
          "",
          "Okay",
          {
            backOverlay: false,
            messageFontSize: "16px",
            cssAnimation: true,
            cssAnimationStyle: "zoom",
            position: "center-center",
          })
          setTimeout(() => {
            navigate(`/lupa-password-code/${req.otpId}`);
          }, 500);
      }else{
        Report.failure(
          "Gagal, email tidak terdaftar",
          "",
          "Okay",
          {
            backOverlay: false,
            messageFontSize: "16px",
            cssAnimation: true,
            cssAnimationStyle: "zoom",
            position: "center-center",
          })
      }
      console.log(req)
    } catch (error) {
      Report.failure(
        'Gagal!',
        '',
        'Okay',
        {
          backOverlay: false,
        }
      );
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    loading ? Loading.standard() : Loading.remove();
  }, [loading]);
  

  return (
    <div className="flex h-screen min-h-[600px] flex-1 flex-col justify-center px-2 py-12 lg:px-8 bg-gray-200 overflow-y-hidden">
      <div className="relative isolate px-6 pt-0 lg:px-8 flex flex-col items-center justify-center">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" 
            style={{
              clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }} 
          />
        </div>
        <div className="flex justify-center w-[100%] md:[90%]">
          <div className="flex justify-center flex-col gap-6 w-[100%] max-w-[400px] bg-gray-50 bg-opacity-60 p-6 rounded-lg md:rounded-tr-none md:rounded-br-none">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-indigo-600">Please enter your email</h2>
            </div>
            <div className="mt-5 w-full sm:max-w-sm">
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-900">Email address</label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      onChange={handleChange}
                      className="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 font-nomal md:font-semibold lg:font-semibold xl:font-semibold shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="w-[100%] max-w-[400px] hidden justify-center bg-slate-700 p-6 rounded-tr-lg rounded-br-lg md:flex">
            <img className="mt-16 w-[150%] max-w-[400px]" src={LogoLogin} alt=""/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LupaPassword;
