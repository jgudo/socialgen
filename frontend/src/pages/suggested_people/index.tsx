import React, { useEffect } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useSelector } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { UserCard } from "~/components/main";
import { Loader, UserLoader } from "~/components/shared";
import { useDidMount } from "~/hooks";
import { clearSuggestedPeople, startGetSuggestedPeople } from "~/redux/slice/suggestedPeopleSlice";
import { useAppDispatch } from "~/redux/store/store2";
import { IError, IRootState } from "~/types/types";

const SuggestedPeople = () => {
  const { people, isLoading, error, offset } = useSelector((state: IRootState) => ({
    people: state.suggestedPeople.items,
    isLoading: state.loading.isFetchingSuggestedPeople,
    error: state.error.fetchSuggestedPeopleError,
    offset: state.suggestedPeople.offset
  }));
  const dispatch = useAppDispatch();
  const didMount = useDidMount(true);

  useEffect(() => {
    if (people.length > 0 && offset === 0) {
      dispatch(clearSuggestedPeople());
    } else if (people.length === 0) {
      dispatch(startGetSuggestedPeople({ offset }))
    }
  }, [people]);

  const [infiniteRef] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage: !error && people.length >= 10,
    onLoadMore: () => dispatch(startGetSuggestedPeople({ offset })),
    disabled: !!error,
    rootMargin: '0px 0px 100px 0px',
  });

  return (
    <div className="contain min-h-screen w-full py-24">
      <div className="mb-8">
        <h2 className="text-gray-800 dark:text-white">Suggested People</h2>
        <p className="text-gray-400 text-sm">Follow people to see their updates</p>
      </div>
      {(isLoading && people.length === 0) && (
        <div className="min-h-10rem px-4">
          <UserLoader />
          <UserLoader />
          <UserLoader />
          <UserLoader />
        </div>
      )}
      {(!isLoading && error && people.length === 0) && (
        <div className="flex min-h-10rem items-center justify-center">
          <span className="text-gray-400 italic">
            {(error as IError)?.error?.message || 'Something went wrong :('}
          </span>
        </div>
      )}
      <TransitionGroup component={null}>
        <div className="grid grid-cols-1 laptop:grid-cols-2 laptop:gap-x-4">
          {people.map(user => (
            <CSSTransition
              timeout={500}
              classNames="fade"
              key={user.id}
            >
              <div
                ref={infiniteRef}
                className="bg-white dark:bg-indigo-1000 rounded-md overflow-hidden mb-4 shadow-sm dark:shadow-none" key={user.id}>
                <UserCard profile={user} />
              </div>
            </CSSTransition>
          ))}
        </div>
      </TransitionGroup>
      {(isLoading && people.length >= 10 && !error) && (
        <div className="px-4 py-14 flex items-center justify-center">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default SuggestedPeople;
