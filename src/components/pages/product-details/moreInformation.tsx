import { Product } from '@/types/types';
import React from 'react';
type Props = {
  product: Product;
};
const MoreInformation: React.FC<Props> = ({ product }) => {
  return <div>MoreInformation</div>;
};

export default MoreInformation;
