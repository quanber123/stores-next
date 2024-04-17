export default function Loading() {
  return (
    <div className='container flex flex-col md:flex-row justify-between items-center gap-[20px] md:gap-[80px]'>
      <div className='skeleton max-w-[320px] sm:w-full h-[48px]'></div>
      <div className='skeleton w-full h-[48px]'></div>
    </div>
  );
}
