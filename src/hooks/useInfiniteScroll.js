// import { useEffect, useRef, useState, useCallback } from 'react';

// /**
//  * Custom hook for Infinite Scrolling using IntersectionObserver.
//  * 
//  * @param {Function} loadMore - Function to call when the sentinel comes into view.
//  * @param {boolean} hasMore - Flag indicating if there is more data to load.
//  * @returns {React.RefObject} - Ref to attach to the sentinel element at the bottom of the list.
//  */
// export function useInfiniteScroll(loadMore, hasMore) {
//   const [isFetching, setIsFetching] = useState(false);
//   const observerTarget = useRef(null);

//   const handleObserver = useCallback((entries) => {
//     const [target] = entries;
//     if (target.isIntersecting && hasMore && !isFetching) {
//       setIsFetching(true);
//       // We wrap the loadMore call to handle async resolution
//       Promise.resolve(loadMore()).finally(() => setIsFetching(false));
//     }
//   }, [loadMore, hasMore, isFetching]);

//   useEffect(() => {
//     const element = observerTarget.current;
//     if (!element) return;

//     // Create observer
//     const observer = new IntersectionObserver(handleObserver, {
//       root: null,
//       rootMargin: '100px', // Trigger slightly before the user reaches the bottom
//       threshold: 0.1
//     });

//     observer.observe(element);

//     return () => {
//       if (element) observer.unobserve(element);
//     };
//   }, [handleObserver]);

//   return observerTarget;
// }
