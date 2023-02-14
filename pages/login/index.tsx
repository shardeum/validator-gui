import { ReactElement, useState } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

import { ArrowPathIcon } from '@heroicons/react/20/solid'
import { authService } from '../../services/auth.service';

export const getServerSideProps = () => ({
  props: { apiPort: process.env.PORT },
})

const Login = ({ apiPort }: any) => {
  const router = useRouter()

  useEffect(() => {
    // redirect to home if already logged in
    if (authService.isLogged) {
      router.push('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { register, handleSubmit, setError, formState } = useForm()

  const [apiError, setApiError] = useState<Error | null>(null);

  function onSubmit({password}: any) {
    setApiError(null);

    return authService
      .login(password, apiPort)
      .then(() => {
        // get return url from query parameters or default to '/'
        const returnUrl = router.query.returnUrl?.toString() || '/'
        router.push(returnUrl)
      })
      .catch(error => {
        setApiError(error)
      })
  }
  return (
    <>
        <img src="logo.png" alt="Logo" className="w-40 mb-5 mt-20" />
        <div className="bg-white text-stone-500	rounded-xl p-8 text-sm [&>*]:pb-2 max-w-xl">
          <h1 className="text-black font-semibold text-2xl">Connect to Validator Dashboard</h1>
          <p>
            Connect to your validator dashboard to see the performance of your node, check rewards and run
            maintenance tasks!
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register('password')} placeholder="Password" type="password" className="block p-4 w-full bg-stone-200 text-stone-600 my-2"></input>
            {apiError && (
              <div className="flex text-red-500 items-center mb-5">
                  <div className="ml-2 font-semibold">{apiError.message}</div>
              </div>
             )}
            <button disabled={formState.isSubmitting} className="btn btn-primary" type="submit" >
              { formState.isSubmitting ? <ArrowPathIcon className='w-5 spinner'/> : 'Connect'}
            </button>
          </form>
        </div>
    </>
  )
}

Login.getLayout = function getLayout(page: ReactElement) {
  return <div className="grid justify-center">{page}</div>
}

export default Login
