import { useContext } from 'react';
import { ContractDataContext } from '../contract';

export default function useContractData() {
  return useContext(ContractDataContext);
}
