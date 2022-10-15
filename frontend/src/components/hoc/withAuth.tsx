import React from "react";
import { useSelector } from "react-redux";
import { IRootState } from "~/types/types";

interface IInjectedProps {
  isAuth: boolean;
}

const withAuth = <P extends IInjectedProps>(Component: React.ComponentType<P>) => {
  return (props: Pick<P, Exclude<keyof P, keyof IInjectedProps>>) => {
    const isAuth = useSelector((state: IRootState) => !!state.auth?.id);

    return <Component {...props as P} isAuth={isAuth} />
  }
};

export default withAuth;

