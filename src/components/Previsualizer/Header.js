"use client";

import React, { useEffect, useRef, useState } from "react";
import Modal from "../Modal/Modal";
import WalletConnect from "../Wallet";
export default function Header() {
  
  return (
    <div className="fixed top-0 left-0 w-screen h-[40px] flex justify-center items-center z-50">
      <Modal cta={{ text: 'Connect Wallet', type: 'primary' }}>
          <WalletConnect />
      </Modal>
    </div>
  );
}
