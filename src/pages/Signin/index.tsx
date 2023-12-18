import InputPassword from '@/components/Form/InputPassword';
import InputText from '@/components/Form/InputText';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from 'contexts/auth';
import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from 'react-router-dom';
import * as yup from "yup";
import DarkModeSwitcher from '../../components/Layout/DarkModeSwitcher';
import logo from '@/assets/images/illustration.svg';


type Inputs = {
  username: string;
  password: string;
};

const schema = yup
  .object({
    username: yup.string().required('Tên đăng nhập không được để trống'),
    password: yup.string().required('Mật khẩu không được để trống'),
  }).required();

const SignIn = () => {
  const { signIn, isAuthenticated } = useAuth()
  let navigate = useNavigate();
  let location: { [key: string]: any } = useLocation();
  let from = location?.state?.from?.pathname || "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = (dataInput: Inputs) => {
    signIn(dataInput)
  }

  return (
    <>
      <div className="login">
        <div className="container sm:px-10 h-[94vh]">
          <div className="block xl:grid grid-cols-2 gap-4">
            <div className="hidden xl:flex flex-col min-h-screen">

              <div className="my-auto">
                <img
                  alt="Midone - HTML Admin Template"
                  className="-intro-x w-1/2 -mt-16"
                  src={logo}
                />
                <div className="-intro-x text-white font-medium text-4xl leading-tight mt-10 uppercase">
                  CMS FNS
                </div>
              </div>
            </div>
            <div className="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
              <form onSubmit={handleSubmit(onSubmit)} className="overflow-hidden my-auto mx-auto xl:ml-20 bg-white dark:bg-darkmode-600 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-1 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
                <h2 className="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left" >
                  Đăng nhập
                </h2>
                <div className="intro-x mt-8">
                  <InputText
                    register={register("username")}
                    placeholder="Tên đăng nhập"
                    error={errors.username}
                    classNameInput="intro-x login__input form-control py-3 px-4 block"
                  />
                  <InputPassword
                    register={register("password")}
                    placeholder="Mật khẩu"
                    error={errors.password}
                    classNameInput="intro-x login__input form-control py-3 px-4 block mt-4"
                  />
                </div>
                <div className="intro-x flex text-slate-600 dark:text-slate-500 text-xs sm:text-sm mt-4">
                  <div className="flex items-center mr-auto">
                    <input id="remember-me" type="checkbox" className="form-check-input border mr-2" />
                    <label className="cursor-pointer select-none" >Remember me</label>
                  </div>
                  <a href="">Quên mật khẩu?</a>
                </div>
                <div className="intro-x mt-5 xl:mt-8 text-center xl:text-left">
                  <button className="btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top" >Đăng nhập</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <DarkModeSwitcher />
    </>
  )
}

export default SignIn
