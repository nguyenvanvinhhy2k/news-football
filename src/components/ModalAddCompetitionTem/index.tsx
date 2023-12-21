import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Modal from 'components/Modal'
import userAPI from "@/services/users.service";
import moviesAPI from "@/services/movies.service";
import cinemasAPI from "@/services/cinemas.service";
import ReactSelect from 'react-select';
import useQueryParams from "@/hooks/useQueryParams";
import screeningsAPI from "@/services/screenings.service";
import TextEditor from "../TextEditor";

const schema = yup.object().shape({
	name: yup.string().required("Vui lòng nhập name"),
	startTime:yup.string().required("Vui lòng nhập trailer"),
	endTime: yup.string().required("Vui lòng nhập duration")
})

type IProps = {
	showModalAdd: boolean
	setShowModalAdd: React.Dispatch<React.SetStateAction<boolean>>
	callBack: () => void
}

const ModalAddCompetitionTem = ({ setShowModalAdd, showModalAdd, callBack }: IProps) => {
  const [movies, setMovies] = useState<any>([]);
  const [categories, setCategories] = useState<any>([])
	const [params, setQueryParams] = useQueryParams()
	const { page, size, cinemaId, movieId } = params

	const {
		register,
		handleSubmit,
		formState,
    control,
		reset,
    setValue
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			name: '',
			startTime: '',
			endTime: ''
		}
	})

	const { errors, isDirty }: any = formState;

	const addScreen = async (data: any) => {
		try {
			const res = await screeningsAPI.addScreenings({
				name: data.name,
				movieId: movieId,
				cinemaId: cinemaId,
				startTime: data.startTime,
				endTime: data.endTime,
			})
			if (res?.data?.status === 'error') {
				toast.error(res?.data?.message)
			} else {
				callBack && callBack()
				toast.success('Thêm phim thành công.')
				setShowModalAdd(false)
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

		const getDataListMovies = async () => {
			try {
				const data = await moviesAPI.getMovies({cinemaId, page, size})
				setMovies(data?.data?.data)
			} catch (error) {
				console.log(error)
			}
			}

		useEffect(() => {
			if(cinemaId) {
			getDataListMovies()
			}
		},[cinemaId])

	  useEffect(() => {
			getDataListCinemas()
	},[])

	useEffect(() => {
		reset({
			name: '',
			startTime: '',
			endTime: ''
		})
	}, [ setShowModalAdd, showModalAdd])
	return (
		<Modal
			title="Thêm thông tin phim"
			open={showModalAdd}
			handleCancel={() => setShowModalAdd(false)}
			handleConfirm={handleSubmit(addScreen)}
			className="w-full max-w-[475px]"
			confirmButtonTitle="Lưu"
		>
			<div className="flex flex-col">
				<div className="my-2">
					<div className="flex items-center">
						<span className="w-[140px] font-medium text-base">
						Tên đội thi đấu:
						</span>
						<div className="flex-1">
              <input
								placeholder="Nhập tên trận đấu"
								type="text"
								{...register("name")}
								className="form-control w-full"
							/>
                {/* <TextEditor
                  register={register(`name`)}
                  control={control}
                  name={`name`}
                  error={errors?.questionContent}
                  className="col-12 "
                  setValue={setValue}
                  initContent={''}
                /> */}
						</div>
					</div>
					{errors?.name && (
						<p className="text-sm text-red-700 mt-1 ml-1 m-auto pl-[140px]">
							{errors?.name?.message}
						</p>
					)}
				</div>
        <div className="my-2">
					<div className="flex items-center">
						<span className="w-[140px] font-medium text-base">
						Tên giải đấu:
						</span>
						<div className="flex-1">
              <input
								placeholder="Nhập tên trận đấu"
								type="text"
								{...register("name")}
								className="form-control w-full"
							/>
                {/* <TextEditor
                  register={register(`name`)}
                  control={control}
                  name={`name`}
                  error={errors?.questionContent}
                  className="col-12 "
                  setValue={setValue}
                  initContent={''}
                /> */}
						</div>
					</div>
					{errors?.name && (
						<p className="text-sm text-red-700 mt-1 ml-1 m-auto pl-[140px]">
							{errors?.name?.message}
						</p>
					)}
				</div>


				{/* <div className="my-2">
					<div className="flex items-center ">
							<label className="w-[140px] font-medium text-base">Rạp chiếu: </label>
							<ReactSelect
								options={categories?.map((subject: any) => {
									return {
										value: subject.id,
										label: subject.name
									};
								}
								)}
								onChange={(value: any) => {
									setQueryParams({
										...params, page: page, size: size, cinemaId: value ? value.value : undefined,
										category: undefined,
									}, true)
								}}
								value={
									categories?.filter((item: any) => item.id == cinemaId).map((item: any) => {
										return {
											value: item.id,
											label: item.name
										}
									})
								}
								className="w-60 flex-1"
								isClearable
								classNamePrefix="select-input__custom "
								placeholder="Chọn rạp chiếu"
							/>
						</div>
						{errors?.cinemaId && (
							<p className="text-sm text-red-700 mt-1 ml-1 m-auto pl-[140px]">
								{errors?.cinemaId?.message}
							</p>
						)}
					</div>
				<div className="my-2">
					<div className="flex items-center">
						<span className="w-[140px] font-medium text-base">
							Tên phim:
						</span>
						<ReactSelect
								options={movies?.map((subject: any) => {
									return {
										value: subject.id,
										label: subject.title
									};
								}
								)}
								onChange={(value: any) => {
									setQueryParams({
										...params, page: page, size: size, movieId: value ? value.value : undefined,
										category: undefined,
									}, true)
								}}
								value={
									movies?.filter((item: any) => item.id == movieId).map((item: any) => {
										return {
											value: item.id,
											label: item.title
										}
									})
								}
								className="w-60 flex-1"
								isClearable
								classNamePrefix="select-input__custom "
								placeholder="Chọn phim"
							/>
					</div>
					{errors?.movieId && (
						<p className="text-sm text-red-700 mt-1 ml-1 m-auto pl-[140px]">
							{errors?.movieId?.message}
						</p>
					)}
				</div>
				<div className="my-2">
					<div className="flex items-center">
						<span className="w-[140px] font-medium text-base">Bắt đầu:</span>
						<div className="flex-1">
							<input
								placeholder="Nhập Độ dài phim"
								type="time"
								{...register("startTime")}
								className="form-control w-full"
							/>
						</div>
					</div>
					{errors?.duration && (
						<p className="text-sm text-red-700 mt-1 ml-1 m-auto pl-[140px]">
							{errors?.duration?.message}
						</p>
					)}
				</div>

				<div className="my-2">
					<div className="flex items-center">
						<span className="w-[140px] font-medium text-base">Kết thúc:</span>
						<div className="flex-1">
							<input
								placeholder="Nhập Độ dài phim"
								type="time"
								{...register("endTime")}
								className="form-control w-full"
							/>
						</div>
					</div>
					{errors?.endTime && (
						<p className="text-sm text-red-700 mt-1 ml-1 m-auto pl-[140px]">
							{errors?.endTime?.message}
						</p>
					)}
				</div> */}



			</div>
		</Modal>
	)
}

export default ModalAddCompetitionTem
