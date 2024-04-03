'use client';
import { createContext, useCallback, useReducer } from 'react';

type InitialState = {
  visibleCartDropdown: boolean;
  visibleFavoriteDropdown: boolean;
  visibleNotificationsDropdown: boolean;
  visibleUserDropdown: boolean;
};
const SET_VISIBLE_DROPDOWN = 'SET_VISIBLE_DROPDOWN';
const CLOSE_DROPDOWN = 'CLOSE_DROP_DOWN';
const initialState: InitialState = {
  visibleCartDropdown: false,
  visibleFavoriteDropdown: false,
  visibleNotificationsDropdown: false,
  visibleUserDropdown: false,
};
const reducer = (state: InitialState, action: any) => {
  const currentDropdown = action.payload?.dropdown;
  const resetDropdown: InitialState = {
    visibleCartDropdown: false,
    visibleFavoriteDropdown: false,
    visibleNotificationsDropdown: false,
    visibleUserDropdown: false,
  };
  switch (action.type) {
    case SET_VISIBLE_DROPDOWN:
      if (currentDropdown === null) return { ...resetDropdown };
      return {
        ...resetDropdown,
        [currentDropdown]: !state[currentDropdown as keyof InitialState],
      };
    case CLOSE_DROPDOWN:
      return { ...resetDropdown };

    default:
      return state;
  }
};
export type InitialDropdownContext = {
  state: InitialState;
  setVisibleDropdown: (modal: any) => void;
  closeDropdown: () => void;
};
export const DropdownContext = createContext({} as InitialDropdownContext);

export const DropdownProvider = ({ children }: { children: any }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const setVisibleDropdown = useCallback(
    (dropdown: string) => {
      dispatch({ type: SET_VISIBLE_DROPDOWN, payload: { dropdown } });
    },
    [dispatch]
  );
  const closeDropdown = useCallback(() => {
    dispatch({ type: CLOSE_DROPDOWN });
  }, [dispatch]);
  const contextValue = {
    state,
    setVisibleDropdown,
    closeDropdown,
  };
  return (
    <DropdownContext.Provider value={contextValue}>
      {children}
    </DropdownContext.Provider>
  );
};
