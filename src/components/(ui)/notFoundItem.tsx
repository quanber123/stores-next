import React from 'react';

const NotFoundItem = ({ message }: { message: string }) => {
  return (
    <section className='container h-[50vh] flex justify-center items-center'>
      <p className='text-lg sm:text-2xl lg:text-4xl text-semiBoldGray font-bold'>
        {message}
      </p>
    </section>
  );
};

export default NotFoundItem;
