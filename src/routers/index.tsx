import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from 'components/Layout'
import PrivateRouter from './privateRouter'


const SignIn = lazy(() => import('../pages/Signin'))
const SignUp = lazy(() => import('../pages/SignUp'))
const Home = lazy(() => import('../pages/index'))
const Users = lazy(() => import('../pages/Users'))
const Categories = lazy(() => import('../pages/Categories'))
const Tournaments = lazy(() => import('../pages/Tournaments'))
const Match = lazy(() => import('../pages/Match'))
const CompetitionTeam = lazy(() => import('../pages/CompetitionTeam'))
const Charts = lazy(() => import('../pages/Charts'))
const Posts = lazy(() => import('../pages/Posts'))
const Reviews = lazy(() => import('../pages/Reviews'))

const AppRouter = () => {
	return (
		<Routes>
			<Route>
				<Route path="/signin" element={<SignIn />} />
				<Route path="/signup" element={<SignUp />} />
			</Route>
			<Route
				path="/"
				element={
					<Suspense>
					 {/* <PrivateRouter > */}
						<Layout>
							<Home />
						</Layout>
						{/* </PrivateRouter> */}
					</Suspense>
				}
			/>
			<Route
				path="/users"
				element={
					<Suspense>
						 {/* <PrivateRouter > */}
						<Layout>
							<Users />
						</Layout>
						{/* </PrivateRouter> */}
					</Suspense>
				}
			/>
			<Route
				path="/categories"
				element={
					<Suspense>
						 {/* <PrivateRouter > */}
						<Layout>
							<Categories />
						</Layout>
						{/* </PrivateRouter> */}
					</Suspense>
				}
			/>
      <Route
				path="/posts"
				element={
					<Suspense>
						 {/* <PrivateRouter > */}
						<Layout>
							<Posts />
						</Layout>
						{/* </PrivateRouter> */}
					</Suspense>
				}
			/>
			<Route
				path="/tournaments"
				element={
					<Suspense>
						 {/* <PrivateRouter > */}
						<Layout>
							<Tournaments />
						</Layout>
						{/* </PrivateRouter> */}
					</Suspense>
				}
			/>
			<Route
				path="/competition-team"
				element={
					<Suspense>
						 {/* <PrivateRouter > */}
						<Layout>
							<CompetitionTeam />
						</Layout>
						{/* </PrivateRouter> */}
					</Suspense>
				}
			/>
			<Route
				path="/charts"
				element={
					<Suspense>
						 {/* <PrivateRouter > */}
						<Layout>
							<Charts />
						</Layout>
						{/* </PrivateRouter> */}
					</Suspense>
				}
			/>
			<Route
				path="/match"
				element={
					<Suspense>
						 {/* <PrivateRouter > */}
						<Layout>
							<Match />
						</Layout>
						{/* </PrivateRouter> */}
					</Suspense>
				}
			/>
			<Route
				path="/reviews"
				element={
					<Suspense>
						 {/* <PrivateRouter > */}
						<Layout>
							<Reviews />
						</Layout>
						{/* </PrivateRouter> */}
					</Suspense>
				}
			/>
		</Routes>
	)
}

export default AppRouter
