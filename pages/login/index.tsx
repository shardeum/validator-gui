import { ReactElement, SetStateAction, useState } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { FieldValues, useForm } from 'react-hook-form'
import { ArrowPathIcon } from '@heroicons/react/20/solid'
import { authService } from '../../services/auth.service';
import Head from 'next/head';

const Login = () => {
  const router = useRouter()
  const login = authService.useLogin()

  useEffect(() => {
    // redirect to home if already logged in
    if (authService.isLogged) {
      router.push('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const {register, handleSubmit, formState} = useForm()

  const [apiError, setApiError] = useState<Error | null>(null);

  async function onSubmit({password}: FieldValues) {
    setApiError(null);

    try{
      await login(password)
      router.push('/')
    }
    catch(error){
      setApiError(error as SetStateAction<Error | null>)
    }
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="Shardeum" className="w-40 mb-5"/>
      <div className="bg-white text-stone-500 rounded-xl p-4 sm:p-8 text-sm [&>*]:pb-2 max-w-xl">
        <h1 className="text-black font-semibold text-2xl">Connect to Validator Dashboard</h1>
        <p>
          Connect to your validator dashboard to see the performance of your node, check rewards and run
          maintenance tasks!
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register('password')} placeholder="Password" type="password"
                 className="block p-4 w-full bg-stone-200 text-stone-600 my-2 rounded-lg"></input>
          {apiError && (
              <div className="flex text-red-500 items-center mb-5">
                <div className="ml-2 font-semibold">{apiError.message}</div>
              </div>
          )}

          <div className="flex items-center">
            <div className="ml-4 text-red-500 font-semibold">Invalid password!</div>
            <button disabled={formState.isSubmitting} className="btn btn-primary rounded-lg ml-auto" type="submit">
              {formState.isSubmitting ? <ArrowPathIcon className='w-5 spinner'/> : 'Connect'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

Login.getLayout = function getLayout(page: ReactElement) {
  return <>
    <Head>
      <title>Shardeum Dashboard</title>
      <meta name="description" content="Dashboard to configure a Shardeum validator"/>
      <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests"/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <link rel="icon" href="/favicon.ico"/>
    </Head>
    <main className="py-5 md:py-10 px-5 sm:px-10 lg:px-20 m-auto mt-10 sm:mt-20 max-w-[75rem] flex flex-col items-center">
      <div className="flex flex-col items-start">
        {page}
      </div>
    </main>
  </>
}

export default Login
