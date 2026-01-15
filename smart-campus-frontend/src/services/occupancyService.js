let subscribers = [];

export const subscribeOccupancy = (callback) => {
  subscribers.push(callback);
};

export const startAutoRefresh = () => {
  setInterval(() => {
    const newStatuses = ["available", "occupied", "partial"];
    const rooms = ["Room A", "Room B", "Lab 1", "Lab 2"].map((r) => ({
      name: r,
      status: newStatuses[Math.floor(Math.random() * newStatuses.length)],
    }));

    subscribers.forEach((cb) => cb(rooms));
  }, 60000); // every 60 seconds
};
