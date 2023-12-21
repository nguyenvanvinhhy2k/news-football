
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useEffect, useState } from "react";
import { BookOpen, Bookmark, FileQuestion, Type } from 'lucide-react';
import { Link } from 'react-router-dom';
import bookingAPI from '@/services/bookings.service';
import reviewAPI from '@/services/reviews.service';
import cinemasAPI from '@/services/cinemas.service';
import moviesAPI from '@/services/movies.service';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Home() {
	const [movies, setMovies] = useState<any>()
	const [cinemas, setCinemas] = useState<any>()
	const [booking, setBooking] = useState<any>()
	const [review, setReview] = useState<any>()
	const [booinge, setBooinge] = useState<any>({
    labels: [],
    datasets: [{}]
  })

	const getStatistical = async () => {
		const [movies, bookings, cinemas, reviews, booingges] =	await Promise.all([
			moviesAPI.getMovies(),
			bookingAPI.getBookings(),
			cinemasAPI.getCinemas(),
			reviewAPI.getReviews(),
			moviesAPI.getMoviesBooinges()
		]);

		let labels = booingges?.data?.data?.map((filmName: any) => {
			if (filmName?.title?.length > 20) return filmName.title.substring(0, 20) + '...';
      return filmName.title
    })

		let datasets = [
      {
        label: 'Số lượng đặt',
        data: booingges?.data?.data?.map((item: any) => item.numberBooking)
      }
    ]
    const dataChart = {
      labels,
      datasets
    }

		setBooinge(dataChart)
		setMovies(movies?.data?.total)
		setCinemas(cinemas?.data?.total)
		setBooking(bookings?.data?.total)
		setReview(reviews?.data?.total)
	}

	const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Top 10 phim được đặt nhiều nhất',
        font: {
          size: 20
        }
      },
    },
    barPercentage: 1,
    categoryPercentage: 0.5,
  };

	useEffect(() => {
		getStatistical()
	},[])
  return (
    <div className="wrapper">
        <div className="wrapper-box">
          <div className="content">
            <div className="intro-y flex items-center mt-8">
              <h2 className="text-xl font-bold mr-auto">Trang chủ</h2>
            </div>
            <div className="grid grid-cols-24 gap-6 mt-1 ">
              <div className="intro-y col-span-12 lg:col-span-6">
                <div className="grid grid-cols-12 gap-6 mt-5">
                  <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                    <Link to={'/movies'} >
                      <div className="report-box zoom-in">
                        <div className="box p-5">
                          <div className="flex">
                            <div className="side-menu__icon text-blue-500 font-bold"><Type /></div>
                          </div>
                          <div className="text-3xl font-medium leading-8 mt-6">{movies ? movies : 12}</div>
                          <div className="text-base text-slate-500 mt-1">Giải đấu</div>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                  <Link to={'/cinemas'} >
                    <div className="report-box zoom-in">
                      <div className="box p-5">
                        <div className="flex">
                          <div className="side-menu__icon text-green-500 font-bold"><BookOpen /></div>
                        </div>
                        <div className="text-3xl font-medium leading-8 mt-6">{cinemas ? cinemas : 256}</div>
                        <div className="text-base text-slate-500 mt-1">Trận đấu</div>
                      </div>
                    </div>
                    </Link>
                  </div>
                  <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                  <Link to={'/bookings'} >
                    <div className="report-box zoom-in">
                      <div className="box p-5">
                        <div className="flex">
                          <div className="side-menu__icon text-red-500 font-bold"><Bookmark /></div>
                        </div>
                        <div className="text-3xl font-medium leading-8 mt-6">{booking ? booking : 69}</div>
                        <div className="text-base text-slate-500 mt-1">Bài viết</div>
                      </div>
                    </div>
                    </Link>
                  </div>
                  <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                  <Link to={'/reviews'} >
                    <div className="report-box zoom-in">
                      <div className="box p-5">
                        <div className="flex">
                          <div className="side-menu__icon text-yellow-500 font-bold"><FileQuestion /></div>
                        </div>
                        <div className="text-3xl font-medium leading-8 mt-6">{review ? review : 12.434}</div>
                        <div className="text-base text-slate-500 mt-1">Đánh giá</div>
                      </div>
                    </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="py-5">
              <div className="grid grid-cols-2 gap-6 mt-1 ">
                <div className="col-span-2">
                  <div className="intro-y block sm:flex items-center h-10 my-7">
                    <h2 className="text-lg font-medium truncate mr-5">
                      Biều đồ thống kê tin tức bóng đá
                    </h2>
                  </div>
                  <div className=" bg-white p-5">
                    <div className="w-full mx-auto">
                      {
                        booinge?.labels?.length ? <Bar options={options} data={booinge} /> : <>Không có dữ liệu ...</>
                      }
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
