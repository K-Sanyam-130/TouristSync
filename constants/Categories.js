export const CATEGORY_ICONS = {
  Heritage: 'business',
  Nature: 'leaf',
  Temple: 'heart',
  Beach: 'water',
  Wildlife: 'paw',
  All: 'apps',
};

export const CATEGORY_COLORS = {
  Heritage: '#C9A84C',
  Nature: '#10B981',
  Temple: '#F59E0B',
  Beach: '#3B82F6',
  Wildlife: '#8B5CF6',
  All: '#C9A84C',
};

export const CATEGORY_PLACEHOLDER_IMAGES = {
  Heritage: [
    'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=400&q=70', // generic old fort/palace
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&q=70', // ancient stone ruins
    'https://images.unsplash.com/photo-1548013146-72479768bada?w=400&q=70', // heritage architecture
  ],
  Nature: [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=70', // generic mountain landscape
    'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&q=70', // waterfall in forest
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=70', // misty green valley
  ],
  Temple: [
    'https://images.unsplash.com/photo-1545126178-862cdb469856?w=400&q=70', // generic temple silhouette
    'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400&q=70', // ornate temple interior
    'https://images.unsplash.com/photo-1604928141064-207cea6f571f?w=400&q=70', // temple with light
  ],
  Beach: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=70', // generic tropical beach
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&q=70', // sandy shore with waves
    'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=400&q=70', // calm sea horizon
  ],
  Wildlife: [
    'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=400&q=70', // dense jungle canopy
    'https://images.unsplash.com/photo-1549366021-9f761d450615?w=400&q=70', // safari trail
    'https://images.unsplash.com/photo-1504173010664-32509aeebb62?w=400&q=70', // wildlife forest path
  ],
};

export function getPlaceImage(place, index = 0) {
  const imgs = CATEGORY_PLACEHOLDER_IMAGES[place.category] || CATEGORY_PLACEHOLDER_IMAGES.Nature;
  return imgs[index % imgs.length];
}
