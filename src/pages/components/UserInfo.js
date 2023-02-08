import { Button, Popover } from "antd";
import { useEffect, useState } from "react";
import React from "react";
import { getBalanceByAddress } from "./api";
import { toChainAddress, toDecimalAmount } from "./chia-util";

const UserInfo = ({account}) => {
  const chainAddress = toChainAddress(account);
  const [balance, setBalance] = useState(null);
  console.log(chainAddress)

  useEffect(() => {
     (async () => {
      const amount = await getBalanceByAddress(chainAddress);
      setBalance(amount);
     })();
  }, [chainAddress]);
  const content = <div className="w-[318px] h-[40px]">
      <span className="break-all font-bold text-[14px]">{chainAddress}</span>
  </div>

  return (
      <Popover placement="bottom" overlayClassName="popover-theme" content={content}>
          <div className="bg-white p-[4px] min-w-[236px] h-[44px] flex items-center rounded-[100px]">
              <span className="font-bold text-right pr-[10px] pl-[10px] flex-1">{balance == null? "-" : toDecimalAmount(balance)} XCH</span>
              <span className="flex font-bold ml-auto bg-[#effdf0] h-full items-center px-[8px] pl-[12px] py-[8px] rounded-full">
                  <span className="mr-[5px]">{`${chainAddress.slice(0, 6)}...${chainAddress.slice(-4)}`}</span>
                 </span>
          </div>
      </Popover>
  )
}

export default UserInfo
