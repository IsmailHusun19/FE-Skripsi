import { getAllFeedbackSistem } from "../../config/FetchingData";
import React, { useEffect, useState, useContext } from "react";
import MenuSlideBar from "../../component/Admin/MenuSlidebar";
import { SidebarContext } from "../../component/Admin/SidebarContextProvider";
import { useNavigate } from "react-router-dom";

const FeedbackSistem = () => {
  const [feedbackSistem, setFeedbackSistem] = useState([]);
  const { expanded } = useContext(SidebarContext);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  const getData = async () => {
    setLoading(true);
    try {
      const getDatafeedback = await getAllFeedbackSistem();
      setFeedbackSistem(getDatafeedback.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {!loading ? (
        <div className="relative overflow-x-hidden">
          <MenuSlideBar />
          <div className="h-[calc(100vh-64px)] pb-5">
            <div
              className={`grid gap-3 mr-5 transition-all duration-300 ${
                expanded ? "sm:ml-72" : "ml-20"
              } grid-cols-1 sm:[grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]`}
            >
              <section className="dark:bg-gray-900 w-full">
                <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
                  <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden my-10">
                    <h1 className="font-semibold text-xl px-5 pt-5">
                      Feedback Sistem
                    </h1>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 py-4">
                      <div className="w-full md:w-1/2">
                        <form className="flex items-center">
                          <label htmlFor="simple-search" className="sr-only">
                            Search
                          </label>
                          <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <svg
                                aria-hidden="true"
                                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <input
                              type="text"
                              id="simple-search"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                              placeholder="Cari nama, email, atau telepon..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                        </form>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                            Dari Tanggal
                          </label>
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-white bg-white dark:bg-gray-800 focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                            Sampai Tanggal
                          </label>
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-white bg-white dark:bg-gray-800 focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                            <th scope="col" className="px-4 py-3">No</th>
                            <th scope="col" className="px-4 py-3">Nama</th>
                            <th scope="col" className="px-4 py-3">Email</th>
                            <th scope="col" className="px-4 py-3">No Telepon</th>
                            <th scope="col" className="px-4 py-3 min-w-56">Pesan</th>
                            <th scope="col" className="px-4 py-3 min-w-36">Tanggal</th>
                            <th scope="col" className="px-4 py-3">Info</th>
                          </tr>
                        </thead>
                        <tbody>
                          {feedbackSistem
                            .filter((feedback) => {
                              const lowerSearch = searchTerm.toLowerCase();
                              const tanggal = new Date(feedback.tanggal);

                              const isMatchSearch =
                                feedback.nama.toLowerCase().includes(lowerSearch) ||
                                feedback.email.toLowerCase().includes(lowerSearch) ||
                                feedback.noTelp.toLowerCase().includes(lowerSearch);

                              const isInDateRange =
                                (!startDate || tanggal >= new Date(startDate)) &&
                                (!endDate || tanggal <= new Date(endDate));

                              return isMatchSearch && isInDateRange;
                            })
                            .map((feedback, index) => (
                              <tr
                                key={feedback.id}
                                className="border-b dark:border-gray-700 text-gray-800 dark:text-gray-200"
                              >
                                <td className="px-4 py-3">{index + 1}</td>
                                <th scope="row" className="px-4 py-3 font-medium whitespace-nowrap">
                                  {feedback.nama}
                                </th>
                                <td className="px-4 py-3">{feedback.email}</td>
                                <td className="px-4 py-3">{feedback.noTelp}</td>
                                <td className="px-4 py-3">{feedback.pesan}</td>
                                <td className="px-4 py-3">
                                  {new Date(feedback.tanggal).toLocaleDateString("id-ID", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                  })}
                                </td>
                                <td className="px-4 py-3">{feedback.info}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default FeedbackSistem;
