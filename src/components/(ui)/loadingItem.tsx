import React from 'react';
type Props = {
  sectionClass?: string;
  heightItem?: string;
};
const LoadingItem: React.FC<Props> = ({ sectionClass, heightItem }) => {
  const loadingItems = [];
  for (let i = 0; i < 8; i++) {
    loadingItems.push(
      <article className={`flex flex-col gap-[24px] ${heightItem}`} key={i}>
        <div className='skeleton w-full h-3/4'></div>
        <div className='w-full flex flex-col gap-[5px]'>
          <div className='skeleton w-full h-[24px]'></div>
          <div className='skeleton w-4/5 h-[24px]'></div>
        </div>
      </article>
    );
  }
  return <section className={`${sectionClass}`}>{loadingItems}</section>;
};

export default LoadingItem;
