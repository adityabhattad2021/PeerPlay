"use client";
import { Chat } from "@pushprotocol/uiweb";
import { ITheme } from "@pushprotocol/uiweb";
import { useSearchParams } from "next/navigation";
import { useAccount } from "wagmi";

export default function Video() {
  const {address}=useAccount()
  const searchParams = useSearchParams();
  const creatorAddress = searchParams.get("creatorAddress");
  return (
    <div>
     
    </div>
  );
}
