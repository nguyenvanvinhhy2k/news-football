import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useEffect } from "react"
import { toast } from "react-toastify"
import Modal from 'components/Modal'
import userAPI from "@/services/users.service";
import moviesAPI from "@/services/movies.service";
import cinemasAPI from "@/services/cinemas.service";
import TextEditor from "../TextEditor";

const schema = yup.object().shape({
	name: yup.string().required("Vui lòng nhập name"),
	address: yup.string().required("Vui lòng nhập address"),
	city:yup.string().required("Vui lòng nhập city"),
})

type IProps = {
	showModalAdd: boolean
	setShowModalAdd: React.Dispatch<React.SetStateAction<boolean>>
	callBack: () => void
}

const ModalAddPosts = ({ setShowModalAdd, showModalAdd, callBack }: IProps) => {

	const {
		register,
		handleSubmit,
		formState,
		reset,
    control,
    setValue
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			name: '',
			address: '',
			city: '',
		}
	})

	const { errors, isDirty }: any = formState;

	const addUser = async (data: any) => {
		try {
			const res = await cinemasAPI.addCinemas({
				name: data.name,
				address: data.address,
				city: data.city,
			})
			if (res?.data?.status === 'error') {
				toast.error(res?.data?.message)
			} else {
				callBack && callBack()
				toast.success('Thêm bài viết thành công.')
				setShowModalAdd(false)
			}
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		reset({
			name: '',
			address: '',
			city: '',
		})
	}, [ setShowModalAdd, showModalAdd])
	return (
		<Modal
			title="Thêm thông tin bài viết"
			open={showModalAdd}
			handleCancel={() => setShowModalAdd(false)}
			handleConfirm={handleSubmit(addUser)}
			className="w-full max-w-[675px]"
			confirmButtonTitle="Lưu"
		>
			<div className="flex flex-col">
				<div className="my-2">
					<div className="flex items-center">
						<span className="w-[140px] font-medium text-base">
						Tên bài viết:
						</span>
						<div className="flex-1">
							<input
								placeholder="Nhập tên bài viết"
								type="text"
								{...register("name")}
								className="form-control w-full"
							/>
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
            Tag:
						</span>
						<div className="flex-1">
							<input
								placeholder="Nhập tag"
								type="text"
								{...register("city")}
								className="form-control w-full"
							/>
						</div>
					</div>
					{errors?.city && (
						<p className="text-sm text-red-700 mt-1 ml-1 m-auto pl-[140px]">
							{errors?.city?.message}
						</p>
					)}
				</div>
				<div className="my-2">
					<div className="flex flex-col">
						<span className="w-[140px] mb-[10px] font-medium text-base">
							Nội dung:
						</span>
						<div className="flex-1 w-full">
                <TextEditor
                  register={register(`name`)}
                  control={control}
                  name={`name`}
                  error={errors?.questionContent}
                  className="col-22 "
                  setValue={setValue}
                  initContent={''}
                />
						</div>
					</div>
					{errors?.address && (
						<p className="text-sm text-red-700 mt-1 ml-1 m-auto pl-[140px]">
							{errors?.address?.message}
						</p>
					)}
				</div>
			</div>
		</Modal>
	)
}

export default ModalAddPosts
