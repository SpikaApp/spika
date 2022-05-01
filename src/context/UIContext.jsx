import React, { useState } from "react";
export const UIContext = React.createContext();

export const UIProvider = ({ children }) => {
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [openMintDialog, setOpenMintDialog] = useState(false);
  const [openSendDialog, setOpenSendDialog] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [mnemonicRequired, setMnemonicRequired] = useState(false);

  const handleMintUI = () => {
    setOpenMintDialog(true);
  };

  const handleSendUI = () => {
    setOpenSendDialog(true);
  };

  const handleLoginUI = () => {
    setOpenLoginDialog(true);
  };
  const handleLogoutUI = () => {
    setOpenLogoutDialog(true);
  };

  const handleMnemonicUI = () => {
    setMnemonicRequired(true);
    setOpenLoginDialog(true);
  };

  return (
    <UIContext.Provider
      value={{
        openAlertDialog,
        setOpenAlertDialog,
        openMintDialog,
        setOpenMintDialog,
        openSendDialog,
        setOpenSendDialog,
        handleMintUI,
        handleSendUI,
        openLoginDialog,
        setOpenLoginDialog,
        handleLoginUI,
        openLogoutDialog,
        setOpenLogoutDialog,
        handleLogoutUI,
        handleMnemonicUI,
        mnemonicRequired,
        setMnemonicRequired,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};
