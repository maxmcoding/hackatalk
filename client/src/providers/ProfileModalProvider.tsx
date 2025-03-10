import React, {
  ReactElement,
  ReactNode,
  createContext,
  useContext,
  useState,
} from 'react';

import {ProfileModal_user$key} from '../__generated__/ProfileModal_user.graphql';

export type ModalState =
  | {
      isVisible: false;
    }
  | {
      /** Modal visiblity */
      isVisible: true;
      /** Which user the profile modal describes */
      user: ProfileModal_user$key;
      /** Callback function for delete button */
      onDeleteFriend?: () => void;
      /** Callback function for add friend button */
      onAddFriend?: () => void;
      hideButtons?: boolean;
      isMe?: boolean;
    };

export type ProfileModalContext = {
  /** Allow context consumers to make the modal visible with a new state. */
  showModal: (next: Omit<ModalState & {isVisible: true}, 'isVisible'>) => void;
  /** Allow context consumers to hide the modal. */
  hideModal: () => void;
  modalState: ModalState;
};

const ProfileModalContext = createContext<ProfileModalContext>({
  modalState: {isVisible: false},
  showModal: () => {},
  hideModal: () => {},
});

type Props = {
  children: ReactNode;
};

export const ProfileModalProvider = ({children}: Props): ReactElement => {
  const [state, setState] = useState<ModalState>({
    isVisible: false,
  });

  const showModal = (
    next: Omit<ModalState & {isVisible: true}, 'isVisible'>,
  ): void =>
    setState({
      isVisible: true,
      ...next,
    });

  const hideModal = (): void =>
    setState({
      isVisible: false,
    });

  return (
    <ProfileModalContext.Provider
      value={{
        showModal,
        hideModal,
        modalState: state,
      }}
    >
      {children}
    </ProfileModalContext.Provider>
  );
};

export const useProfileContext = (): ProfileModalContext =>
  useContext(ProfileModalContext);
