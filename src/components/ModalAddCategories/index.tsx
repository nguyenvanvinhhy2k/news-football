import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Modal from 'components/Modal'
import userAPI from "@/services/users.service";
import ticketAPI from "@/services/tickets.service";
import ReactSelect from 'react-select';
import useQueryParams from "@/hooks/useQueryParams";
import screeningsAPI from "@/services/screenings.service";

const schema = yup.object().shape({
	seatNumber: yup.string().required("Vui lòng nhập seatNumber"),
	price: yup.string().required("Vui lòng nhập price"),
})

type IProps = {
	showModalAdd: boolean
	setShowModalAdd: React.Dispatch<React.SetStateAction<boolean>>
	callBack: () => void
}

const ModalAddCategories = ({ setShowModalAdd, showModalAdd, callBack }: IProps) => {
	const [params, setQueryParams] = useQueryParams()
	const { page, size, cinemaId, screeningId } = params
	const [screenings, setScreenings] = useState<any>([])

	const {
		register,
		handleSubmit,
		formState,
		reset,
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			seatNumber: '',
			price: '',
		}
	})

	const { errors, isDirty }: any = formState;

	const addUser = async (data: any) => {
		try {
			const res = await ticketAPI.addTicket({
				screeningId: screeningId,
				seatNumber: data.seatNumber,
				price: data.price,
			})
			if (res?.data?.status === 'error') {
				toast.error(res?.data?.message)
			} else {
				callBack && callBack()
				toast.success('Thêm vé thành công.')
				setShowModalAdd(false)
			}
		} catch (error) {
			console.log(error)
		}
	}


	const getDataListScreenings = async () => {
		try {
		  const data = await screeningsAPI.getScreenings({size: 999})
		  setScreenings(data?.data?.data)
		} catch (error) {
		  console.log(error)
		}
	  }

		useEffect(() => {
			getDataListScreenings()
		},[])

	useEffect(() => {
		reset({
			seatNumber: '',
			price: '',
		})
	}, [ setShowModalAdd, showModalAdd])
	return (
		<Modal
			title="Thêm thông tin danh mục"
			open={showModalAdd}
			handleCancel={() => setShowModalAdd(false)}
			handleConfirm={handleSubmit(addUser)}
			className="w-full max-w-[475px]"
			confirmButtonTitle="Lưu"
		>
			<div className="flex flex-col">
				<div className="my-2">
					<div className="flex items-center">
						<span className="w-[140px] font-medium text-base">
							Tên danh mục:
						</span>
						<div className="flex-1">
							<input
								placeholder="Nhập tên danh mục"
								type="text"
								{...register("price")}
								className="form-control w-full"
							/>
						</div>
					</div>
					{errors?.price && (
						<p className="text-sm text-red-700 mt-1 ml-1 m-auto pl-[140px]">
							{errors?.price?.message}
						</p>
					)}
				</div>
			</div>
		</Modal>
	)
}

export default ModalAddCategories
