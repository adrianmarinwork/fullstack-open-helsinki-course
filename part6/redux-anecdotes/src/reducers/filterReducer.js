const filterReducer = (state = '', action) => {
  switch (action.type) {
    case 'FILTER':
      return action.payload;
  }

  return state;
};

export const filterByText = (text) => {
  return {
    type: 'FILTER',
    payload: text,
  };
};

export default filterReducer;
