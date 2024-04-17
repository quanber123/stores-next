export default function Loading() {
  return (
    <div
      style={{ boxShadow: '0 0px 3px 0px rgba(0, 0, 0, 0.2)' }}
      className='fixed top-0 left-0 w-full h-[64px] z-[100] flex items-center'
    >
      <div className='container m-auto px-4 flex justify-between items-center gap-20'>
        <div className='skeleton w-[150px] h-[32px]'></div>
        <div className='skeleton w-[150px] h-[38px]'></div>
      </div>
    </div>
  );
}
