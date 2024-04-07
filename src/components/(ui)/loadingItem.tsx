import React from 'react';
type Props = {
  sectionClass?: string;
  articleClass?: string;
  heightItem?: string;
  amount: number;
};
const LoadingItem: React.FC<Props> = ({
  sectionClass,
  articleClass,
  heightItem,
  amount,
}) => {
  const loadingItems = [];
  for (let i = 0; i < amount; i++) {
    loadingItems.push(
      <article
        className={`flex flex-col gap-[24px] ${heightItem} ${articleClass}`}
        key={i}
      >
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
