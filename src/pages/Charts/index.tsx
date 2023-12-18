import { useEffect, useState } from 'react'
import InputSearchDebounce from 'components/Form/InputSearchDebounce'
import Pagination from 'components/Pagination'
import 'react-datepicker/dist/react-datepicker.css'
import ReactSelect from 'react-select'
import { Edit, Eye, Plus, Trash2, X } from 'lucide-react'
import Modal from '@/components/Modal'
import { toast } from 'react-toastify'
import bookingAPI from '@/services/bookings.service'
import dayjs from 'dayjs'
import ModalEditBookings from '../../components/ModalEditBookings'
import ModalViewBookings from '../../components/ModalViewBookings'
import useQueryParams from '@/hooks/useQueryParams'
import { useAuth } from '@/contexts/auth'

const actionsStatus = [
	{
		value: "DADAT",
		label: "Chờ xử lí"
	},
	{
		value: "DAXACNHAN",
		label: "Đặt thành công"
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

const Charts = () => {
	const [showModalView, setShowModalView] = useState<boolean>(false);
	const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
	const [showModalEdit, setShowModalEdit] = useState<boolean>(false);
	const [itemBookings, setItemBookings] = useState<any>({});
	const [idBookings, setIdBookings] = useState<any>();
	const [bookings, setBookings] = useState<any>([]);
	const [totalItem, setTotalItem] = useState<number>(0);
	const [params, setQueryParams] = useQueryParams()
	const { page, size, _q, status } = params
	const { user } = useAuth()

	const getDataListBookings = async () => {
		try {
			const data = await bookingAPI.getBookings({ page: page, _q: _q, size: size, status })
			setBookings(data?.data?.data)
			setTotalItem(data?.data?.total)
		} catch (error) {
			console.log(error)
		}
	}

	const handleConfirmDelete = async () => {
		try {
			const res = await bookingAPI.deleteBookings(idBookings)
			setShowModalDelete(false)
			if (res?.data?.status === 'error') {
				toast.error(res?.data?.message)
			} else {
				toast.success('Xóa user thành công.')
				getDataListBookings()
			}
		} catch (error) {
			console.log(error)
		}
	}

	const searchBookings = async () => {
		setQueryParams({
			...params, page: 1, size: size
		}, true)
		try {
			const data = await bookingAPI.getBookings({ page: page, _q: _q, size: size, status })
			setBookings(data?.data?.data)
			setTotalItem(data?.data?.total)
		} catch (error) {
			console.log(error)
		}
	}

	const formatDate = (date: Date, format: string) => {
		return dayjs(date).format(format);
	}

	const handleStatus = (id: any) => {
		setShowModalDelete(true)
		setIdBookings(id)
	}

	const handleView = (item: any) => {
		setShowModalView(true)
		setItemBookings(item)
	}

	const handleUpdate = (item: any) => {
		setShowModalEdit(true)
		setItemBookings(item)
	}

	useEffect(() => {
		if (_q || status) {
			getDataListBookings()
		}
	}, [page, size])

	useEffect(() => {
		if (!_q && !status) {
			getDataListBookings()
		}
	}, [_q, page, size, status])

	return (
		<>
			<ModalViewBookings
				showModalView={showModalView}
				setShowModalView={setShowModalView}
				itemBookings={itemBookings}
				callBack={() => {
					getDataListBookings()
				}}
			/>
			<ModalEditBookings
				showModalEdit={showModalEdit}
				setShowModalEdit={setShowModalEdit}
				itemBookings={itemBookings}
				callBack={() => {
					getDataListBookings()
				}}
			/>
			<Modal
				title="Xóa booking tour"
				open={showModalDelete}
				handleCancel={() => setShowModalDelete(false)}
				handleConfirm={handleConfirmDelete}
			>
				Bạn chắc chắn muốn Xóa tour này chứ?
			</Modal>
			<div className="wrapper">
				<div className="wrapper-box">
					<div className="content">
						<div className="intro-y flex items-center mt-8">
							<h2 className="text-lg font-medium mr-auto">Danh sách booking</h2>
						</div>
						<div className="grid grid-cols-24 gap-6 mt-5 overflow-y-auto">
							<div className="intro-y col-span-12 lg:col-span-6">
								{/* BEGIN: Basic Table */}
								<div className="intro-y box">
									<div className="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 justify-between">
										<div className="flex items-center">
										</div>
										<div className="flex items-center font-medium ">
											<div className="flex items-center w-full mr-[20px]">
												<label className="mr-2">Trạng thái: </label>
												<ReactSelect
													options={actionsStatus?.map((type: { value: string, label: string }) => {
														return {
															value: type?.value,
															label: type?.label
														};
													}
													)}
													onChange={(type: any) => {
														setQueryParams({
															...params, page: page, size: size, status: type?.value,
														}, true)
													}}
													isClearable
													classNamePrefix="select-input__custom "
													placeholder="Chọn trạng thái ..."
												/>
											</div>
											<div className="flex items-center gap-5 justify-end">
												<div className="w-60 relative text-slate-500">
													<InputSearchDebounce
														onChange={(input: string) => setQueryParams({ ...params, page: page, size: size, _q: input?.trim() }, true)}
														placeholder="Từ khóa"
														className="form-control box pr-10 w-56 flex-end"
														delay={400}
													/>
												</div>

												<div>
													<button onClick={searchBookings} className="btn btn-primary shadow-md px-[13px] mr-2 whitespace-nowrap">
														Tìm
													</button>
												</div>

											</div>
										</div>
									</div>
									<div className="p-5" id="basic-table">
										<div className="preview">
											<div className="mt-8 overflow-auto">
												<table className="table">
													<thead className="table-dark">
														<tr className="text-center">
															<th className="whitespace-nowrap">ID</th>
															<th className="whitespace-nowrap">Tên phim</th>
															<th className="whitespace-nowrap">Người đặt</th>
															<th className="whitespace-nowrap">Thời gian đặt</th>
															{/* <th className="whitespace-nowrap">Ngày khởi hành</th> */}
															<th className="whitespace-nowrap">Trạng thái</th>
															<th className="whitespace-nowrap">Operation</th>
														</tr>
													</thead>
													<tbody>
														{
															bookings?.map((item: any) => {
																return (
																	<>
																		<tr className="text-center">
																			<td>{item.id}</td>
																			<td>{item.movies.title}</td>
																			<td>{item.user.name}</td>
																			{/* <td>{item?.createdAt && formatDate(item?.createdAt, "DD/MM/YYYY HH:mm:ss")}</td> */}
																			<td>{item?.bookingDate && formatDate(item?.bookingDate, "DD/MM/YYYY HH:mm:ss")}</td>
																			<td className={`${item?.status === "DADAT" ? "text-[#FFCC00]" : item.status === "DAXACNHAN" ? "text-[#0066FF]" : item.status === "DANGXEMPHIM" ? "text-[#FF1493]" : item.status === "HUYTOUR" ? "text-[#CC0000]" : item?.status === "DAHOANTHANH" && "text-[#00CC00]"}`}>{item?.status === "DADAT" ? "Chờ xử lí" : item.status === "DAXACNHAN" ? "Đã xác nhận" : item.status === "DANGXEMPHIM" ? "Đang xem phim" : item.status === "HUYTOUR" ? "Đã hủy" : item?.status === "DAHOANTHANH" && "Đã hoàn thành"}</td>
																			<td className="table-report__action w-[1%] border-l whitespace-nowrap lg:whitespace-normal">
																				<div className="flex items-center justify-between">
																					<div className="font-semibold text-sky-600 hover:opacity-60 flex items-center cursor-pointer" onClick={() => handleView(item)}>
																						<div className='inline-block' />
																						<Eye className='mr-1.5 inline-block' size={16} />
																						<div>
																						</div>
																					</div>
																					<div className={`font-semibold text-sky-600 hover:opacity-60 flex items-center ${user?.role === "ADMIN" ? "cursor-pointer " : "cursor-not-allowed"}`} onClick={() => { if (user?.role === "ADMIN") handleUpdate(item) }}>
																						<div className='inline-block' />
																						<Edit className='mr-1.5 inline-block' size={16} />
																						<div>
																						</div>
																					</div>
																					<div className={`font-semibold text-sky-600 hover:opacity-60 flex items-center ${user?.role === "ADMIN" ? "cursor-pointer " : "cursor-not-allowed"}`} onClick={() => { if (user?.role === "ADMIN") handleStatus(item.id) }}>
																						<div className="flex items-center justify-start text-danger">
																							<Trash2 className="mr-1.5" size={20} />
																						</div>
																					</div>
																				</div>
																			</td>
																		</tr>
																	</>
																)
															})}
													</tbody>
												</table>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/* END: Content */}
				</div>
			</div>
			<div className="flex justify-between w-full mt-10">
				<Pagination
					pageNumber={page}
					pageSize={size}
					totalRow={totalItem}
					onPageChange={(page) => setQueryParams({ page })}
					onChangePageSize={(size) => setQueryParams({ size })}
				/>
			</div>
		</>
	)
}

export default Charts
