export type NotifyMessageContent = {
  orderId: string;
  orderItemId?: string;
  dishId?: string;
  ingredient?: Ingredient;
  type: 'orderItem' | 'order' | 'ingredient';
  status: 'pending' | 'completed';
};

export type Ingredient = {
  id: string;
  name: string;
  stock: number;
};
