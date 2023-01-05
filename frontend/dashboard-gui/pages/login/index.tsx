import { ReactElement } from 'react';

const Login = () => {
  function handleLogin() {
  }

  return <>
    <div className="bg-white text-stone-500	rounded-xl p-8 text-sm [&>*]:pb-2 max-w-2xl">
      <h1 className="text-black font-semibold text-4xl">Connect to Validator Dashboard</h1>
      <p>Connect to your validator dashboard to see the performance of your node,
        check rewards and run maintenance tasks!</p>
      <form onSubmit={() => handleLogin()}>
        <input placeholder='Validator ID' className="block p-4 w-full bg-stone-200 text-stone-600" ></input>
        <input placeholder='Password' type='password' className="block p-4 w-full bg-stone-200 text-stone-600 my-2"></input>
        <button className="p-4 bg-blue-700 text-stone-200">Connect</button>
      </form>
    </div>
  </>
}

Login.getLayout = function getLayout(page: ReactElement) {
  return (
    <div className="p-5 flex justify-center">
      {page}
    </div>
  )
}

export default Login
