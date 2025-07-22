export type NotifyMessageContent = {
  orderId: string;
  orderItemId?: string;
  dishId?: string;
  ingredient?: Ingredient;
  type: 'orderItem' | 'order' | 'ingredient';
  status: OrderStatus;
};

export type Ingredient = {
  id: string;
  name: string;
  stock: number;
};

export type OrderStatus =
  | 'pending'
  | 'completed'
  | 'waiting'
  | 'preparing'
  | 'created';
