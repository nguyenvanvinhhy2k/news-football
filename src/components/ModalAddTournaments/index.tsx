import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Modal from 'components/Modal'
import moviesAPI from "@/services/movies.service";
import cinemasAPI from "@/services/cinemas.service";
import useQueryParams from "@/hooks/useQueryParams";
import { getCachedData } from "@/utils/storage";
import { ACCESS_TOKEN } from "@/contants/auth";
import axios from "axios";

const schema = yup.object().shape({
	title: yup.string().required("Vui lòng nhập title"),
	descristion: yup.string().required("Vui lòng nhập description"),
	duration: yup.number().typeError("Trường này bắt buộc nhập số").required("Trường này bắt buộc nhập"),
	director: yup.string().required("Vui lòng nhập startDate"),
	cinemaId: yup.string().required("Vui lòng nhập cateId"),
	genre: yup.number().typeError("Trường này bắt buộc nhập số"),
	trailer: yup.string().required("Vui lòng nhập transport")
})

type IProps = {
	showModalAdd: boolean
	setShowModalAdd: React.Dispatch<React.SetStateAction<boolean>>
	callBack: () => void
}

const ModalAddTournaments = ({ setShowModalAdd, showModalAdd, callBack }: IProps) => {
	const [poster, setPoster] = useState<any>(null);
	const [banner, setBanner] = useState<any>(null);
  const [categories, setCategories] = useState<any>([])
	const [params, setQueryParams] = useQueryParams()
	const { page, limit, category } = params

	const {
		register,
		handleSubmit,
		formState,
		reset,
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			title: '',
			descristion: '',
			duration: '',
			director: '',
			cinemaId: '',
			genre: '',
			trailer: ''
		}
	})

	const { errors, isDirty }: any = formState;
	const accessToken = getCachedData(ACCESS_TOKEN)

	const addTour = async (data: any) => {
		const formData = new FormData()
		formData.append("title", data.title)
		formData.append("descristion", data.descristion)
		formData.append("duration", data.duration)
		formData.append("banner", banner) //flie của banner
		formData.append("poster", poster) //file của poster
		formData.append("director", data.director)
		formData.append("cinemaId", data.cinemaId)
		formData.append("price", '0')
		formData.append("genre", data.genre)
		formData.append("trailer", data.trailer)
	try {
		const res = await axios({
			method: 'post',
			url: 'http://localhost:8228/v1/movies',
			headers: {
				Authorization: 'Bearer ' + accessToken, //the token is a variable which holds the token
				"Content-Type": `multipart/form-data; boundary=${formData}`
			},
			data: formData
		})
		//check lại res
		if (res?.data?.status === 'error') {
			toast.error(res?.data?.message)
		} else {
			callBack && callBack()
			toast.success('Thêm phim thành công.')
			setShowModalAdd(false)
			setBanner(null)
			setPoster(null)
		}
	} catch (error) {
		console.log(error)
	}
}


	const getDataListCinemas = async () => {
		try {
		  const data = await cinemasAPI.getCinemas({size: 999})
		  setCategories(data?.data?.data)
		} catch (error) {
		  console.log(error)
		}
	  }

	  useEffect(() => {
			getDataListCinemas()
	},[])

	useEffect(() => {
		reset({
			title: '',
			descristion: '',
			duration: '',
			director: '',
			cinemaId: '',
			genre: '',
			trailer: ''
		})
	}, [ setShowModalAdd, showModalAdd])
	return (
		<Modal
			title="Thêm thông tin giải đấu"
			open={showModalAdd}
			handleCancel={() => setShowModalAdd(false)}
			handleConfirm={handleSubmit(addTour)}
			className="w-full max-w-[500px]"
			confirmButtonTitle="Lưu"
		>
			<div className="flex flex-col">
				<div className="flex justify-between">
				<div className="w-full">
				<div className="my-2">
					<div className="flex items-center">
						<span className="w-[140px] font-medium text-base">
							Tên giải đấu:
						</span>
						<div className="flex-1">
							<input
								placeholder="Nhập tên giải đấu"
								type="text"
								{...register("title")}
								className="form-control w-full"
							/>

              {/* <iframe className="flex-1" src="https://devforum.info/DEMO/phaohoa/" /> */}
						</div>
					</div>
					{errors?.title && (
						<p className="text-sm text-red-700 mt-1 ml-1 m-auto pl-[140px]">
							{errors?.title?.message}
						</p>
					)}
				</div>

				</div>
				</div>
			</div>
		</Modal>
	)
}

export default ModalAddTournaments
