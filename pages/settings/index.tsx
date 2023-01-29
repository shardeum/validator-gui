export const getServerSideProps = () => ({
  props: { apiPort: process.env.PORT },
});

export default function Settings({ apiPort }: any) {
  return <div className="flex content-center items-center h-[70vh] text-xl text-stone-300">
    <h2 className="m-auto">Coming Soon</h2>
  </div>
}
