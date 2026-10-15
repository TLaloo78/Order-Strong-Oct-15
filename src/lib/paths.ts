export const restaurantPath = (restaurantId: string) => `/r/${restaurantId}`
export const dishPath = (restaurantId: string, dishId: string) =>
  `/r/${restaurantId}/dish/${dishId}`
