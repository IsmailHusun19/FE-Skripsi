import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie for cookie handling
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import LogoLogin from "../assets/LogoLogin.svg";
import Notiflix from "notiflix";
import { Report } from "notiflix/build/notiflix-report-aio";
import { Loading } from "notiflix/build/notiflix-loading-aio";
import { VerifOtp, cekIdTokenRisetPassword  } from '../config/FetchingData';

const CodeLupaPassword = ({ length = 6, onChange }) => {
  const navigate = useNavigate();
  const {id} = useParams();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputsRef = useRef([]);

  const getData = async () => {
    try{
      const getIdToken = await cekIdTokenRisetPassword(id);
      console.log(getIdToken)
      if(!getIdToken){
        navigate('/error')
      }
    }catch(e){
      console.log(e)
    }
  }

  useEffect(() => {
    getData();
  },[id])

  const handleChange = (e, idx) => {
    const val = e.target.value;
    if (/^[0-9]?$/.test(val)) {
      const newOtp = [...otp];
      newOtp[idx] = val;
      setOtp(newOtp);
      onChange && onChange(newOtp.join(""));
      if (val && idx < length - 1) {
        inputsRef.current[idx + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputsRef.current[idx - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(otp.join(""));
    const data = {
        id: id,
        otp: otp.join("")
    }
    setLoading(true);
    try {
      const req = await VerifOtp(data);
      if (req) {
        Report.success("Success", "", "Okay", {
          backOverlay: false,
          messageFontSize: "16px",
          cssAnimation: true,
          cssAnimationStyle: "zoom",
          position: "center-center",
        });
        setTimeout(() => {
          navigate(`/riset-password-code/${id}`);
        }, 500);
      } else {
        Report.failure("Gagal, code salah", "", "Okay", {
          backOverlay: false,
          messageFontSize: "16px",
          cssAnimation: true,
          cssAnimationStyle: "zoom",
          position: "center-center",
        });
      }
      console.log(req);
    } catch (error) {
      Report.failure("Gagal!", "", "Okay", {
        backOverlay: false,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loading ? Loading.standard() : Loading.remove();
  }, [loading]);

  return (
    <div className="flex h-screen min-h-[600px] flex-1 flex-col justify-center px-2 py-12 lg:px-8 bg-gray-200 overflow-y-hidden">
      <div className="relative isolate px-6 pt-0 lg:px-8 flex flex-col items-center justify-center">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <div className="flex justify-center w-[100%] md:[90%]">
          <div className="flex justify-center flex-col gap-6 w-[100%] max-w-[400px] bg-gray-50 bg-opacity-60 p-6 rounded-lg md:rounded-tr-none md:rounded-br-none">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-indigo-600">
                Please enter your code
              </h2>
            </div>
            <div className="mt-5 w-full sm:max-w-sm">
              <form onSubmit={handleSubmit}>
                <div className="flex gap-2 justify-center mb-6">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(e, idx)}
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      ref={(el) => (inputsRef.current[idx] = el)}
                      className="w-10 h-12 text-center text-xl rounded border border-gray-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                    />
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-500"
                >
                  Verify OTP
                </button>
              </form>
            </div>
          </div>
          <div className="w-[100%] max-w-[400px] hidden justify-center bg-slate-700 p-6 rounded-tr-lg rounded-br-lg md:flex">
            <img
              className="mt-16 w-[150%] max-w-[400px]"
              src={LogoLogin}
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeLupaPassword;
