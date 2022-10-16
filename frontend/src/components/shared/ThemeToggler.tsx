import React, { useEffect } from 'react';
import { HiMoon, HiOutlineSun } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '~/redux/slice/preferenceSlice';
import { IRootState } from '~/types/types';

const ThemeToggler = () => {
  const { theme } = useSelector((state: IRootState) => ({ theme: state.preference.theme }));
  const dispatch = useDispatch();

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const onThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      dispatch(setTheme('dark'));
    } else {
      dispatch(setTheme('light'));
    }
  }

  return (
    <label
      className="w-9 h-9 flex bg-gray-100 items-center justify-center rounded-full border border-gray-200 hover:bg-indigo-100
      dark:bg-indigo-900 dark:hover:bg-indigo-1000 dark:border-indigo-900 cursor-pointer"
      title={theme === 'dark' ? 'Toggle Light Theme' : 'Toggle Dark Theme'}
    >
      <input
        className="hidden"
        checked={theme === 'dark'}
        type="checkbox"
        id="theme"
        onChange={onThemeChange}
        name="theme-switch"
        hidden
      />
      {theme === 'dark' ? (
        <HiMoon className="text-[cyan] text-xl" />
      ) : (
        <HiOutlineSun className="text-orange-400 text-xl"/>
      )}
    </label>
  );
};

export default ThemeToggler;
