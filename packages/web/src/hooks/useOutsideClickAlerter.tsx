import {useEffect} from 'react';

export const useOutsideClickAlerter = (
  ref: React.RefObject<HTMLElement>,
  onOutSideClick: () => void,
  modalOpenerRef: React.RefObject<HTMLElement> | null = null
) => {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        !ref?.current?.contains(event.target as Node) &&
        (!modalOpenerRef || !modalOpenerRef?.current?.contains(event.target as Node))
      )
        onOutSideClick();
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, modalOpenerRef, onOutSideClick]);
};
