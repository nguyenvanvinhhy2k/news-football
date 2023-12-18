import { useEffect, useState } from 'react'
import InputSearchDebounce from 'components/Form/InputSearchDebounce'
import Pagination from 'components/Pagination'
import 'react-datepicker/dist/react-datepicker.css'
import ReactSelect from 'react-select'
import { Edit, Plus, Trash2, X } from 'lucide-react'
import Modal from '@/components/Modal'
import { toast } from 'react-toastify'
import ModalEditTournaments from '@/components/ModalEditTournaments'
import ModalAddTournaments from '@/components/ModalAddTournaments'
import moviesAPI from '@/services/movies.service'
import useQueryParams from '@/hooks/useQueryParams'
import cinemasAPI from '@/services/cinemas.service'
import { useAuth } from '@/contexts/auth'

const Tournaments = () => {
	const [showModalAdd, setShowModalAdd] = useState<boolean>(false);
	const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
	const [showModalEdit, setShowModalEdit] = useState<boolean>(false);
	const [itemMovies, setItemMovies] = useState<any>({});
	const [idMovies, setIdMovies] = useState<any>();
	const [movies, setMovies] = useState<any>([]);
	const [totalItem, setTotalItem] = useState<number>(0);
	const [params, setQueryParams] = useQueryParams()
	const { page, size, _q } = params
	const { user } = useAuth()

	const getDataListMovies = async () => {
		try {
			const [data, cinemas] = await Promise.all([
				moviesAPI.getMovies({ page: page, _q: _q, size: size }),
				cinemasAPI.getCinemas({ page: 1, size: 999 })
			])

			console.log(data, cinemas)

			const newData: any = data?.data?.data?.map((item: any) => {
				return {
					...item,
					cinemasName: cinemas?.data?.data?.find((itemCate: any) => itemCate?.id === item?.cinemaId)?.name
				}
			})
			setMovies(newData)
			setTotalItem(data?.data?.total)
		} catch (error) {
			console.log(error)
		}
	}

	const handleConfirmDelete = async () => {
		try {
			const res = await moviesAPI.deleteMovies(idMovies)
			setShowModalDelete(false)
			if (res?.data?.status === 'error') {
				toast.error(res?.data?.message)
			} else {
				toast.success('Xóa phim thành công.')
				getDataListMovies()
			}
		} catch (error) {
			console.log(error)
		}
	}

	const searchMovies = async () => {
		setQueryParams({
			...params, page: 1, size: size
		}, true)
		try {
			const data = await moviesAPI.getMovies({ page, size, _q })
			setMovies(data?.data?.data)
			setTotalItem(data?.data?.total)
		} catch (error) {
			console.log(error)
		}
	}

	const handleStatus = (id: any) => {
		setShowModalDelete(true)
		setIdMovies(id)
	}

	const handleUpdate = (item: any) => {
		setShowModalEdit(true)
		setItemMovies(item)
	}

	useEffect(() => {
		if (_q) {
			getDataListMovies()
		}
	}, [page, size])

	useEffect(() => {
		if (!_q) {
			getDataListMovies()
		}
	}, [page, size, _q])

	return (
		<>
			<ModalAddTournaments
				showModalAdd={showModalAdd}
				setShowModalAdd={setShowModalAdd}
				callBack={() => {
					getDataListMovies()
				}}
			/>
			<ModalEditTournaments
				showModalEdit={showModalEdit}
				setShowModalEdit={setShowModalEdit}
				itemMovies={itemMovies}
				callBack={() => {
					getDataListMovies()
				}}
			/>
			<Modal
				title="Xóa giải đấu"
				open={showModalDelete}
				handleCancel={() => setShowModalDelete(false)}
				handleConfirm={handleConfirmDelete}
			>
				Bạn chắc chắn muốn Xóa giải đấu này chứ?
			</Modal>
			<div className="wrapper">
				<div className="wrapper-box">
					<div className="content">
						<div className="intro-y flex items-center mt-8">
							<h2 className="text-lg font-medium mr-auto">Danh sách giải đấu</h2>
						</div>
						<div className="grid grid-cols-24 gap-6 mt-5 overflow-y-auto">
							<div className="intro-y col-span-12 lg:col-span-6">
								{/* BEGIN: Basic Table */}
								<div className="intro-y box">
									<div className="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 justify-between">
										<div className="flex items-center">
												<div className="btn btn-primary mr-2 shadow-md w-full" onClick={() => setShowModalAdd(true)}>
													<span className="flex h-4 w-8 items-center justify-center">
														<Plus />
													</span>
													Thêm mới
												</div>
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
													<button onClick={searchMovies} className="btn btn-primary shadow-md px-[13px] mr-2 whitespace-nowrap">
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
															<th className="whitespace-nowrap">STT</th>
															<th className="whitespace-nowrap">Tên giải đấu</th>
															<th className="whitespace-nowrap">Chức năng</th>
														</tr>
													</thead>
													<tbody>
														{
															movies?.map((item: any) => {
																return (
																	<>
																		<tr className="text-center">
																			<td>{item.id}</td>
																			<td>{item.title}</td>
																			<td>{item.cinemasName}</td>
																			<td><img src={`http://localhost:8228/files/${item.poster}`} alt="" /></td>
																			<td><img src={`http://localhost:8228/files/${item.banner}`} alt="" /></td>
																			<td><p className='w-[200px] truncate' title={item.descristion}>{item.descristion}</p></td>
																			<td>{item.trailer}</td>
																			<td>{item.genre}</td>
																			<td>{item.director}</td>
																			<td>{item.duration}p</td>
																			<td className="table-report__action w-[1%] border-l whitespace-nowrap lg:whitespace-normal">
																				<div className="flex items-center justify-around">
																					<div className={`font-semibold text-sky-600 hover:opacity-60 flex items-center `} onClick={() => { handleUpdate(item) }}>
																						<div className='inline-block' />
																						<Edit className='mr-1.5 inline-block' size={16} />
																						<div>
																						</div>
																					</div>
																					<div className={`font-semibold text-sky-600 hover:opacity-60 flex items-center `} onClick={() => {handleStatus(item.id) }}>
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

export default Tournaments
