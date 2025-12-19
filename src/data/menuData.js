// Menu data with high-quality image URLs
export const menuData = {
  breakfast: [
    {
      id: 'idlyset',
      name: 'Idly Set',
      price: 20,
      category: 'breakfast',
      imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
      description: 'Soft and fluffy idlis served with sambar and chutney'
    },
    {
      id: 'pooriset',
      name: 'Poori Set',
      price: 40,
      category: 'breakfast',
      imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
      description: 'Crispy pooris with potato curry'
    },
    {
      id: 'dosaset',
      name: 'Dosa Set',
      price: 30,
      category: 'breakfast',
      imageUrl: 'https://images.unsplash.com/photo-1615826932727-ed9f4ac5e24f?w=400&h=300&fit=crop',
      description: 'Golden crispy dosa with sambar and coconut chutney'
    },
    {
      id: 'tea',
      name: 'Tea',
      price: 10,
      category: 'breakfast',
      imageUrl: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop',
      description: 'Hot and refreshing tea'
    },
    {
      id: 'coffee',
      name: 'Coffee',
      price: 15,
      category: 'breakfast',
      imageUrl: 'https://images.unsplash.com/photo-1514432324605-a81574e8e4b3?w=400&h=300&fit=crop',
      description: 'Rich and aromatic filter coffee'
    },
    {
      id: 'vada',
      name: 'Vada',
      price: 10,
      category: 'breakfast',
      imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop',
      description: 'Crispy lentil vada with chutney'
    }
  ],
  lunch: [
    {
      id: 'meals',
      name: 'Meals',
      price: 60,
      category: 'lunch',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
      description: 'Complete South Indian thali with rice, curry, and sides'
    },
    {
      id: 'porotaset',
      name: 'Porota Set',
      price: 40,
      category: 'lunch',
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70946?w=400&h=300&fit=crop',
      description: 'Flaky layered porota with curry'
    },
    {
      id: 'biryani',
      name: 'Biryani',
      price: 80,
      category: 'lunch',
      imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop',
      description: 'Fragrant basmati rice with spices and meat'
    },
    {
      id: 'friedrice',
      name: 'Fried Rice',
      price: 50,
      category: 'lunch',
      imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
      description: 'Spiced fried rice with vegetables'
    },
    {
      id: 'curryrice',
      name: 'Curry Rice',
      price: 45,
      category: 'lunch',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
      description: 'Steamed rice with curry'
    }
  ],
  dinner: [
    {
      id: 'idlyset_dinner',
      name: 'Idly Set',
      price: 20,
      category: 'dinner',
      imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
      description: 'Soft and fluffy idlis served with sambar and chutney'
    },
    {
      id: 'pooriset_dinner',
      name: 'Poori Set',
      price: 40,
      category: 'dinner',
      imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
      description: 'Crispy pooris with potato curry'
    },
    {
      id: 'dosaset_dinner',
      name: 'Dosa Set',
      price: 30,
      category: 'dinner',
      imageUrl: 'https://images.unsplash.com/photo-1615826932727-ed9f4ac5e24f?w=400&h=300&fit=crop',
      description: 'Golden crispy dosa with sambar and coconut chutney'
    },
    {
      id: 'tea_dinner',
      name: 'Tea',
      price: 10,
      category: 'dinner',
      imageUrl: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop',
      description: 'Hot and refreshing tea'
    },
    {
      id: 'coffee_dinner',
      name: 'Coffee',
      price: 15,
      category: 'dinner',
      imageUrl: 'https://images.unsplash.com/photo-1514432324605-a81574e8e4b3?w=400&h=300&fit=crop',
      description: 'Rich and aromatic filter coffee'
    },
    {
      id: 'vada_dinner',
      name: 'Vada',
      price: 10,
      category: 'dinner',
      imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop',
      description: 'Crispy lentil vada with chutney'
    }
  ]
};

export const getAllMenuItems = () => {
  return [
    ...menuData.breakfast,
    ...menuData.lunch,
    ...menuData.dinner
  ];
};


