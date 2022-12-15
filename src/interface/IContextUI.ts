import React from "react";
import { INftDetails, INotification, IUR } from ".";

type IContextUI = {
  spikaWallet: boolean | undefined;
  setSpikaWallet: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  darkMode: boolean | undefined;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  openAlertDialog: boolean;
  setOpenAlertDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openSendDialog: boolean;
  setOpenSendDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openConfirmSendDialog: boolean;
  setOpenConfirmSendDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openReceiveDialog: boolean;
  setOpenReceiveDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openCreateCollectionDialog: boolean;
  setOpenCreateCollectionDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openCreateNftDialog: boolean;
  setOpenCreateNftDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openTxnDetailsDialog: boolean;
  setOpenTxnDetailsDialog: React.Dispatch<React.SetStateAction<boolean>>;
  txnType: number;
  setTxnType: React.Dispatch<React.SetStateAction<number>>;
  openNftDetailsDialog?: boolean;
  setOpenNftDetailsDialog: React.Dispatch<React.SetStateAction<boolean>>;
  selectedNft: INftDetails | undefined;
  setSelectedNft: React.Dispatch<React.SetStateAction<INftDetails | undefined>>;
  openLoginDialog: boolean;
  setOpenLoginDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openLogoutDialog: boolean;
  setOpenLogoutDialog: React.Dispatch<React.SetStateAction<boolean>>;
  mnemonicRequired: boolean;
  setMnemonicRequired: React.Dispatch<React.SetStateAction<boolean>>;
  privateKeyRequired: boolean;
  setPrivateKeyRequired: React.Dispatch<React.SetStateAction<boolean>>;
  openCreateAccountDialog: boolean;
  setOpenCreateAccountDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openAccountAssetsDialog: boolean;
  setOpenAccountAssetsDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openAddAssetDialog: boolean;
  setOpenAddAssetDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openNetworkDialog: boolean;
  setOpenNetworkDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openAddCustomNetworkDialog: boolean;
  setOpenAddCustomNetworkDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openAccountDetailsDialog: boolean;
  setOpenAccountDetailsDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openChangePasswordDialog: boolean;
  setOpenChangePasswordDialog: React.Dispatch<React.SetStateAction<boolean>>;
  accountRoutesEnabled: boolean;
  setAccountRoutesEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  openPermissionDialog: boolean;
  setOpenPermissionDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openConnectedSitesDialog: boolean;
  setOpenConnectedSitesDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openConnectWalletDialog: boolean;
  setOpenConnectWalletDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openAccountManagerDialog: boolean;
  setOpenAccountManagerDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openRenameAccountDialog: boolean;
  setOpenRenameAccountDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openResetWalletDialog: boolean;
  setOpenResetWalletDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openKeystoneQRScannerDialog: boolean;
  setOpenKeystoneQRScannerDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openKeystoneImportDialog: boolean;
  setOpenKeystoneImportDialog: React.Dispatch<React.SetStateAction<boolean>>;
  keystoneScanResult: IUR | undefined;
  setKeystoneScanResult: React.Dispatch<React.SetStateAction<IUR | undefined>>;
  openSwapSettingsDialog: boolean;
  setOpenSwapSettingsDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openContactCard: boolean;
  setOpenContactCard: React.Dispatch<React.SetStateAction<boolean>>;
  openNotification: boolean;
  setOpenNotification: React.Dispatch<React.SetStateAction<boolean>>;
  notification: INotification | undefined;
  setNotification: React.Dispatch<React.SetStateAction<INotification | undefined>>;
  notificationExpired: boolean;
  setNotificationExpired: React.Dispatch<React.SetStateAction<boolean>>;
  sendNotification: (args: INotification) => void;
  openAddressBookDialog: boolean;
  setOpenAddressBookDialog: React.Dispatch<React.SetStateAction<boolean>>;
  disableAllRoutes: boolean;
  setDisableAllRoutes: React.Dispatch<React.SetStateAction<boolean>>;
  previewRequired: boolean;
  setPreviewRequired: React.Dispatch<React.SetStateAction<boolean>>;
  somethingChanged: boolean;
  setSomethingChanged: React.Dispatch<React.SetStateAction<boolean>>;
  devMode: boolean;
  isPopup: boolean;
  setIsPopup: React.Dispatch<React.SetStateAction<boolean>>;
  isError?: boolean;
  setIsError: React.Dispatch<React.SetStateAction<boolean>>;

  handleSendUI: () => void;
  handleReceiveUI: () => void;
  handleCreateCollectionUI: () => void;
  handleCreateNFTUI: () => void;
  handleNftDetailsUI: (nft: INftDetails) => void;
  handleLoginUI: () => void;
  handleLogoutUI: () => void;
  handleMnemonicUI: () => void;
  handlePrivateKeyUI: () => void;
  handleCreateAccountDialog: () => void;
  handleChangePasswordUI: () => void;
  handleAccountAssetsUI: () => void;
  handleAddAssetUI: () => void;
  handleChangeNetworkUI: () => void;
  handleAddCustomNetworkUI: () => void;
  handleConnectedSitesUI: () => void;
  handleAccountManagerUI: () => void;
  handleRenameAccountUI: () => void;
  handleResetWalletUI: () => void;
  handleConnectWalletUI: () => void;
  handleKeystoneQRScannerUI: () => void;
  handleKeystoneImportUI: () => void;
  handleSwapSettingsUI: () => void;
  handleContactCardUI: () => void;
  handleAddressBookUI: () => void;
};

export default IContextUI;
