
export interface Menu {
  id: number
  name: string
  slug: string
	patchChildren?: Array<string>
}

export const menuConfig: Menu[] = [
	{
    id: 9,
    name: 'Tổng quát',
    slug: '/'
  },
  {
    id: 2,
    name: 'Quản lý giải đấu',
    slug: '/tournaments'
  },
	{
    id: 4,
    name: 'Quản lý trận đấu',
    slug: '/match'
  },
	  {
    id: 5,
    name: 'Quản lý đội thi đấu',
    slug: '/competition-team'
  },
	{
    id: 6,
    name: 'Quản lý bảng xếp hạng',
    slug: '/charts'
  },
	{
    id: 3,
    name: 'Quản lý danh mục',
    slug: '/categories'
  },
  {
    id: 3,
    name: 'Quản lý bài viết',
    slug: '/posts'
  },
  {
    id: 7,
    name: 'Quản lý Reviews',
    slug: '/reviews'
  },
	{
    id: 1,
    name: 'Quản lý Users',
    slug: '/users',
  }
]

export const mathRouteConfig = [{ path: "/users/:id" }]
