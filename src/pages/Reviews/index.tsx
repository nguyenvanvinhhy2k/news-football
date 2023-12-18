import { useEffect, useState } from 'react'
import InputSearchDebounce from 'components/Form/InputSearchDebounce'
import Pagination from 'components/Pagination'
import 'react-datepicker/dist/react-datepicker.css'
import ReactSelect from 'react-select'
import { Edit, Plus, Trash2, X } from 'lucide-react'
import Modal from '@/components/Modal'
import { toast } from 'react-toastify'
import reviewAPI from '@/services/reviews.service'
import dayjs from 'dayjs'
import useQueryParams from '@/hooks/useQueryParams'
import { useAuth } from '@/contexts/auth'

const Reviews = () => {
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [idReviews, setIdReviews] = useState<any>();
  const [reviews, setReviews] = useState<any>([]);
	const [totalItem, setTotalItem] = useState<number>(0);
	const [params, setQueryParams] = useQueryParams()
	const { page, size, _q } = params
	const { user } = useAuth()

  const getDataListReviews = async () => {
    try {
      const data = await reviewAPI.getReviews({ page: page, _q: _q, size: size})
      setReviews(data?.data?.data)
			setTotalItem(data?.data?.total)
    } catch (error) {
      console.log(error)
    }
  }

  const handleConfirmDelete = async () => {
    try {
			const res = await reviewAPI.deleteReviews(idReviews)
			setShowModalDelete(false)
			if (res?.data?.status === 'error') {
				toast.error(res?.data?.message)
			} else {
				toast.success('Xóa user thành công.')
				getDataListReviews()
			}
		} catch (error) {
			console.log(error)
		}
  }

	const searchReviews = async () => {
		setQueryParams({
			...params, page: 1, size: size
		}, true)
    try {
      const data = await reviewAPI.getReviews({ page: page, _q: _q, size: size})
      setReviews(data?.data?.data)
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
    setIdReviews(id)
	}

	useEffect(() => {
		if (_q) {
			getDataListReviews()
		}
	}, [page, size])

	useEffect(() => {
		if (!_q) {
			getDataListReviews()
		}
	}, [_q, page, size])

  return (
    <>
      <Modal
				title="Xóa comment"
				open={showModalDelete}
				handleCancel={() => setShowModalDelete(false)}
				handleConfirm={handleConfirmDelete}
			>
				Bạn chắc chắn muốn Xóa comment này chứ?
			</Modal>
      <div className="wrapper">
        <div className="wrapper-box">
          <div className="content">
            <div className="intro-y flex items-center mt-8">
              <h2 className="text-lg font-medium mr-auto">Danh sách Tours</h2>
            </div>
            <div className="grid grid-cols-24 gap-6 mt-5 overflow-y-auto">
              <div className="intro-y col-span-12 lg:col-span-6">
                {/* BEGIN: Basic Table */}
                <div className="intro-y box">
                <div className="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 justify-between">
											<div className="flex items-center">
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
													<button onClick={searchReviews} className="btn btn-primary shadow-md px-[13px] mr-2 whitespace-nowrap">
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
                              <th className="whitespace-nowrap">User comment</th>
                              <th className="whitespace-nowrap">Bài viết</th>
                              <th className="whitespace-nowrap">Comment</th>
                              <th className="whitespace-nowrap">Đánh giá</th>
                              <th className="whitespace-nowrap">Thời gian comment</th>
                              <th className="whitespace-nowrap">Chức năng</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              reviews?.map((item: any) => {
                                return (
                                  <>
                                    <tr className="text-center">
                                      <td>{item.id}</td>
                                      <td>{item?.user?.name}</td>
                                      <td>{item?.movies?.title}</td>
                                      <td>{item?.message}</td>
                                      <td>{item?.star}</td>
                                      <td>{item?.createdAt && formatDate(item?.createdAt, "DD/MM/YYYY HH:mm:ss")}</td>
                                      <td className="table-report__action w-[1%] border-l whitespace-nowrap lg:whitespace-normal">
                                        <div className="flex items-center justify-betweeen">
                                          <div className={ `font-semibold text-sky-600 hover:opacity-60 flex items-center ${user?.role === "ADMIN" ? "cursor-pointer " : "cursor-not-allowed"}`} >
                                            <div className='inline-block' />
                                            <Edit className='mr-1.5 inline-block' size={16} />
                                            <div>
                                            </div>
                                          </div>
                                          <div className={ `font-semibold text-sky-600 hover:opacity-60 flex items-center ${user?.role === "ADMIN" ? "cursor-pointer " : "cursor-not-allowed"}`} onClick={() => {if(user?.role === "ADMIN") handleStatus(item.id)}}>
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

export default Reviews
