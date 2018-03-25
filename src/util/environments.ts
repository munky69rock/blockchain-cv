const isDevelopment = (): boolean => {
  return /^localhost(?::\d+)?$/.test(location.host);
};

export { isDevelopment };
