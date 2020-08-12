export const SERVER = (() => {
  if (process.env.NODE_ENV === "test") {
    return "http://localhost:10001/graphql";
  }
  if (process.env.NODE_ENV === "production") {
    return "http://localhost:10002/graphql";
  }

  return "http://localhost:10000/graphql";
})();

export const WEB_SOCKET_LINK = (() => {
  if (process.env.NODE_ENV === "test") {
    return "ws://localhost:10001/graphql";
  }
  if (process.env.NODE_ENV === "production") {
    return "ws://localhost:10002/graphql";
  }

  return "ws://localhost:10000/graphql";
})();
