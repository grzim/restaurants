
export type UserType = 'Regular' | 'Owner' | 'Admin' | '';

export interface User {
  id: string;
  type: UserType;
  email: Email;
  name: string;
}


export type UserWithPassword = User & {
  password: string;
};

export type RestaurantOwner = User & {
  type: 'Owner',
  restaurantOwned: string
};

export interface RestaurantRating {
  restaurantId: string;
  rating: number;
}

export type Email = string;

export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  ownerId: string;
  reviews: Review[];
}

export interface ReviewResponse {
  id: string;
  reviewId: string;
  text: string;
}

export type EditedUser =  {
  id: string;
} & Partial<User>;


export interface Credentials {
  email: Email;
  password: string;
}

export interface Review {
  id: string;
  restaurantId: string;
  authorName: string;
  dateOfVisit: Date;
  text: string;
  rating: number;
  response?: string;
}

export type ReviewToSend = Review & {
  userId: string;
}

export type NewUserData = Credentials & {
  name: string
};
