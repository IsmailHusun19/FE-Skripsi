import LogoUnbaja from "../assets/unbaja-logo.png";

const KopSurat = () => {
  return (
    <div className="hidden print:block w-full">
    <div className="flex justify-between items-center w-full gap-5">
      <img className="w-32" src={LogoUnbaja} alt="" />
      <div className=" text-center w-full">
        <h2 className="font-bold text-xl">
          UNIVERSITAS BANTEN JAYA
        </h2>
        <p className="text-sm">
          Kampus 1 : Jl. Ciwaru Raya No.73, Kota Serang
        </p>
        <p className="text-sm">
          Kampus 2 : Jl. Syekh Moh. Nawawi Albantani, Kp. Boru,
          Kec. Curug, Kota Serang
        </p>
        <p className="text-sm">
          Website : www.unbaja.ac.id, e-Mail : info@unbaja.ac.id
        </p>
      </div>
    </div>
    <div className="w-full mt-2">
      <div className="border-t-4 border-black"></div>
      <div className="border-t border-black mt-1"></div>
    </div>
  </div>
  );
};

export default KopSurat;
