import { useEffect, useState } from 'react'
import InputSearchDebounce from 'components/Form/InputSearchDebounce'
import Pagination from 'components/Pagination'
import 'react-datepicker/dist/react-datepicker.css'
import ReactSelect from 'react-select'
import { Edit, Plus, Trash2, X } from 'lucide-react'
import Modal from '@/components/Modal'
import { toast } from 'react-toastify'
import ModalEditCinemas from '@/components/ModalEditCinemas'
import ModalAddCinemas from '@/components/ModalAddMatch'
import cinemasAPI from '@/services/cinemas.service'
import useQueryParams from '@/hooks/useQueryParams'
import { useAuth } from '@/contexts/auth'

const Posts = () => {
	const [showModalAdd, setShowModalAdd] = useState<boolean>(false);
	const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
	const [showModalEdit, setShowModalEdit] = useState<boolean>(false);
	const [itemCinemas, setItemCinemas] = useState<any>({});
	const [idCinemas, setIdCinemas] = useState<any>();
	const [cinemas, setCinemas] = useState<any>([]);
	const [totalItem, setTotalItem] = useState<number>(0);
	const [params, setQueryParams] = useQueryParams()
	const { page, size, _q } = params
	const { user } = useAuth()

	const getDataListCinemas = async () => {
		try {
			const data = await cinemasAPI.getCinemas({ page, size, _q })
			setCinemas(data?.data?.data)
			setTotalItem(data?.data?.total)
		} catch (error) {
			console.log(error)
		}
	}

	const handleConfirmDelete = async () => {
		try {
			const res = await cinemasAPI.deleteCinemas(idCinemas)
			setShowModalDelete(false)
			if (res?.data?.status === 'error') {
				toast.error(res?.data?.message)
			} else {
				toast.success('Xóa user thành công.')
				getDataListCinemas()
			}
		} catch (error) {
			console.log(error)
		}
	}


	const searchCinemas = async () => {
		setQueryParams({
			...params, page: 1, size: size
		}, true)
		try {
			const data = await cinemasAPI.getCinemas({ page, size, _q })
			setCinemas(data?.data?.data)
			setTotalItem(data?.data?.total)
		} catch (error) {
			console.log(error)
		}
	}

	const handleStatus = (id: any) => {
		setShowModalDelete(true)
		setIdCinemas(id)
	}

	const handleUpdate = (item: any) => {
		setShowModalEdit(true)
		setItemCinemas(item)
	}

	useEffect(() => {
		if (_q) {
			getDataListCinemas()
		}
	}, [page, size])

	useEffect(() => {
		if (!_q) {
			getDataListCinemas()
		}
	}, [page, size, _q])

	return (
		<>
			<ModalAddCinemas
				showModalAdd={showModalAdd}
				setShowModalAdd={setShowModalAdd}
				callBack={() => {
					getDataListCinemas()
				}}
			/>
			<ModalEditCinemas
				showModalEdit={showModalEdit}
				setShowModalEdit={setShowModalEdit}
				itemCinemas={itemCinemas}
				callBack={() => {
					getDataListCinemas()
				}}
			/>
			<Modal
				title="Xóa cinemas"
				open={showModalDelete}
				handleCancel={() => setShowModalDelete(false)}
				handleConfirm={handleConfirmDelete}
			>
				Bạn chắc chắn muốn Xóa cinemas này chứ?
			</Modal>
			<div className="wrapper">
				<div className="wrapper-box">
					<div className="content">
						<div className="intro-y flex items-center mt-8">
							<h2 className="text-lg font-medium mr-auto">Danh sách Cinemas</h2>
						</div>
						<div className="grid grid-cols-24 gap-6 mt-5 overflow-y-auto">
							<div className="intro-y col-span-12 lg:col-span-6">
								{/* BEGIN: Basic Table */}
								<div className="intro-y box">
									<div className="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 justify-between">
										<div className="flex items-center">
											{user?.role === "ADMIN" && (
												<div className="btn btn-primary mr-2 shadow-md w-full" onClick={() => setShowModalAdd(true)}>
													<span className="flex h-4 w-8 items-center justify-center">
														<Plus />
													</span>
													Thêm mới
												</div>
											)}
										</div>
										<div className="flex items-center font-medium ">
											<div className="flex items-center gap-5 flex-wrap justify-end">

												<div className="w-60 relative text-slate-500">
													<InputSearchDebounce
														onChange={(input: string) => setQueryParams({ ...params, page: page, size: size, _q: input?.trim() }, true)}
														placeholder="Từ khóa"
														className="form-control box pr-10 w-56 flex-end"
														delay={400}
													/>
												</div>

												<div>
													<button onClick={searchCinemas} className="btn btn-primary shadow-md px-[13px] mr-2 whitespace-nowrap">
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
															<th className="whitespace-nowrap">Tên rạp phim</th>
															<th className="whitespace-nowrap">Địa chỉ</th>
															<th className="whitespace-nowrap">Thành phố</th>
															<th className="whitespace-nowrap">Chức năng</th>
														</tr>
													</thead>
													<tbody>
														{
															cinemas?.map((item: any) => {
																return (
																	<>
																		<tr className="text-center">
																			<td>{item.id}</td>
																			<td>{item.name}</td>
																			<td>{item.address}</td>
																			<td>{item.city}</td>
																			<td className="table-report__action w-[1%] border-l whitespace-nowrap lg:whitespace-normal">
																				<div className="flex items-center justify-around">
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
					onChangePageSize={(limit) => setQueryParams({ limit })}
				/>
			</div>
		</>
	)
}

export default Posts
