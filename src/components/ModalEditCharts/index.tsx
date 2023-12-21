import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Modal from 'components/Modal'
import userAPI from "@/services/users.service";
import { useAuth } from "@/contexts/auth";
import bookingAPI from "@/services/bookings.service";
import dayjs from "dayjs";

type IProps = {
	itemBookings: Object | any
	showModalEdit: boolean
	setShowModalEdit: React.Dispatch<React.SetStateAction<boolean>>
	callBack: () => void
}

const schema = yup.object().shape({
	userId: yup.string().required("Trường này bắt buộc nhập"),
	movieId: yup.string().required("Trường này bắt buộc nhập"),
	bookingDate: yup.string().required("Trường này bắt buộc nhập"),
	status: yup.string().required("Trường này bắt buộc nhập"),
})


const actionsStatus = [
	{
		value: "DADAT",
		label: "Chờ xử lí"
	},
	{
		value: "DAXACNHAN",
		label: "Xác nhận"
	},
	{
		value: "DANGXEMPHIM",
		label: "Đang xem phim"
	},
	{
		value: "HUYTOUR",
		label: "Đã hủy"
	},
	{
		value: "DAHOANTHANH",
		label: "Đã hoàn thành"
	}
]

const ModalEditCharts = ({ showModalEdit, setShowModalEdit, itemBookings, callBack }: IProps) => {

	console.log(itemBookings)

	const formatDate = (date: Date, format: string) => {
		return dayjs(date).format(format);
	}

	const {
		register,
		handleSubmit,
		formState,
		reset
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			userId: itemBookings?.movies?.title,
			movieId: itemBookings?.user?.name,
			bookingDate: '',
			status: itemBookings?.status,
		}
	})

	console.log(itemBookings)

	const { errors, isDirty }: any = formState;

	const updatePost = async (data: any) => {
		try {
			const res = await bookingAPI.updateBookings(itemBookings?.id, {
				userId: itemBookings?.userId,
				movieId: itemBookings?.movieId,
				bookingDate: itemBookings?.bookingDate,
				status: data?.status,
			})
			setShowModalEdit(false)
			if (res?.data?.status === 'error') {
				toast.error(res?.data?.message)
			} else {
				callBack && callBack()
				toast.success('Cập nhật thông tin thành công.')
			}
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		reset({
			userId: itemBookings?.movies?.title,
			movieId: itemBookings?.user?.name,
			bookingDate: '',
			status: itemBookings?.status,
		})
	}, [itemBookings, setShowModalEdit, showModalEdit])
	return (
		<>
			<Modal
				title="Thêm bảng xếp hạng"
				open={showModalEdit}
				handleCancel={() => setShowModalEdit(false)}
				handleConfirm={handleSubmit(updatePost)}
				className="w-full max-w-[475px]"
				confirmButtonTitle="Lưu"
			>
				<div className="flex flex-col">
					<div className="my-2">
						<div className="flex items-center">
							<span className="w-[140px] font-medium text-base">
								Tên giải đấu:
							</span>
							<div className="flex-1">
								<input
									type="text"
									{...register("userId")}
									// disabled={true}
									className="form-control w-full"
								/>
							</div>
						</div>
						{errors?.tourName && (
							<p className="text-sm text-red-700 mt-1 ml-1 m-auto pl-[140px]">
								{errors?.tourName?.message}
							</p>
						)}
					</div>
					<div className="my-2">
						<div className="flex items-center">
							<span className="w-[140px] font-medium text-base">
							Tên đội bóng:
							</span>
							<div className="flex-1">
								<input
									type="text"
									{...register("movieId")}
									className="form-control w-full"
									// disabled={true}
								/>
							</div>
						</div>
						{errors?.username && (
							<p className="text-sm text-red-700 mt-1 ml-1 m-auto pl-[140px]">
								{errors?.username?.message}
							</p>
						)}
					</div>
					<div className="my-2">
						<div className="flex items-center">
							<span className="w-[140px] font-medium text-base">Số trận thi đấu:</span>
							<div className="flex-1">
								<input
									// placeholder="Nhập số điện thoại"
									type="text"
									{...register("bookingDate")}
									className="form-control w-full"
									// disabled={true}
								/>
							</div>
						</div>
						{errors?.bookingDate && (
							<p className="text-sm text-red-700 mt-1 ml-1 m-auto pl-[140px]">
								{errors?.bookingDate?.message}
							</p>
						)}
					</div>

          <div className="my-2">
						<div className="flex items-center">
							<span className="w-[140px] font-medium text-base">Thắng:</span>
							<div className="flex-1">
								<input
									// placeholder="Nhập số điện thoại"
									type="text"
									{...register("bookingDate")}
									className="form-control w-full"
									// disabled={true}
								/>
							</div>
						</div>
						{errors?.bookingDate && (
							<p className="text-sm text-red-700 mt-1 ml-1 m-auto pl-[140px]">
								{errors?.bookingDate?.message}
							</p>
						)}
					</div>

          <div className="my-2">
						<div className="flex items-center">
							<span className="w-[140px] font-medium text-base">Hòa:</span>
							<div className="flex-1">
								<input
									// placeholder="Nhập số điện thoại"
									type="text"
									{...register("bookingDate")}
									className="form-control w-full"
									// disabled={true}
								/>
							</div>
						</div>
						{errors?.bookingDate && (
							<p className="text-sm text-red-700 mt-1 ml-1 m-auto pl-[140px]">
								{errors?.bookingDate?.message}
							</p>
						)}
					</div>

          <div className="my-2">
						<div className="flex items-center">
							<span className="w-[140px] font-medium text-base">Thua:</span>
							<div className="flex-1">
								<input
									// placeholder="Nhập số điện thoại"
									type="text"
									{...register("bookingDate")}
									className="form-control w-full"
									// disabled={true}
								/>
							</div>
						</div>
						{errors?.bookingDate && (
							<p className="text-sm text-red-700 mt-1 ml-1 m-auto pl-[140px]">
								{errors?.bookingDate?.message}
							</p>
						)}
					</div>

          <div className="my-2">
						<div className="flex items-center">
							<span className="w-[140px] font-medium text-base">Hiệu số:</span>
							<div className="flex-1">
								<input
									// placeholder="Nhập số điện thoại"
									type="text"
									{...register("bookingDate")}
									className="form-control w-full"
									// disabled={true}
								/>
							</div>
						</div>
						{errors?.bookingDate && (
							<p className="text-sm text-red-700 mt-1 ml-1 m-auto pl-[140px]">
								{errors?.bookingDate?.message}
							</p>
						)}
					</div>

					{/* <div className="my-2">
						<div className="flex items-center">
							<span className="w-[140px] font-medium text-base">Trạng thái:</span>
							<div className="flex-1">
							<select {...register("status")} id="crud-form-1" className="form-control w-full" >
									<option value={itemBookings?.status} className="hidden" selected >{itemBookings?.status === "DADAT" ? "Chờ xử lí" : itemBookings.status === "DAXACNHAN" ? "Đã xác nhận" : itemBookings.status === "DANGXEMPHIM" ? "Đang xem phim" : itemBookings.status === "HUYTOUR" ? "Đã hủy" : itemBookings?.status === "DAHOANTHANH" && "Đã hoàn thành" }</option>
									{
										actionsStatus?.map((cate: any) => (
												<option key={cate?.value} value={cate?.value}>{cate?.label}</option>
										))
									}
								</select>
							</div>
						</div>
						{errors?.status && (
							<p className="text-sm text-red-700 mt-1 ml-1 m-auto pl-[140px]">
								{errors?.status?.message}
							</p>
						)}
					</div> */}

				</div>
			</Modal>
		</>
	)
}

export default ModalEditCharts
