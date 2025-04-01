import { createObserver } from "./createObserver";

export const createRouter = (routes) => {
  const baseUrl = import.meta.env.VITE_BASE_URL ?? "/";

  const { subscribe, notify } = createObserver();

  const getPath = () => {
    const fullPath = window.location.pathname;
    const path =
      baseUrl === "/"
        ? fullPath
        : fullPath.replace(new RegExp(`^${baseUrl}`), "");
    console.log("Current Path:", path); // 현재 경로 출력
    return path;
  };

  const getTarget = () => routes[getPath()];

  const push = (path) => {
    const url = baseUrl === "/" ? path : `${baseUrl}${path}`;
    window.history.pushState(null, null, url);
    console.log("Pushed URL:", url); // 푸시된 URL 출력
    notify();
  };

  window.addEventListener("popstate", () => notify());

  return {
    get path() {
      return getPath();
    },
    push,
    subscribe,
    getTarget,
  };
};
